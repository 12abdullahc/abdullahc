# HDP Counting Downtime DIJ — Overview

**HDP Counting Downtime DIJ** is a real-time shopfloor downtime stopwatch, cause-notes logger, and scheduled Excel reporting module inside the **HDP Studio** suite (solution `LoginAndRegisterMVCMD5.sln`, repository `inside-mvc`). Built specifically for **Digital Inkjet (DIJ)** production machines (`fprocess_code = "C05"`, `fproject_no = 1`), it enables operators to start and stop live downtime timers per machine, capture root-cause notes, synchronize status across multiple tablets or PCs in real time, and export downtime logs automatically to a shared network workbook.

> [!NOTE]
> All module identifiers, controller actions, Razor views, Entity Framework entities, and synchronization mechanics documented here are verified directly against `inside-mvc`. Credentials, connection strings, personal email addresses, and internal file-server hostnames are intentionally sanitized or excluded.

---

## Purpose & Operational Scope

HDP Counting Downtime DIJ supports two tightly coupled shopfloor and engineering workflows:

1. **Shopfloor Downtime Capture (Operator / Machine Kiosk View):** Provides a distraction-free dark-mode stopwatch panel tied to active `C05` machines. Operators select a machine (or open a dedicated machine PWA shortcut), press **Start** when a stoppage occurs, record root-cause remarks in **Downtime Notes**, press **Stop** when production resumes, and immediately inspect the latest **5 downtime records** for that machine.
2. **Engineering Traceability & Automated Reporting (Supervisor / BI View):** Persists every downtime event (`fdowntime_start`, `fdowntime_stop`, `fdowntime_elapsed` in seconds, and `fnotes`) in `hdps_cddij_log_downtime` and runs an in-process background scheduler (`System.Threading.Timer`) that periodically generates an up-to-date `.xlsx` workbook via **EPPlus** on a configured shared network path without manual intervention.

---

## Technology Stack

| Layer | Technology / Component | Usage in HDP Counting Downtime DIJ |
| :--- | :--- | :--- |
| **Runtime & Web Framework** | ASP.NET MVC 5 · .NET Framework 4.7.2 | Routing, Razor view rendering, CSRF-protected JSON API (`CountingDowntimeDIJController.cs`) |
| **ORM & Persistence** | Entity Framework 6 (Database-First EDMX) · SQL Server | Single `DbContext` (`HDPStudioEntities`) across 3 tables |
| **Layout Shell** | Razor `_Layout_HDPStudio.cshtml` | Top navigation bar (`HDP Counting Downtime DIJ`), app launcher, mobile breakpoint `1030px`, auth exemption |
| **Frontend UI** | Vanilla ES6 JavaScript · CSS Grid · FontAwesome 6 | 2-column dark layout, 12-color machine identity system, tabular-nums stopwatch, toast stack |
| **Real-Time Sync** | `BroadcastChannel` · `localStorage` · `setInterval` · Visibility API | 4-layer synchronization keeping browser tabs, standalone PWAs, and remote stations aligned |
| **Installable PWA** | Dynamic Web App Manifest (`/CountingDowntimeDIJ/Manifest`) | Per-machine standalone install with `launch_handler.client_mode = "focus-existing"` *(no service worker)* |
| **Automated Export** | `System.Threading.Timer` · EPPlus (`OfficeOpenXml`, `NonCommercial`) | Dynamic SQL-driven scheduled `.xlsx` export to a network share |

---

## Entry Points & HDP Studio Integration

The module is a single-page MVC workflow rooted at `/CountingDowntimeDIJ` (`Index` action) and surfaced across three navigation points inside `inside-mvc`:

