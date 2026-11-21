# HDP Counting Downtime DIJ — System Architecture

**HDP Counting Downtime DIJ** follows a compact, single-context ASP.NET MVC 5 architecture paired with an autonomous client-side state/sync engine and a static in-process Excel export scheduler. Unlike larger multi-context dashboards such as HDP OEE Neo Spray, all persistence flows through a single Entity Framework 6 context (`HDPStudioEntities`).

---

## 1. High-Level Component Architecture

```mermaid
flowchart TB
    subgraph Client["Shopfloor Browser / Standalone PWA (Index.cshtml)"]
        UI["2-Column Dark UI & Live Stopwatch"]
        PWA["Dynamic Manifest Link (#appManifestLink)"]
        Sync["4-Layer Sync Engine (BroadcastChannel + storage + 3s Poll + Focus)"]
        CSRF["Anti-Forgery Token (__RequestVerificationToken)"]
    end

    subgraph Layout["Shared Shell (_Layout_HDPStudio.cshtml)"]
        Header["HDP Studio Header & App Launcher"]
        AuthGate["Auth Bypass (currentController == CountingDowntimeDIJ)"]
    end

    subgraph Server["ASP.NET MVC 5 (CountingDowntimeDIJController.cs)"]
        ViewAct["GET Index & Manifest"]
        ReadAPI["GET GetMachines & GetMachineStatus"]
        WriteAPI["POST StartDowntime, StopDowntime, SubmitNotes"]
        Timer["Static System.Threading.Timer (_exportTimer)"]
        EPPlus["EPPlus Exporter (ExportDataToNetworkPathStatic)"]
    end

    subgraph DB["SQL Server (HDPStudioEntities)"]
        MstMc["hdps_common_mst_machine (C05 Active Machines)"]
        LogDt["hdps_cddij_log_downtime (Active & Historical Logs)"]
        ExpCfg["hdps_common_mst_exportedpath (Export Schedule Config)"]
    end

    subgraph Storage["Shared Network File Server"]
        Xlsx["Counting Downtime DIJ.xlsx"]
    end

    Layout --> Client
    PWA -->|"GET /Manifest?machine=..."| ViewAct
    UI -->|"GET /GetMachineStatus"| ReadAPI
    Sync -->|"Background Poll & Focus Refresh"| ReadAPI
    UI -->|"POST + CSRF Token"| WriteAPI
    CSRF -.-> WriteAPI

    ViewAct --> MstMc
    ReadAPI --> MstMc
    ReadAPI --> LogDt
    WriteAPI --> MstMc
    WriteAPI --> LogDt

    Timer -->|"Every fduration sec"| ExpCfg
    Timer --> EPPlus
    EPPlus -->|"Query all active C05 logs"| LogDt
    EPPlus -->|"Overwrite .xlsx"| Xlsx
```

### Architectural Layer Responsibilities

| Layer | Responsibility | Key Files / Symbols |
| :--- | :--- | :--- |
| **Shell & Access** | Renders HDP Studio navigation, skips session login gate for kiosk readiness | `Views/Shared/_Layout_HDPStudio.cshtml` |
| **Presentation & Sync** | Renders machine selector, live `HH:MM:SS` timer, 5-row history table, dynamic PWA manifest, and multi-window sync | `Views/CountingDowntimeDIJ/Index.cshtml` |
| **Controller API** | Serves views/manifests, enforces single-active-downtime rule, validates CSRF tokens, computes elapsed seconds | `Controllers/CountingDowntimeDIJController.cs` |
| **Scheduled Reporting** | Static background timer that polls SQL export config and regenerates a 9-column `.xlsx` workbook via EPPlus | `_exportTimer`, `OnExportTimerCallback`, `ExportDataToNetworkPathStatic` |
| **Database (`HDPStudioEntities`)** | Stores master `C05` machines, transactional downtime logs, and dynamic export parameters | `hdps_common_mst_machine`, `hdps_cddij_log_downtime`, `hdps_common_mst_exportedpath` |

---

## 2. Downtime Start, Stop & Notes Transaction Sequence

Every write operation (`StartDowntime`, `StopDowntime`, `SubmitNotes`) submits `application/x-www-form-urlencoded` form data including `__RequestVerificationToken`, updates SQL Server synchronously, refreshes the local machine status, and broadcasts a cross-tab event to other open windows.

