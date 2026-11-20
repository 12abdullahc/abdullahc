# OEE Formulas & Business Logic

This chapter documents every mathematical formula, shift-determination rule, aggregation mode, and edge-case constraint implemented for **HDP OEE Neo Spray** in `Controllers/OEEController.cs` and `Views/OEE/NeoSprayLayout.cshtml`.

---

## 1. Core OEE Metrics

Each production run record stores both raw time/output counters and derived percentages (`0.0` to `1.0` in the database, rendered as `0%` to `100%` in the UI):

| Metric | Formula | Units / Range |
| :--- | :--- | :--- |
| **Available Time** | `Total_Time - Break - Briefing` | Hours / minutes *(same unit as `Operating_Time`)* |
| **Operating Time** | `Available_Time - Total_Breakdown_Time` | Hours / minutes |
| **Good Output** | `Actual_Output - Reject` | Pieces (`pcs`) |
| **Variance (`Var`)** | `Good_Output - Standard_Output` | Pieces (`pcs`) |
| **Availability (`A`)** | `Operating_Time / Available_Time` | Ratio `0..1` (`0%..100%`) |
| **Performance (`P`)** | `Actual_Output / Standard_Output` | Ratio `0..1+` |
| **Quality (`Q`)** | `Good_Output / Actual_Output` | Ratio `0..1` (`0%..100%`) |
| **OEE** | `Availability × Performance × Quality` | Ratio `0..1` (`0%..100%`) |

> [!NOTE]
> **Client-Side OEE Display Reconciliation (`NeoSprayLayout.cshtml`):** After receiving `availability`, `performance`, and `quality` percentages from `GetNeoSprayOEEMetrics`, the General KPI table computes the displayed **OEE** cell as:
> ```javascript
> var calculatedOee = Math.round((availability / 100) * (performance / 100) * (quality / 100) * 10000) / 100;
> ```
> This ensures the displayed **OEE** cell always matches the product of the three visible KPI cells (`A × P × Q`), matching its header tooltip.

---

## 2. Simple OEE vs. Aggregate OEE Calculation Modes

The active calculation mode is stored in `HDPStudioEntities.hdps_common_mst_setting` under:

- `fprocess_code = "C07"`
- `fmachine_code = "C073"`
- `fproject_name = "OEE Neo Spray"`
- `fproject_setting_by_integer`: **`1`** = Simple OEE *(default)*, **`2`** = Aggregate OEE

Lookup fallback order in `OEEController.cs`:
1. Exact match on `C07` + `C073` + `"OEE Neo Spray"`
2. Record where `fno == 1`
3. First row in `hdps_common_mst_setting`
4. Default integer `1` (Simple OEE) if the table is empty

### Mode 1: Simple OEE (`calculationMode == 1`)

Computes the **unweighted arithmetic mean** of non-null record ratios across all matching rows in `vw_hdps_oeens_log_oee`:

```csharp
availFinal = Math.Round(availValues.Average() * 100, 2);
perfFinal  = Math.Round(perfValues.Average()  * 100, 2);
qualFinal  = Math.Round(qualValues.Average()  * 100, 2);
oeeFinal   = Math.Round(oeeValues.Average()   * 100, 2); // in GetNeoSprayOEEMetrics
```

*(In `GetNeoSprayLowestOEE` filtered mode and `calcShiftOee` for Last OEE S1–S3, Simple OEE averages `favailability`, `fperformance`, and `fquality` separately and multiplies `avail * perf * qual * 100`.)*

### Mode 2: Aggregate OEE (`calculationMode == 2`)

Sums raw physical totals first, then computes ratios so longer-running or higher-volume machines carry proportional weight:

```csharp
double totalAvailableTime  = rows.Sum(x => x.favailable_time  ?? 0);
double totalOperatingTime  = rows.Sum(x => x.foperating_time  ?? 0);
double totalStandardOutput = rows.Sum(x => x.fstandard_output ?? 0);
double totalActualOutput   = rows.Sum(x => x.factual_output   ?? 0);
double totalGoodOutput     = rows.Sum(x => x.fgood_output     ?? 0);

double A = totalAvailableTime  > 0 ? Math.Max(0, totalOperatingTime / totalAvailableTime) : 0;
double P = totalStandardOutput > 0 ? Math.Max(0, totalActualOutput  / totalStandardOutput) : 0;
double Q = totalActualOutput   > 0 ? Math.Max(0, totalGoodOutput    / totalActualOutput) : 0;

double availFinal = Math.Round(A * 100, 2);
double perfFinal  = Math.Round(P * 100, 2);
double qualFinal  = Math.Round(Q * 100, 2);
double oeeFinal   = Math.Round((availFinal / 100.0) * (perfFinal / 100.0) * (qualFinal / 100.0) * 100, 2);
```