| Entry Point | Source File | Label / Presentation | Behavior |
| :--- | :--- | :--- | :--- |
| **HDP Studio Hub** | `Views/HDPStudio/Index.cshtml` | Card **#5 — Counting Downtime DIJ** (category `DIJ`, banner `#6A9BCC`) | Opens `~/CountingDowntimeDIJ` in a new tab; searchable via keywords `counting downtime dij stop clock timer duration cause analysis machines pwa` |
| **HDP Studio App Launcher** | `Views/Shared/_Layout_HDPStudio.cshtml` | **Counting Downtime DIJ** (Mattel icon tile) | Opens `~/CountingDowntimeDIJ` in a new tab from any HDP Studio header |
| **Legacy INSIDE Sidebar** | `Views/Shared/_LayoutPage4.cshtml` | **Counting Dt DIJ** | Navigates to `~/CountingDowntimeDIJ` from the legacy INSIDE shell |
| **Direct Machine Deep Link** | `Views/CountingDowntimeDIJ/Index.cshtml` | `/CountingDowntimeDIJ?A01` or `/CountingDowntimeDIJ?machine=A01` | Pre-selects the target machine (case-insensitive), updates the dynamic PWA manifest, and loads live status immediately |

> [!IMPORTANT]
> **Shopfloor Authentication Exemption:** In `Views/Shared/_Layout_HDPStudio.cshtml`, `currentController == "CountingDowntimeDIJ"` bypasses the standard `Session["us_usrname"]` login gate. This allows shopfloor tablets, kiosks, and installed per-machine PWAs to stay continuously active across shift handovers without prompting operators to re-authenticate. As a consequence, `fcreated_by` and `fupdated_by` are written as `null` on downtime records.

---

## Key Capabilities at a Glance

- **Single Active Downtime Enforcement:** The backend prevents duplicate overlapping stoppages for the same machine (`fprocess_code = "C05"`, `fdowntime_stop == null`, `fis_active == true`).
- **12-Color Machine Visual Coding:** Each active `C05` machine automatically receives a deterministic high-contrast color from a 12-color palette applied to both the dropdown selector and the history table header badge (`Machine <Name>`) so operators can tell stations apart at a glance.
- **Per-Machine Standalone PWA Installation:** Selecting machine `A01` dynamically rewrites `<link id="appManifestLink" rel="manifest">` to `/CountingDowntimeDIJ/Manifest?machine=A01`, allowing browsers (Edge/Chrome) to install independent desktop/tablet shortcuts per machine with `focus-existing` window reuse.
- **4-Layer Real-Time Synchronization:** Combines instant same-origin `BroadcastChannel` messaging, `localStorage` `storage` event fallback, 3-second background heartbeat polling (with concurrency lock and notes preservation), and `focus`/`visibilitychange` refresh hooks.
- **Active-Downtime Machine-Switch Guard:** Attempting to switch to another machine while a stopwatch is actively running triggers a confirmation prompt and restores the previous machine if cancelled.
- **Zero-Restart Auto-Export Configuration:** A static `System.Threading.Timer` re-reads `hdps_common_mst_exportedpath` on every tick, enabling supervisors to toggle `fis_active`, change export frequency (`fduration`), or redirect output path/filename/sheet directly in SQL without recycling IIS.

---

## Documentation Map

| Chapter | What It Covers |
| :--- | :--- |
| 1. **Overview** *(this page)* | Operational scope (`C05`), technology stack, entry points, auth bypass, and key capabilities |
| 2. [System Architecture](./system-architecture.md) | 4 Mermaid architecture/sequence/export diagrams plus verified security, concurrency, and IIS caveats |
| 3. [UI, PWA & Real-Time Sync](./ui-pwa-and-sync.md) | 2-column layout, 12-color palette, state machine, URL deep-linking, dynamic PWA manifest, and 4-layer sync |
| 4. [API & Auto-Export Reference](./api-and-auto-export.md) | All 7 `CountingDowntimeDIJController` endpoints, payloads, `FormatSeconds` rules, and EPPlus `.xlsx` schema |
| 5. [Database Schema](./database-schema.md) | ER diagram and column-by-column reference for all 3 `HDPStudioEntities` tables |
| 6. [Operator & Supervisor Guide](./user-guide.md) | Daily floor usage, installing per-machine PWAs, SQL auto-export tuning, and troubleshooting |