```mermaid
sequenceDiagram
    actor Op as Operator (Tab A)
    participant TabA as Tab A / PWA (Index.cshtml)
    participant Ctrl as CountingDowntimeDIJController
    participant DB as SQL Server (HDPStudioEntities)
    participant TabB as Tab B / Same Machine

    Op->>TabA: Click Start (machineName, optional notes)
    TabA->>Ctrl: POST /StartDowntime (+ __RequestVerificationToken)
    Ctrl->>DB: Check existing active row (C05, machine, stop == null, active == 1)
    alt Active downtime already exists
        Ctrl-->>TabA: JSON { success: false, message: "...already has an active downtime..." }
        TabA-->>Op: Error toast & re-enable Start button
    else No active downtime
        Ctrl->>DB: Lookup fmachine_code & fmachine_no from hdps_common_mst_machine
        Ctrl->>DB: INSERT hdps_cddij_log_downtime (fdowntime_start = now, stop = null)
        Ctrl-->>TabA: JSON { success: true, fno, start_iso, start_display }
        TabA->>TabA: Activate live 1s stopwatch + clear Notes box
        TabA->>TabB: BroadcastChannel + localStorage ("start", machine)
        TabB->>Ctrl: GET /GetMachineStatus?machineName=... (background)
        Ctrl-->>TabB: JSON { isDowntimeActive: true, active, logs[5] }
    end

    Op->>TabA: Type remarks & click Submit notes
    TabA->>Ctrl: POST /SubmitNotes (machineName, fno, notes, CSRF)
    Ctrl->>DB: UPDATE fnotes & fupdated_at on target/latest active row
    Ctrl-->>TabA: JSON { success: true, fno, notes }
    TabA->>TabB: BroadcastChannel + localStorage ("notes", machine)

    Op->>TabA: Click Stop (machineName, fno, optional notes)
    TabA->>Ctrl: POST /StopDowntime (machineName, fno, notes, CSRF)
    Ctrl->>DB: UPDATE fdowntime_stop = now, fdowntime_elapsed = max(0, sec), fnotes (if non-blank)
    Ctrl-->>TabA: JSON { success: true, stop_display, elapsed_seconds, elapsed_display }
    TabA->>TabA: Reset controls to Ready & reload top 5 logs
    TabA->>TabB: BroadcastChannel + localStorage ("stop", machine)
```

---

## 3. 4-Layer Multi-Window Sync & Dynamic PWA Flow

Operators frequently keep the same DIJ machine open in both a shopfloor tablet PWA and a supervisor desktop browser. The view layers four complementary refresh triggers to balance instant same-browser feedback with multi-device consistency:

```mermaid
flowchart LR
    subgraph Mutations["Write Trigger (Tab A)"]
        Act["Start / Stop / SubmitNotes succeeds"]
        Emit["broadcastDowntimeEvent(action, machine)"]
    end

    subgraph Layers["4 Sync Layers (Tab B / Remote Device)"]
        L1["Layer 1: BroadcastChannel (hdps_downtime_sync_channel)"]
        L2["Layer 2: window storage event (hdps_downtime_sync_event)"]
        L3["Layer 3: 3-Second Heartbeat Poll (startStatusPolling)"]
        L4["Layer 4: window focus & visibilitychange"]
    end

    subgraph Guard["Concurrency & UX Guard"]
        Lock["_isFetchingStatus mutex"]
        Fetch["fetchMachineStatus(machine, preserveNotes=true, isBackground=true)"]
        Render["Update Stopwatch State + 5-Row History Table"]
    end

    subgraph Manifest["Per-Machine PWA Identity"]
        Url["URL ?A01 / pushState"]
        Link["Manifest Link (#appManifestLink) -> /Manifest?machine=A01"]
        Launch["launch_handler.client_mode = focus-existing"]
    end

    Act --> Emit
    Emit --> L1
    Emit --> L2
    L1 -->|"machine === _currentMachine"| Lock
    L2 -->|"machine === _currentMachine"| Lock
    L3 -->|"Every 3000ms"| Lock
    L4 -->|"On tab focus / resume"| Lock
    Lock --> Fetch --> Render
    Url --> Link --> Launch
```

---

## 4. Background Scheduled Excel Auto-Export Pipeline

Unlike manual download buttons, Excel export runs continuously on the server through a static `System.Threading.Timer` initialized in the static constructor of `CountingDowntimeDIJController`.

