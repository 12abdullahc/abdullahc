# HDP OEE Neo Spray — System Architecture

This document details the end-to-end technical architecture of **HDP OEE Neo Spray** inside `inside-mvc` (`LoginAndRegisterMVCMD5.sln`), covering its layered MVC design, dual Entity Framework `DbContext` persistence boundaries, layout-to-view custom event bus, live vs. historical OEE calculation pipeline, reject input transaction flow, and database relationships.

---

## 1. High-Level Component Architecture

HDP OEE Neo Spray follows a **Server-Rendered Razor Shell + AJAX/JSON Polling** architecture on ASP.NET MVC 5 (.NET Framework 4.7.2). A notable architectural characteristic is its **Dual `DbContext` Persistence Layer**, bridging newer HDP Studio analytical SQL views (`HDPStudioEntities`) with operational OEE Studio tables (`HDPStudioOEEStudioEntities`).

```mermaid
flowchart TD
    subgraph Client["Browser Client (Shopfloor TV / Supervisor / Operator)"]
        Layout["_Layout_HDPStudio.cshtml<br/>Header Nav · Right Sidebar (Filter / Settings / Export / Changelog)"]
        LiveView["NeoSprayLayout.cshtml<br/>51-Machine Grid · KPI Table · 3 Chart.js Charts"]
        RejectView["NeoSprayInputReject.cshtml<br/>Cascading Throw-off Reject Form"]
        ReportView["NeoSprayReport.cshtml<br/>Embedded Power BI iframe"]
        Layout -- "Custom DOM Events" --> LiveView
    end

    subgraph MVC["ASP.NET MVC 5 — Controllers/OEEController.cs"]
        Pages["Page Actions<br/>NeoSprayLayout · NeoSprayInputReject · NeoSprayReport<br/>NeoSprayOEE / Availability / Performance / Quality"]
        ReadAPI["Analytics & Status JSON APIs<br/>GetNeoSprayOEEMetrics · GetNeoSprayLowestOEE<br/>GetNeoSprayDowntime · GetNeoSprayReject<br/>GetSemiAutoSprayMachines · GetNeoSprayFilterOptions"]
        WriteAPI["Mutation & Export Actions<br/>SaveNeoSprayInputReject · UpdateOEECalculationMode<br/>GetOEECalculationMode · EndShift · ExportNeoSpray"]
    end

    subgraph DB1["EF6: HDPStudioEntities (dbHDPSStudioEntities)"]
        V_OEE["vw_hdps_oeens_log_oee (C073)"]
        V_DT["vw_hdps_oeens_log_downtime (C073)"]
        V_REJ["vw_hdps_oeens_log_reject (C073)"]
        M_TIME["hdps_common_mst_productiontime"]
        M_SET["hdps_common_mst_setting"]
    end

    subgraph DB2["EF6: HDPStudioOEEStudioEntities (db / dbHdpsOeeStudio)"]
        T_CUR["hdps_oee_cur_condition (C07)"]
        T_OEE["AS_OEE & AS_OEE_Support"]
        T_REJ["AS_Reject & Code_Reject"]
        T_PBI["hdps_pbi_link"]
    end

    Client --> Pages
    LiveView --> ReadAPI
    Layout --> ReadAPI
    Layout --> WriteAPI
    RejectView --> WriteAPI

    ReadAPI --> V_OEE
    ReadAPI --> V_DT
    ReadAPI --> V_REJ
    ReadAPI --> M_TIME
    ReadAPI --> M_SET
    ReadAPI --> T_CUR
    ReadAPI --> T_OEE

    WriteAPI --> M_SET
    WriteAPI --> T_CUR
    WriteAPI --> T_OEE
    WriteAPI --> T_REJ
    Pages --> T_PBI
    Pages --> T_OEE
```

### Architectural Layer Responsibilities