### Worked Example: Why Simple and Aggregate Differ

Suppose two machines run during Shift 2:

| Machine | Available Time | Operating Time | Availability | Standard Output | Actual Output | Good Output | Record OEE |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **A01** *(Full shift)* | 7.5 h | 6.75 h | `90.00%` | 1,000 pcs | 950 pcs | 931 pcs | `83.79%` |
| **A02** *(Short 1h run)* | 1.0 h | 0.50 h | `50.00%` | 100 pcs | 80 pcs | 76 pcs | `38.00%` |

- **Simple OEE (Mode 1):**
  - Availability = `(90% + 50%) / 2` = **`70.00%`**
  - Short test/partial runs pull the average down equally with full-shift runs.
- **Aggregate OEE (Mode 2):**
  - Availability = `(6.75 + 0.50) / (7.5 + 1.0) = 7.25 / 8.50` = **`85.29%`**
  - Performance = `(950 + 80) / (1000 + 100) = 1030 / 1100` = **`93.64%`**
  - Quality = `(931 + 76) / (950 + 80) = 1007 / 1030` = **`97.77%`**
  - OEE = `0.8529 × 0.9364 × 0.9777` = **`78.08%`** — accurately reflecting overall shopfloor capacity utilization.

---

## 3. Dynamic Shift Resolution

Unlike legacy Semi-Auto Spray actions (which hardcode `22:40`, `07:10`, and `15:40`), all Neo Spray analytics endpoints dynamically query `hdps_common_mst_productiontime` for `fmachine_code == "C073"`:

```csharp
TimeSpan shift1Start = prodTimes.FirstOrDefault(p => p.fshift == 1)?.fproduction_start_at ?? TimeSpan.Zero;
TimeSpan shift2Start = prodTimes.FirstOrDefault(p => p.fshift == 2)?.fproduction_start_at ?? TimeSpan.Zero;
TimeSpan shift3Start = prodTimes.FirstOrDefault(p => p.fshift == 3)?.fproduction_start_at ?? TimeSpan.Zero;

int defaultShift;
if (now.TimeOfDay >= shift1Start || now.TimeOfDay < shift2Start)
    defaultShift = 1; // Handles overnight wrap across midnight
else if (now.TimeOfDay >= shift2Start && now.TimeOfDay < shift3Start)
    defaultShift = 2;
else
    defaultShift = 3;
```

> [!IMPORTANT]
> Because **Shift 1** spans midnight (`shift1Start` in late evening to `shift2Start` early morning), the condition uses an `||` (logical OR) rather than `&&`. Updating shift times in `hdps_common_mst_productiontime` takes effect immediately with no application redeploy.

---

## 4. Live Mode vs. Historical Mode

Every analytics endpoint classifies a request as **Historical** or **Live** using the presence of any calendar filter:

```csharp
bool isHistorical =
    !string.IsNullOrEmpty(year)  ||
    !string.IsNullOrEmpty(month) ||
    !string.IsNullOrEmpty(we)    ||
    !string.IsNullOrEmpty(date);
```

| Dimension | Live Mode (`isHistorical == false`) | Historical Mode (`isHistorical == true`) |
| :--- | :--- | :--- |
| **Date Filter** | `TruncateTime(fdate_at) == DateTime.Now.Date` | Matched against `year`, `month`, `we` (`fwe_at`), and/or `date` (`fdate_at.Date`) |
| **Shift Filter** | First selected shift, or `defaultShift` if none selected | All selected shifts, or all shifts if none selected |
| **Status Filter** | `fstatus == "Active" || fstatus == "Done"` | Any `fstatus` matching date/shift/machine filters |
| **Machine Filter** | Optional filter matching `fmachine` OR `fmachine_no` | Optional filter matching `fmachine` OR `fmachine_no` |
| **Last OEE (`S1`/`S2`/`S3`)** | Computed **only** when neither `shift` nor `machine` filter is set | Always `null` (displays `-` in UI) |

### Last OEE (`S1`, `S2`, `S3`) Lookback Matrix

