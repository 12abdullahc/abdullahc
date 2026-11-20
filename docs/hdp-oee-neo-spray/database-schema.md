# Database Schema & Views

**HDP OEE Neo Spray** reads and writes across two Entity Framework 6 Database-First `DbContext` models defined in `inside-mvc`:

1. **`HDPStudioEntities`** (`Models/HDPStudio.Context.cs`) — Standardized HDP Studio SQL views and master configuration tables (`C073`).
2. **`HDPStudioOEEStudioEntities`** (`Models/HDPStudioOEEStudio.Context.cs`) — Operational OEE Studio floor-state, log, reject, and Power BI tables (`C07`).

> [!NOTE]
> **HDP Studio Table Standard (`Asset/HDPStudio/Documentation/OEE/database-design.md`):** All newly introduced HDP Studio tables follow the standard audit and scoping column convention: `fno`, `fcreated_at`, `fupdated_at`, `fdeleted_at`, `frestored_at`, `fcreated_by`, `fupdated_by`, `fdeleted_by`, `frestored_by`, `fid`, `fis_active`, `fdescription`, `fprocess_code`, `fmachine_code`, `fmachine_name`, and `fmachine_no`.

---

## 1. Context 1: `HDPStudioEntities` (`dbHDPSStudioEntities`)

### `vw_hdps_oeens_log_oee` *(SQL View)*

Primary read model for `GetNeoSprayOEEMetrics`, `GetNeoSprayLowestOEE`, `GetNeoSprayDowntime` (OEE ID lookup), and `GetNeoSprayReject` (OEE ID lookup). Always filtered by `fmachine_code == "C073"`.

| Key | Column | CLR Type | Nullable | Role in Neo Spray |
| :---: | :--- | :--- | :---: | :--- |
| **PK** | `fno` | `int` | No | Row identifier; secondary tie-breaker in live Lowest OEE |
| | `fcreated_at` | `DateTime?` | Yes | Creation timestamp |
| | `fprocess_code` | `string` | Yes | Process identifier (`"C07"`) |
| | `fmachine_code` | `string` | Yes | Machine group filter (`"C073"`) |
| | `fmachine_name` | `string` | Yes | Machine group display name |
| | `fmachine_no` | `double?` | Yes | Numeric machine ID (`1`–`51`) |
| | `fmachine` | `string` | Yes | Machine display code (e.g., `A01`, `B04`) |
| **Key** | `foee_id` | `double?` | Yes | Logical join key linking downtime & reject views |
| | `fdate_at` | `DateTime?` | Yes | Production date (used for Live today / Historical Year, Month, Date filters) |
| | `fwe_at` | `DateTime?` | Yes | Week Ending date |
| | `fshift` | `double?` | Yes | Shift number (`1`, `2`, `3`) |
| | `ftotal_time` | `double?` | Yes | Total scheduled shift time |
| | `fbreak` | `double?` | Yes | Scheduled break duration |
| | `fbriefing` | `double?` | Yes | Briefing duration |
| | `favailable_time` | `double?` | Yes | Available production time (Aggregate Availability denominator) |
| | `ftotal_breakdown_time` | `double?` | Yes | Total breakdown duration |
| | `foperating_time` | `double?` | Yes | Effective operating time (Aggregate Availability numerator) |
| | `fstandard_output` | `double?` | Yes | Target standard output (Aggregate Performance denominator) |
| | `fgood_output` | `double?` | Yes | Good pieces produced (Aggregate Quality numerator) |
| | `freject_output` | `double?` | Yes | Rejected pieces |
| | `factual_output` | `double?` | Yes | Total actual output (Performance numerator / Quality denominator) |
| | `fvar` | `double?` | Yes | Output variance (`Good - Standard`) |
| | `favailability` | `double?` | Yes | Per-record Availability ratio (`0..1`) |
| | `fperformance` | `double?` | Yes | Per-record Performance ratio (`0..1+`) |
| | `fquality` | `double?` | Yes | Per-record Quality ratio (`0..1`) |
| | `foee` | `double?` | Yes | Per-record OEE ratio (`0..1`) |
| | `fstatus` | `string` | Yes | Run status (`"Active"`, `"Done"`, etc.) |