| Layer | Key Artifacts | Responsibility |
| :--- | :--- | :--- |
| **Shared Shell** | `Views/Shared/_Layout_HDPStudio.cshtml` | Detects `isNeoSpray` / `isNeoSpraySidebar`, bypasses auth wall for shopfloor monitors, owns right-sidebar filter state, calculation mode switcher, End-Shift trigger, and file export downloads. |
| **Feature Views** | `Views/OEE/NeoSprayLayout.cshtml`, `NeoSprayInputReject.cshtml`, `NeoSprayReport.cshtml` | Renders shopfloor machine grid, KPI summary, scrollable horizontal Chart.js pareto charts, cascading reject entry form, and Power BI report frame. |
| **Controller** | `Controllers/OEEController.cs` | Serves Razor views, computes Live/Historical OEE metrics (Simple & Aggregate), resolves shift windows dynamically, recalculates reject impact, and streams CSV/XLSX/PDF exports. |
| **Analytics Data Layer** | `HDPStudioEntities` (`Models/HDPStudio.Context.cs`) | Provides read access to Neo Spray SQL views (`vw_hdps_oeens_log_*`) scoped to `fmachine_code = "C073"` plus master shift times and calculation mode settings. |
| **Operational Data Layer** | `HDPStudioOEEStudioEntities` (`Models/HDPStudioOEEStudio.Context.cs`) | Provides live floor state (`hdps_oee_cur_condition`), filter/export source (`AS_OEE`), reject writes (`AS_OEE`, `AS_Reject`, `Code_Reject`), and Power BI embed URLs (`hdps_pbi_link`). |

---

## 2. Frontend Layout, Polling & Custom Event Bus

Rather than coupling sidebar filter widgets directly to page-specific chart functions, `_Layout_HDPStudio.cshtml` acts as an **event emitter** and `NeoSprayLayout.cshtml` acts as a **reactive subscriber**. This allows future Neo Spray tabs (`NeoSprayOEE`, `NeoSprayAvailability`, `NeoSprayPerformance`, `NeoSprayQuality`) to reuse the same filter sidebar without modifying the layout script.

```mermaid
flowchart LR
    subgraph SharedLayout["_Layout_HDPStudio.cshtml (Right Sidebar)"]
        InitFilter["initNeoSprayFilter()<br/>GET GetNeoSprayFilterOptions"]
        FilterUI["#rs-filter Multi-Selects<br/>Year · Month · WE · Date · Shift · Machine"]
        SettingsUI["#rs-settings<br/>Simple / Aggregate Switch · Reset Active Machines"]
        ExportUI["rsDownloadData(format)<br/>GET ExportNeoSpray (csv / xlsx / pdf)"]
        InitFilter --> FilterUI
    end

    subgraph EventBus["Browser Event Bus (document / window)"]
        E1["neoSprayFilterApplied<br/>detail: year, month, we, date, shift, machine"]
        E2["neoSprayFilterCleared"]
        E3["hdpCalculationModeChanged<br/>detail: mode, modeInt"]
    end

    subgraph Dashboard["NeoSprayLayout.cshtml"]
        Poll3s["3s Interval Loop<br/>loadMachineStatus()"]
        Poll30s["30s Interval Loop<br/>Metrics & 3 Charts"]
        KPI["General KPI Table<br/>GET GetNeoSprayOEEMetrics"]
        Charts["3 Chart.js Canvases + Sticky X-Axes<br/>Lowest OEE · Reject · Downtime<br/>(ResizeObserver responsive redraw)"]
        Grid["51-Machine Floor Grid (Lines A-F)<br/>GET GetSemiAutoSprayMachines"]
    end

    FilterUI -- "applyNeoSprayFilter()" --> E1
    FilterUI -- "clearNeoSprayFilter()" --> E2
    SettingsUI -- "setCalculationMode()" --> E3
    SettingsUI -- "POST UpdateOEECalculationMode" --> Reload["window.location.reload()"]
    SettingsUI -- "POST EndShift" --> Reload

    E1 --> KPI
    E1 --> Charts
    E2 --> KPI
    E2 --> Charts
    Poll30s --> KPI
    Poll30s --> Charts
    Poll3s --> Grid
```

### Chart Rendering Pattern in `NeoSprayLayout.cshtml`

Each pareto chart (**Lowest OEE**, **Reject (pcs)**, **Downtime (min)**) uses a **dual-canvas architecture** to keep the horizontal axis visible when many machines or defect categories are present:
1. **Scrollable Bar Canvas** (`#lowestOeeChart`, `#rejectChart`, `#downtimeChart`) inside a `max-height: 212px; overflow-y: auto;` wrapper whose height grows dynamically based on bar count (`labels.length * PER_BAR`).
2. **Pinned X-Axis Canvas** (`#lowestOeeChartXAxis`, `#rejectChartXAxis`, `#downtimeChartXAxis`) anchored directly below the scroll container (`height: 40px`) synchronized to the same scale.
3. **`ResizeObserver`** monitors all three scroll containers and cleanly destroys/recreates Chart.js instances on viewport resize.