```mermaid
flowchart TB
    Init["Static Constructor (First Controller Hit)"]
    LoadInit["Read initial fduration from hdps_common_mst_exportedpath (fallback: 300s)"]
    StartTimer["Create _exportTimer (dueTime: 10s, period: initialDuration)"]
    Tick["OnExportTimerCallback Fires"]
    ReadCfg["Query active config: C05 + Counting Downtime DIJ + fproject_no = 1"]
    ActiveCheck{"Config found and fis_active == true?"}
    Skip["Return silently (Export paused)"]
    Reschedule["If fduration > 0: _exportTimer.Change(newInterval, newInterval)"]
    EnsureDir["Resolve fpath (or fallback UNC dir) & Directory.CreateDirectory"]
    QueryLogs["Query hdps_cddij_log_downtime (fis_active == true, C05, DESC by start)"]
    BuildXlsx["EPPlus ExcelPackage (NonCommercial): 9 columns, bold headers, AutoFitColumns"]
    SaveFile["package.SaveAs(Path.Combine(networkDir, fileName))"]

    Init --> LoadInit --> StartTimer --> Tick --> ReadCfg --> ActiveCheck
    ActiveCheck -->|"No"| Skip
    ActiveCheck -->|"Yes"| Reschedule --> EnsureDir --> QueryLogs --> BuildXlsx --> SaveFile
```

---

## 5. Security, Concurrency & Operational Observations

The following architectural details and improvement opportunities were verified directly from `CountingDowntimeDIJController.cs` and `Index.cshtml`:

### Verified Strengths
- **Complete CSRF Protection (CWE-352):** All three `[HttpPost]` endpoints (`StartDowntime`, `StopDowntime`, `SubmitNotes`) are decorated with `[ValidateAntiForgeryToken]`, and the Razor view renders `@Html.AntiForgeryToken()` and attaches `__RequestVerificationToken` to every POST payload via `getCsrfToken()`.
- **Parameterized Queries Only (CWE-89):** Every database read and write uses strongly typed Entity Framework 6 LINQ queries with zero raw SQL string concatenation.
- **Polling Concurrency Lock:** The frontend `_isFetchingStatus` boolean prevents overlapping `GetMachineStatus` requests from piling up on slow shopfloor Wi-Fi connections, and `isBackground = true` suppresses noisy error toasts during transient network blips.
- **Non-Destructive Typing During Sync:** Background refreshes pass `preserveNotes = true`, ensuring an operator typing root-cause notes in `#inputNotes` does not lose unsaved text every 3 seconds.

### Operational & Hardening Considerations

> [!WARNING]
> **Frontend `innerHTML` Escaping (`renderTableLogs` & `showToast`):** In `Views/CountingDowntimeDIJ/Index.cshtml`, `renderTableLogs()` interpolates `log.notes` directly into `title="${log.notes || ''}"` and table cell `innerHTML`, and `showToast()` interpolates `message` into `toast.innerHTML`. If notes contain HTML characters (`<`, `>`, `"`), markup can break or introduce stored/reflected XSS risk. Escaping text or using `textContent` / `setAttribute` is recommended in a future `inside-mvc` hardening pass.

> [!NOTE]
> **`StopDowntime` Explicit `fno` Lookup:** When `fno > 0` is posted to `StopDowntime`, the controller searches `x => x.fno == fno.Value && x.fis_active == true` without requiring `x.fdowntime_stop == null`. Under normal UI usage `_activeFno` is cleared immediately after Stop, so this does not trigger; however, replaying an already-stopped `fno` directly against the endpoint would overwrite `fdowntime_stop` and `fdowntime_elapsed`.

- **IIS AppDomain Timer Lifecycle:** Because `_exportTimer` is a `static readonly System.Threading.Timer` inside the MVC controller class:
  - The timer only starts after the **first request** initializes `CountingDowntimeDIJController` following an IIS app-pool start or recycle.
  - If IIS recycles or suspends an idle AppDomain, scheduled exports pause until the next HTTP hit arrives.
  - If deployed in a multi-worker IIS Web Garden (`Max Worker Processes > 1`), multiple processes could write to the same `.xlsx` target concurrently and trigger file-locking `IOException`s.
- **Silent Background Error Logging:** Exceptions in `OnExportTimerCallback` and `ExportDataToNetworkPathStatic` are caught and written only to `System.Diagnostics.Debug.WriteLine(...)`, which is not persisted to a SQL error log or Windows Event Log in release builds.
- **Intentional `null` User Audit Columns:** Both `fcreated_by` and `fupdated_by` are explicitly set to `null` because shopfloor kiosks run without requiring an authenticated INSIDE user session.
- **Unused Utility Hooks:** `GET /CountingDowntimeDIJ/GetMachines` in the controller and `refreshCurrentMachineStatus()` in `Index.cshtml` are defined as reusable helpers not invoked during standard UI interaction.

---

## Next Step

Explore the interactive frontend, 12-color machine identity palette, dynamic PWA installation, and 4-layer sync engine in [UI, PWA & Real-Time Sync](./ui-pwa-and-sync.md).