In pure live mode (`!isHistorical && !isShiftOrMachineFiltered`), `GetNeoSprayOEEMetrics` queries `vw_hdps_oeens_log_oee` for `[today - 1, today]` (`fstatus` in `"Active"`, `"Done"`, or `null`) and computes the previous completed shifts according to the currently running `liveShift`:

| Currently Running Shift (`liveShift`) | `lastOeeS1` Target Date | `lastOeeS2` Target Date | `lastOeeS3` Target Date |
| :---: | :---: | :---: | :---: |
| **Shift 1** | `today - 1` | `today - 1` | `today - 1` |
| **Shift 2** | `today` | `today - 1` | `today - 1` |
| **Shift 3** | `today` | `today` | `today - 1` |

Each shift's value respects the active `calculationMode` (`1 = Simple`, `2 = Aggregate`) and returns `null` if no records exist for that `(shift, targetDate)` pair.

---

## 5. Specialized Metric Rules

### Machine Utilization

- **Backend Formula (`GetNeoSprayOEEMetrics`):**
  ```csharp
  int applicableMachines = (machinesArray != null && machinesArray.Length > 0)
      ? machinesArray.Length
      : 50; // 51 total configured machines minus 1 development machine

  double utilization = applicableMachines > 0
      ? Math.Min(100.0, Math.Round(((double)distinctMachineCount / applicableMachines) * 100, 2))
      : 0;
  ```
- **Tooltip Operational Concept:** `UTILIZATION = ((RUNNING + PAUSED + STOPPED + NO SCH) - (DEV + PM)) / TOTAL MACHINES`.

### Lowest OEE Ranking (`GetNeoSprayLowestOEE`)

Records are grouped by machine identifier (`fmachine`, falling back to `fmachine_no.ToString()`):
- **Unfiltered Live Mode (`!isFiltered`):** For each machine, selects the latest session (`max(foee_id)`), breaks ties by highest `foee` then highest `fno`, and uses `Math.Round(bestRec.foee * 100, 2)`.
- **Filtered Mode (`isFiltered`):** Computes each machine's OEE across all matching rows using `calculationMode` (`1 = Simple`, `2 = Aggregate`).
- **Sorting:** Always sorted **ascending** by OEE (`OrderBy(x => x.OEE)`) so the worst-performing machines appear at the top of the chart.

### Downtime Pareto (`GetNeoSprayDowntime`)

1. Resolves matching `foee_id` list from `vw_hdps_oeens_log_oee` using the active filters.
2. Fetches matching rows from `vw_hdps_oeens_log_downtime` (`fmachine_code == "C073"`).
3. **Excludes scheduled breaks:** `.Where(item => item.fdowntime_name != "Break" && item.fdowntime_name != "BREAK")`.
4. Converts `fduration` from **hours to minutes** (`(fduration ?? 0) * 60`), sums per `fdowntime_name`, rounds each bar (`Math.Round`), and sorts **descending**.

### Reject Pareto (`GetNeoSprayReject`)

1. Resolves matching `foee_id` list from `vw_hdps_oeens_log_oee`.
2. Queries `vw_hdps_oeens_log_reject` (`fmachine_code == "C073"`), sums `freject_output` grouped by `freject_name ?? "Unknown"`, and sorts **descending**.

### Throw-Off Reject Recalculation (`SaveNeoSprayInputReject`)

When an operator logs `qtyToAdd > 0` throw-off rejects against an `AS_OEE` record:

1. **Resolve Reject Code:** Looks up `Code_Reject` matching `Reject_Name == rejectName || Reject_Code == rejectName`.
2. **Accumulate Rejects & Recalculate `AS_OEE`:**
   ```csharp
   record.Reject      = (record.Reject ?? 0) + qtyToAdd;
   record.Good_Output = actualOutput - totalReject;
   record.Var         = record.Good_Output - standardOutput;
   record.Quality     = actualOutput > 0
       ? Math.Max(0, Math.Min(1, (record.Good_Output ?? 0) / actualOutput))
       : 0;
   record.OEE         = Math.Max(0, Math.Min(1, availability * performance * quality));
   ```
3. **Insert Detail Row (`AS_Reject`):** Inserts a new row with `OEE_Id = record.ID ?? record.Number`, `Reject_Code`, `Reject_Name`, `Qty = (int)qtyToAdd`, and `Time = DateTime.Now.TimeOfDay`, then commits both changes in a single `db.SaveChanges()` call.

---

## Next Step

Continue to [API & Data Export Reference](./api-and-exports.md) for every controller endpoint signature, query parameter, JSON response schema, and CSV/XLSX/PDF export specification.