*(Also projects standard audit columns `fupdated_at`, `fdeleted_at`, `frestored_at`, `fcreated_by`, `fupdated_by`, `fdeleted_by`, `frestored_by`, `fis_active`, `fdescription`.)*

---

### `vw_hdps_oeens_log_downtime` *(SQL View)*

Provides downtime events linked via `foee_id` (`fmachine_code == "C073"`).

| Key | Column | CLR Type | Nullable | Role in Neo Spray |
| :---: | :--- | :--- | :---: | :--- |
| **PK** | `fno` | `int` | No | Row identifier |
| | `fprocess_code` / `fmachine_code` / `fmachine_name` / `fmachine_no` | `string` / `double?` | Yes | Scoping metadata (`fmachine_code == "C073"`) |
| **FK** | `foee_id` | `double?` | Yes | Links to `vw_hdps_oeens_log_oee.foee_id` |
| | `fdowntime_code` | `double?` | Yes | Downtime reason code |
| | `fdowntime_name` | `string` | Yes | Downtime reason label (`"Break"` / `"BREAK"` excluded in chart) |
| | `fdowntime_type` | `string` | Yes | Downtime category/type |
| | `fduration` | `double?` | Yes | Duration in **hours** (multiplied by `60` in `GetNeoSprayDowntime`) |

---

### `vw_hdps_oeens_log_reject` *(SQL View)*

Provides reject line items linked via `foee_id` (`fmachine_code == "C073"`).

| Key | Column | CLR Type | Nullable | Role in Neo Spray |
| :---: | :--- | :--- | :---: | :--- |
| **PK** | `fno` | `int` | No | Row identifier |
| | `fcreated_at` | `TimeSpan?` | Yes | Time of day logged |
| | `fprocess_code` / `fmachine_code` / `fmachine_name` / `fmachine_no` | `string` / `double?` | Yes | Scoping metadata (`fmachine_code == "C073"`) |
| **FK** | `foee_id` | `int?` | Yes | Links to `vw_hdps_oeens_log_oee.foee_id` (cast to `int`) |
| | `freject_code` | `string` | Yes | Reject defect code |
| | `freject_name` | `string` | Yes | Reject defect name (chart grouping key) |
| | `freject_output` | `int?` | Yes | Rejected piece count summed in `GetNeoSprayReject` & `GetNeoSprayOEEMetrics` |

---

### `hdps_common_mst_productiontime` *(Master Table)*

Stores dynamic shift production and break schedules queried by `fmachine_code == "C073"`.

| Key | Column | CLR Type | Nullable | Role in Neo Spray |
| :---: | :--- | :--- | :---: | :--- |
| **PK** | `fno` | `int` | No | Primary key |
| | `fis_active` | `bool?` | Yes | Active flag |
| | `fprocess_code` / `fmachine_code` / `fmachine_name` / `fmachine_no` | `string` / `double?` | Yes | Scoped to `fmachine_code == "C073"` |
| | `fshift` | `double?` | Yes | Shift number (`1`, `2`, `3`) |
| | `fproduction_start_at` | `TimeSpan?` | Yes | Shift start time used for live shift detection |
| | `fproduction_end_at` | `TimeSpan?` | Yes | Shift end time |
| | `fbreak_start_at` | `TimeSpan?` | Yes | Scheduled break start |
| | `fbreak_end_at` | `TimeSpan?` | Yes | Scheduled break end |

---

### `hdps_common_mst_setting` *(Master Table)*

Persists feature settings such as Neo Spray's OEE Calculation Mode (`1 = Simple OEE`, `2 = Aggregate OEE`).