---

## 3. Live vs. Historical Query & OEE Calculation Pipeline

All four Neo Spray analytics endpoints (`GetNeoSprayOEEMetrics`, `GetNeoSprayLowestOEE`, `GetNeoSprayDowntime`, `GetNeoSprayReject`) follow a consistent server-side decision pipeline.

```mermaid
flowchart TD
    Req["Incoming GET Request<br/>(year, month, date, we, shift, machine)"]
    Req --> ShiftLookup["1. Resolve Current Shift<br/>Query hdps_common_mst_productiontime<br/>WHERE fmachine_code = 'C073'"]
    ShiftLookup --> ModeLookup["2. Read OEE Calculation Mode<br/>Query hdps_common_mst_setting<br/>(C07 / C073 / 'OEE Neo Spray')<br/>Default = 1 (Simple)"]
    ModeLookup --> CheckHist{"Any date filter set?<br/>(year / month / we / date)"}

    CheckHist -- "Yes: Historical Mode" --> HistQ["Query vw_hdps_oeens_log_oee<br/>WHERE fmachine_code = 'C073'<br/>Apply Year, Month, WE, Date, Shift, Machine"]
    CheckHist -- "No: Live Mode" --> LiveQ["Query vw_hdps_oeens_log_oee<br/>WHERE fmachine_code = 'C073'<br/>AND fdate_at = today AND fshift = liveShift<br/>AND fstatus IN ('Active', 'Done')"]

    HistQ --> CalcBranch{"calculationMode == 2?"}
    LiveQ --> CalcBranch

    CalcBranch -- "Mode 2: Aggregate OEE" --> Agg["Sum raw numerators & denominators:<br/>A = Sum(foperating_time) / Sum(favailable_time)<br/>P = Sum(factual_output) / Sum(fstandard_output)<br/>Q = Sum(fgood_output) / Sum(factual_output)<br/>OEE = A * P * Q"]
    CalcBranch -- "Mode 1: Simple OEE" --> Simple["Arithmetic mean of record ratios:<br/>A = Avg(favailability)<br/>P = Avg(fperformance)<br/>Q = Avg(fquality)<br/>OEE = Avg(foee) or A * P * Q"]

    Agg --> AuxData["Join Downtime & Reject Totals by foee_id<br/>vw_hdps_oeens_log_downtime (all rows, hrs)<br/>vw_hdps_oeens_log_reject"]
    Simple --> AuxData

    AuxData --> PureLive{"Pure Live Mode?<br/>(no shift or machine filter)"}
    PureLive -- "Yes" --> LastOEE["Compute Last OEE (S1, S2, S3)<br/>Lookback today / yesterday shifts<br/>using active calculationMode"]
    PureLive -- "No" --> NullLast["lastOeeS1/S2/S3 = null"]

    LastOEE --> JsonOut["Return JSON Response<br/>(NoStore OutputCache)"]
    NullLast --> JsonOut
```

### Calculation Mode Comparison

| Mode | `fproject_setting_by_integer` | Formula Basis | Best Used When |
| :--- | :---: | :--- | :--- |
| **Simple OEE** | `1` *(default)* | Unweighted average of individual record percentages (`favailability`, `fperformance`, `fquality`, `foee`) | Comparing equal-weight per-run / per-machine percentages |
| **Aggregate OEE** | `2` | Weighted ratio of summed totals: `Sum(Operating) / Sum(Available)` × `Sum(Actual) / Sum(Standard)` × `Sum(Good) / Sum(Actual)` | Evaluating true plant/line throughput weighted by operating time and volume |

### Additional Pipeline Rules

- **Dynamic Shift Resolution:** Instead of hardcoding shift start hours (as legacy Semi-Auto Spray endpoints do), Neo Spray reads `fproduction_start_at` for shifts `1`, `2`, and `3` from `hdps_common_mst_productiontime` (`fmachine_code == "C073"`).
- **Downtime Filtering:** `GetNeoSprayDowntime` excludes scheduled breaks (`fdowntime_name != "Break"` and `"BREAK"`), converts `fduration` from hours to minutes (`* 60`), and sorts descending.
- **Utilization Baseline:** Distinct active machines divided by selected machine count (or default baseline of `50` production machines = `51 total - 1 dev`), capped at `100%`.
- **Lowest OEE Live Tie-Breaker:** In unfiltered live mode, `GetNeoSprayLowestOEE` selects each machine's latest session (`max(foee_id)`), picks the top record by `(foee, fno)`, and sorts ascending so the lowest-performing machines appear first.
- **Last OEE (`S1`, `S2`, `S3`) Lookback Window:** Computed only in pure live mode:
  - During **Shift 1:** `S1`, `S2`, `S3` reference `today - 1`.
  - During **Shift 2:** `S1` references `today`; `S2` and `S3` reference `today - 1`.
  - During **Shift 3:** `S1` and `S2` reference `today`; `S3` references `today - 1`.

---

## 4. Input Reject (Throw-Off) Transaction Flow

`NeoSprayInputReject.cshtml` implements a 4-step cascading selection workflow before committing a reject quantity against `HDPStudioOEEStudioEntities` (`AS_OEE` and `AS_Reject`).

```mermaid
sequenceDiagram
    actor Op as Operator / Leader
    participant UI as NeoSprayInputReject.cshtml
    participant Ctrl as OEEController
    participant DB as HDPStudioOEEStudioEntities

    Op->>UI: Open /OEE/NeoSprayInputReject
    UI->>Ctrl: GET NeoSprayInputReject()
    Ctrl->>DB: Load distinct Machines & Dates (AS_OEE)<br/>Load Reject Names (Code_Reject, C07)
    Ctrl-->>UI: Render View with Machines, MachineDatesJson, RejectNames

    Op->>UI: 1. Select Machine
    UI->>Ctrl: GET GetDatesByMachine(machine)
    Ctrl->>DB: Distinct Dates from AS_OEE
    Ctrl-->>UI: JSON dates[]

    Op->>UI: 2. Select Date
    UI->>Ctrl: GET GetShiftsByMachineAndDate(machine, date)
    Ctrl->>DB: Distinct Shifts from AS_OEE
    Ctrl-->>UI: JSON shifts[]

    Op->>UI: 3. Select Shift
    UI->>Ctrl: GET GetToysByShift(machine, date, shift)
    Ctrl->>DB: Query AS_OEE + AS_OEE_Support (OEE_Id)
    Ctrl-->>UI: JSON toys[] (oeeId, part label, actualOutput, lastReject)

    Op->>UI: 4. Select Toy, Reject Name, Qty & Submit
    UI->>Ctrl: POST SaveNeoSprayInputReject(oeeId, machine, date, shift, rejectName, inputReject)
    Ctrl->>DB: Lookup AS_OEE record & Code_Reject mapping
    Note over Ctrl: Recalculate on AS_OEE:<br/>Reject += qtyToAdd<br/>Good_Output = Actual_Output - Reject<br/>Var = Good_Output - Standard_Output<br/>Quality = clamp(Good_Output / Actual_Output, 0, 1)<br/>OEE = clamp(Availability * Performance * Quality, 0, 1)
    Ctrl->>DB: Insert row into AS_Reject (OEE_Id, Reject_Code, Reject_Name, Qty, Time)
    Ctrl->>DB: db.SaveChanges()
    Ctrl-->>UI: JSON success, updated Reject total & Reject_Code
```

---

## 5. Data Model & Entity Relationships

Because HDP OEE Neo Spray spans two Entity Framework `DbContext` models, entities relate logically via `foee_id` / `OEE_Id`, `fprocess_code = "C07"`, `fmachine_code = "C073"`, and `Reject_Code`.