| Key | Column | SQL Type | Nullable | Role in Neo Spray |
| :---: | :--- | :--- | :---: | :--- |
| **PK** | `fno` | `int` *(IDENTITY)* | No | Primary key |
| | `fid` / `fis_active` / `fdescription` | `int` / `bit` / `nvarchar(MAX)` | Yes | Metadata (`"1 = Simple OEE, 2 = Aggregate OEE"`) |
| | `fprocess_code` | `nvarchar(255)` | Yes | `"C07"` |
| | `fmachine_code` | `nvarchar(255)` | Yes | `"C073"` |
| | `fproject_name` | `nvarchar(255)` | Yes | `"OEE Neo Spray"` |
| | `fproject_no` | `float` | Yes | `1` |
| | `fproject_setting_by_integer` | `int` | Yes | **Active OEE Mode (`1` = Simple, `2` = Aggregate)** |
| | `fproject_setting_by_boolean` / `_float` / `_text` | `bit` / `float` / `nvarchar(MAX)` | Yes | Typed slots for future settings |

---

## 2. Context 2: `HDPStudioOEEStudioEntities` (`db` / `dbHdpsOeeStudio`)

### `hdps_oee_cur_condition` *(Real-Time Floor Table)*

Stores one live status row per machine (`fprocess_code == "C07"`), polled every 3 seconds by `GetSemiAutoSprayMachines` and cleared by `EndShift`.

| Key | Column | SQL Type | Nullable | Role in Neo Spray |
| :---: | :--- | :--- | :---: | :--- |
| **PK** | `fno` | `int` | No | Primary key |
| | `foee_id` | `float` | Yes | Current active OEE session ID (lookup key for single-machine `EndShift`) |
| | `fprocess_code` | `nvarchar(50)` | Yes | Filter key (`"C07"`) |
| | `fmachine_code` | `nvarchar(50)` | Yes | Machine code (e.g., `"SAS A01"`; `"SAS "` stripped in UI) |
| | `fmachine_no` | `int` | Yes | Ordering & machine number (`1`–`51`) |
| | `fpc_server_state` | `int` | Yes | `0` = connected; non-zero forces `NO SCH` |
| | `fmachine_status` | `int` | Yes | `1` Stopped, `2` Paused, `3` Running, `4` Dev, `5` PM |
| | `foee` / `favailability` / `fperformance` / `fquality` | `float` | Yes | Live machine ratios shown on cards & tooltips |
| | `factual_output` / `fgood_output` / `freject_output` / `fshiftly_target` | `float` | Yes | Live piece counters shown in card tooltips |
| | `fpart_number` / `fpart_description` | `nvarchar` | Yes | Currently running part info |
| | `fdate` / `fwe` / `fshift` / `ftime` / `fstatus` | `datetime2` / `int` / `nvarchar` | Yes | Active shift metadata (reset to `null` by `EndShift`) |
| | `fkpk_operator` / `fkpk_leader` | `nvarchar(50)` | Yes | Operator & leader employee IDs |
| | `fovertime_state` / `fovertime_input` / `fhour_sequence` | `int` / `float` | Yes | Overtime & hourly sequence tracking |
| | `farea_short_name` / `farea_long_name` | `nvarchar` | Yes | Floor area metadata |

---

### `AS_OEE` *(Operational OEE Table)*

Used by `GetNeoSprayFilterOptions`, `ExportNeoSpray`, `NeoSprayInputReject` (dropdown lookups), and `SaveNeoSprayInputReject` (reject & OEE recalculation).