```mermaid
erDiagram
    vw_hdps_oeens_log_oee {
        int fno PK
        string fprocess_code
        string fmachine_code
        double fmachine_no
        double foee_id
        datetime fdate_at
        datetime fwe_at
        string fmachine
        double fshift
        double favailable_time
        double foperating_time
        double fstandard_output
        double fgood_output
        double freject_output
        double factual_output
        double favailability
        double fperformance
        double fquality
        double foee
        string fstatus
    }

    vw_hdps_oeens_log_downtime {
        int fno PK
        string fmachine_code
        double foee_id FK
        double fdowntime_code
        string fdowntime_name
        string fdowntime_type
        double fduration
    }

    vw_hdps_oeens_log_reject {
        int fno PK
        string fmachine_code
        int foee_id FK
        string freject_code
        string freject_name
        int freject_output
    }

    hdps_common_mst_productiontime {
        int fno PK
        string fmachine_code
        double fshift
        time fproduction_start_at
        time fproduction_end_at
        time fbreak_start_at
        time fbreak_end_at
    }

    hdps_common_mst_setting {
        int fno PK
        string fprocess_code
        string fmachine_code
        string fproject_name
        int fproject_setting_by_integer
        bool fis_active
    }

    hdps_oee_cur_condition {
        int fno PK
        double foee_id
        string fprocess_code
        string fmachine_code
        int fmachine_no
        double foee
        int fmachine_status
        int fpc_server_state
    }

    AS_OEE {
        int Number PK
        double ID
        datetime Date
        datetime WE
        double Machine
        double Shift
        double Actual_Output
        double Good_Output
        double Reject
        double Quality
        double OEE
        string Process_Code
    }

    AS_OEE_Support {
        int Id PK
        int OEE_Id FK
        string Part_Number
        string Part_Desc
        double Shiftly_Target
    }

    AS_Reject {
        int Id PK
        int OEE_Id FK
        string Reject_Code FK
        string Reject_Name
        int Qty
        time Time
    }

    Code_Reject {
        int Id PK
        string Reject_Code
        string Process_Code
        string Reject_Name
    }

    hdps_pbi_link {
        int fno PK
        string fprocess_code
        string fproject_name
        int fno_link
        string flink
    }

    vw_hdps_oeens_log_oee ||--o{ vw_hdps_oeens_log_downtime : "foee_id"
    vw_hdps_oeens_log_oee ||--o{ vw_hdps_oeens_log_reject : "foee_id"
    AS_OEE ||--o{ AS_OEE_Support : "ID / Number = OEE_Id"
    AS_OEE ||--o{ AS_Reject : "ID / Number = OEE_Id"
    Code_Reject ||--o{ AS_Reject : "Reject_Code"
```

---

## 6. Endpoint & Data-Source Map

| Endpoint (`OEEController`) | HTTP | DbContext | Database Objects | Purpose |
| :--- | :---: | :--- | :--- | :--- |
| `NeoSprayLayout` | `GET` | — | — | Renders main Live Layout dashboard (`ActiveTab = "live-layout"`). |
| `NeoSprayReport` | `GET` | `HDPStudioOEEStudioEntities` | `hdps_pbi_link` | Looks up Power BI link (`C07`, `"OEE Neo Spray"`, `fno_link = 1`) for iframe embed. |
| `NeoSprayInputReject` | `GET` | `HDPStudioOEEStudioEntities` | `AS_OEE`, `Code_Reject` | Renders cascading reject entry page with preloaded machine/date map and reject codes. |
| `GetSemiAutoSprayMachines` | `GET` | `HDPStudioOEEStudioEntities` | `hdps_oee_cur_condition` | Returns real-time machine status & live metrics (`fprocess_code = "C07"`) polled every 3s. |
| `GetNeoSprayOEEMetrics` | `GET` | `HDPStudioEntities` | `vw_hdps_oeens_log_oee`, `vw_hdps_oeens_log_downtime`, `vw_hdps_oeens_log_reject`, `hdps_common_mst_productiontime`, `hdps_common_mst_setting` | Computes Live/Historical OEE, A/P/Q, Utilization, Downtime, Reject totals, and Last OEE S1/S2/S3. |
| `GetNeoSprayLowestOEE` | `GET` | `HDPStudioEntities` | `vw_hdps_oeens_log_oee`, `hdps_common_mst_productiontime`, `hdps_common_mst_setting` | Returns machines ordered ascending by OEE for the Lowest OEE bar chart. |
| `GetNeoSprayDowntime` | `GET` | `HDPStudioEntities` | `vw_hdps_oeens_log_oee`, `vw_hdps_oeens_log_downtime`, `hdps_common_mst_productiontime` | Aggregates downtime duration in minutes by reason (excluding `Break` / `BREAK`). |
| `GetNeoSprayReject` | `GET` | `HDPStudioEntities` | `vw_hdps_oeens_log_oee`, `vw_hdps_oeens_log_reject`, `hdps_common_mst_productiontime` | Aggregates reject quantities by `freject_name`. |
| `GetNeoSprayFilterOptions` | `GET` | `HDPStudioOEEStudioEntities` | `AS_OEE` | Populates right-sidebar cascading filter options (`years`, `yearMonths`, `weekEndings`, `dates`, `rows`, `shifts`, `machines`). |
| `ExportNeoSpray` | `GET` | `HDPStudioOEEStudioEntities` | `AS_OEE` | Exports filtered OEE rows as `NeoSpray_Export.csv`, `.xlsx` (ClosedXML), or `.pdf` (iTextSharp). |
| `GetOEECalculationMode` | `GET` | `HDPStudioEntities` | `hdps_common_mst_setting` | Returns persisted calculation mode (`1` = Simple, `2` = Aggregate) with `NoStore` cache policy. |
| `UpdateOEECalculationMode` | `POST` | `HDPStudioEntities` | `hdps_common_mst_setting` | Updates or inserts calculation mode (`[ValidateAntiForgeryToken]` enforced). |
| `EndShift` | `POST` | `HDPStudioOEEStudioEntities` | `hdps_oee_cur_condition` | Resets active machine status & metric columns to `null` (single `GeneratedId` or all machines). |
| `GetDatesByMachine` / `GetShiftsByMachineAndDate` / `GetToysByShift` | `GET` | `HDPStudioOEEStudioEntities` | `AS_OEE`, `AS_OEE_Support` | Cascading lookup chain for `NeoSprayInputReject`. |
| `SaveNeoSprayInputReject` | `POST` | `HDPStudioOEEStudioEntities` | `AS_OEE`, `AS_Reject`, `Code_Reject` | Adds reject quantity, recalculates OEE metrics on `AS_OEE`, and inserts detail record into `AS_Reject`. |

---

## 7. Security & Operational Observations

> [!WARNING]
> **CSRF Protection Consistency:** `UpdateOEECalculationMode` properly enforces `[ValidateAntiForgeryToken]`, whereas `SaveNeoSprayInputReject` and `EndShift` are `[HttpPost]` endpoints currently lacking `[ValidateAntiForgeryToken]`. Adding anti-forgery token validation to those POST actions is recommended for future hardening in `inside-mvc`.

> [!NOTE]
> **Data-Source Split Awareness:** Live analytics charts read from `HDPStudioEntities` (`vw_hdps_oeens_log_*`, `fmachine_code = "C073"`), while sidebar filter options (`GetNeoSprayFilterOptions`), exports (`ExportNeoSpray`), and throw-off reject input (`SaveNeoSprayInputReject`) query/write `HDPStudioOEEStudioEntities` (`AS_OEE`, `fprocess_code = "C07"`). Keep both contexts synchronized when introducing schema changes or new Neo Spray dashboard tabs.

- **No Hardcoded External Links:** Power BI report URLs are stored in `hdps_pbi_link` and injected server-side via `ViewBag.PbiLink`, keeping deployment configuration out of source code.
- **Cache Control:** `GetNeoSprayOEEMetrics` and `GetOEECalculationMode` explicitly disable response caching (`[OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]`) to prevent stale KPI values on long-running shopfloor browsers.
- **Client Resilience:** Failed 3-second polling cycles in `loadMachineStatus()` fail silently so temporary network blips do not interrupt shopfloor TV displays.
- **Downtime Break Handling Difference:** `GetNeoSprayDowntime` (the **Downtime (min)** pareto chart) excludes `"Break"` / `"BREAK"` and converts `fduration` from hours to minutes (`* 60`), whereas `GetNeoSprayOEEMetrics.totalDowntimeDuration` sums raw `fduration` hours across all linked downtime rows without excluding breaks.
- **Unfiltered `AS_OEE` Lookups in Input Reject:** `NeoSprayInputReject()`, `GetDatesByMachine`, `GetShiftsByMachineAndDate`, and `GetToysByShift` query `AS_OEE` without filtering `Process_Code == "C07"` (unlike `GetNeoSprayFilterOptions` and `ExportNeoSpray`).
- **Strict Filter Parsing in `ExportNeoSpray`:** Query parameters (`year`, `month`, `we`, `date`, `shift`, `machine`) are parsed with `int.Parse` / `double.Parse` / `DateTime.Parse`, so malformed query strings return `HTTP 500` rather than `400 Bad Request`.
- **Legacy / Duplicate Controller Artifacts:** `GET /OEE/GetSemiAutoSprayStatus` exists in `OEEController.cs` as an unused lightweight sibling of `GetSemiAutoSprayMachines`, and `OEEController` instantiates two separate `HDPStudioOEEStudioEntities` fields (`db` and `dbHdpsOeeStudio`).

---

## Next Step

Continue to [Pages, UI & Right Sidebar](./pages-and-ui.md) for a detailed walkthrough of every view, the 5-panel right sidebar, Chart.js chart mechanics, and cascading filter controls.