| Key | Column | SQL Type | Nullable | Usage |
| :---: | :--- | :--- | :---: | :--- |
| **PK** | `Number` | `int` | No | Primary key; fallback `oeeId` in `NeoSprayInputReject` |
| | `ID` | `float` | Yes | OEE session ID matching `AS_OEE_Support.OEE_Id` & `AS_Reject.OEE_Id` |
| | `Date` / `WE` | `datetime` | Yes | Production date & Week Ending |
| | `Machine` / `Shift` | `float` | Yes | Machine number & Shift (`1`–`3`) |
| | `Total Time (TT)` / `Break` / `Briefing` / `Available Time` / `Total Breakdown Time` / `Operating Time` | `float` | Yes | Time metrics exported in `ExportNeoSpray` |
| | `Standard Output` / `Good Output` / `Reject` / `Actual Output` / `Var` | `float` | Yes | Output metrics; `Reject`, `Good_Output`, `Var` updated by `SaveNeoSprayInputReject` |
| | `Availability` / `Performance` / `Quality` / `OEE` | `float` | Yes | Ratios; `Quality` and `OEE` recalculated by `SaveNeoSprayInputReject` |
| | `Process_Code` | `nvarchar(255)` | Yes | Filtered by `"C07"` in filter options and export |

---

### `AS_OEE_Support` *(Run Metadata Table)*

| Key | Column | SQL Type | Nullable | Usage |
| :---: | :--- | :--- | :---: | :--- |
| **PK** | `Id` | `int` | No | Primary key |
| **FK** | `OEE_Id` | `int` | Yes | Matches `AS_OEE.ID` or `AS_OEE.Number` |
| | `Part_Number` / `Part_Desc` | `nvarchar(50)` / `nvarchar(255)` | Yes | Formatted into Toy dropdown label in `GetToysByShift` |
| | `KPK` / `KPK_Leader` / `Shiftly_Target` / `Time` / `Status` | `nvarchar` / `float` | Yes | Shift support metadata |

---

### `AS_Reject` & `Code_Reject` *(Reject Logging & Master Catalog)*

#### `AS_Reject`
| Key | Column | SQL Type | Nullable | Usage |
| :---: | :--- | :--- | :---: | :--- |
| **PK** | `Id` | `int` | No | Primary key |
| **FK** | `OEE_Id` | `int` | Yes | `record.ID ?? record.Number` written by `SaveNeoSprayInputReject` |
| | `Time` | `time` | Yes | `DateTime.Now.TimeOfDay` at save time |
| **FK** | `Reject_Code` | `nvarchar(50)` | Yes | Resolved from `Code_Reject` |
| | `Reject_Name` | `nvarchar(50)` | Yes | Resolved reject description |
| | `Qty` | `int` | Yes | Incremental throw-off reject quantity added |

#### `Code_Reject`
| Key | Column | SQL Type | Nullable | Usage |
| :---: | :--- | :--- | :---: | :--- |
| **PK** | `Id` | `int` | No | Primary key |
| | `Reject_Code` | `nvarchar(50)` | Yes | Code mapped on save |
| | `Process_Code` | `nvarchar(50)` | Yes | Queried for `"C07"` (or empty) in `NeoSprayInputReject` |
| | `Reject_Name` | `nvarchar(50)` | Yes | Populates the Reject Name dropdown |

---

### `hdps_pbi_link` *(Power BI Report Directory)*

| Key | Column | SQL Type | Nullable | Usage |
| :---: | :--- | :--- | :---: | :--- |
| **PK** | `fno` | `int` *(IDENTITY)* | No | Primary key |
| | `fcreated_at` / `fupdated_at` | `datetime2(0)` | Yes | Audit timestamps |
| | `fprocess_code` | `nvarchar(50)` | Yes | `"C07"` |
| | `fproject_name` | `nvarchar(255)` | Yes | `"OEE Neo Spray"` |
| | `fno_link` | `int` | Yes | `1` (primary report slot queried by `NeoSprayReport`) |
| | `flink` | `nvarchar(MAX)` | Yes | Embedded Power BI URL injected into `ViewBag.PbiLink` |
| | `flink_description` | `nvarchar(MAX)` | Yes | Human-readable report description |

---

## Next Step

Continue to [Operator & Supervisor Guide](./user-guide.md) for day-to-day workflows, filter usage tips, shift reset instructions, and troubleshooting.
