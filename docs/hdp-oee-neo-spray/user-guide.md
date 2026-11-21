# Operator & Supervisor Guide

This guide covers day-to-day operational workflows for supervisors, leaders, operators, and shopfloor TV monitoring using **HDP OEE Neo Spray**.

---

## 1. Monitoring the Live Dashboard (`Live Layout`)

Open **HDP Studio Hub → OEE Neo Spray**, **HDP Studio App Launcher → OEE Neo Spray**, or **INSIDE Sidebar → Decoration → OEE Neo Spray** (or navigate directly to `/OEE/NeoSprayLayout`). No login is required for read-only shopfloor monitoring.

> [!TIP]
> Be sure to select **OEE Neo Spray** rather than the legacy **OEE Neo Spray (OLD)** tile (`SemiAutoSprayLayout` / `HDPOEEStudio`).

### Reading the Dashboard at a Glance

1. **General KPI Table (Top Left):**
   - Displays current shift **OEE**, **Availability**, **Performance**, **Quality**, and **Utilization** — automatically refreshed every **30 seconds**.
   - **Last OEE (`S1`, `S2`, `S3`):** Shows the final OEE percentages from the three most recent prior shifts (available only in unfiltered **Live** mode).
   - Hover over the info icon (`i`) next to **OEE** or **Utilization** to view the formula reminder.
2. **Machine Status Summary Table (Middle Left):**
   - Shows live counts across all **51 machines** (`Total Machines`), broken down by **Running** (green), **Paused** (yellow), **Stopped** (red), **No Sch** (gray), **Dev** (blue), and **PM** (purple).
3. **Pareto Charts (Top Right):**
   - **Lowest OEE:** Machines sorted from lowest to highest OEE so supervisors immediately spot bottlenecks.
   - **Reject (pcs):** Top defect types by piece count.
   - **Downtime (min):** Top downtime reasons in minutes (scheduled breaks are automatically excluded).
   - Scroll vertically inside any chart card when more than 5 items appear; the X-axis scale stays pinned at the bottom.
4. **Shopfloor Lines Grid (Bottom):**
   - Displays Lines **A–F** in paired columns (`A/B`, `C/D`, `E/F`), refreshing every **3 seconds**.
   - Hover over any machine card (`A01`–`F05`) to inspect exact OEE/A/P/Q percentages and Target / Actual / Good / Reject output counts.
   - Click the Waterbase Machine photo on the far top-left to enlarge it in a full-screen lightbox (`Esc` or click anywhere to close).

---

## 2. Filtering Historical Data

Click the **Filter** button (sliders icon) on the top-right sidebar strip to analyze past shifts, weeks, or specific machines:

1. **Single Selection:** Left-click any option inside **Year**, **Month**, **Week Ending**, **Date**, **Shift**, or **Machine**. The KPI table and all three pareto charts reload immediately.
2. **Multi-Selection:** Hold **`Ctrl` + Left-click** (or `Cmd + Click` on macOS) to select multiple values inside the same dropdown, or use **Select All** to pick every visible item.
3. **Smart Date Cascading:** Selecting a **Year** or **Month** automatically narrows the available **Week Ending** and **Date** options to valid combinations with recorded data.
4. **Clearing Filters:**
   - Click the `×` icon next to any individual field label to clear just that filter.
   - Click **Clear all filters** at the bottom of the Filter panel to return immediately to **Live** mode (all dropdowns display `Live` and the active dot disappears).

> [!TIP]
> The 51-machine floor grid always displays real-time machine condition (`hdps_oee_cur_condition`) every 3 seconds, even while the KPI table and pareto charts are viewing filtered historical dates.

---

## 3. Exporting Filtered Data (`CSV`, `Excel`, `PDF`)

1. *(Optional)* Apply any desired date, shift, or machine filters in the **Filter** panel first.
2. Click the **Export** icon (`fa-file-export`) on the right sidebar strip.
3. Choose **CSV**, **Excel (`.xlsx`)**, or **PDF**.
4. Wait for the status text (`Preparing...` → `Download ready.`); your browser downloads `NeoSpray_Export.{csv|xlsx|pdf}` containing all 19 OEE columns for the active filter selection.

---

## 4. Recording Throw-Off Rejects (`Input Reject`)

Use **More → Input Reject (Throw-off)** (`/OEE/NeoSprayInputReject`) whenever post-run or throw-off rejects need to be added to an existing OEE record:

> [!WARNING]
> **Line F Machine Labels (`47–51`):** In the Input Reject **Machine** dropdown (and the right-sidebar Machine filter), numeric machine IDs `47–51` (Line `F01`–`F05` on the floor grid) currently display as `E05`–`E09`. Double-check the selected machine ID and `Last actual output` before saving throw-off rejects for Line F.

1. **Select Machine:** Choose the target machine (`A01`–`F05`).
2. **Select Date:** Pick the production date (`MM/DD/YYYY`) from available recorded dates for that machine.
3. **Select Shift:** Choose the shift (`Shift 1`, `Shift 2`, or `Shift 3`).
4. **Select Toy:** Pick the part number / description. *(If only one toy ran during that shift, it is selected automatically.)*
5. **Verify Context:** Review the auto-filled **Last actual output quantity** and **Last reject quantity** fields to ensure you are updating the right run.
6. **Enter Reject Quantity & Name:** Type a positive integer (or use the up/down stepper arrows) and select the matching **Reject name**.
7. **Click Save:** A green confirmation toast appears, **Last reject quantity** refreshes automatically with the new cumulative total, and the run's **Good Output**, **Variance**, **Quality**, and **OEE** are recalculated in `AS_OEE`.

> [!NOTE]
> Each submission **adds** the entered quantity to the existing reject total (it does not overwrite the previous total) and writes a timestamped entry to `AS_Reject`.

---

## 5. Changing OEE Calculation Mode & Resetting Active Machines

Click the **Settings** gear icon at the bottom of the right sidebar strip:

### Switching Simple vs. Aggregate OEE

- Toggle between **Simple** (equal-weight average across records) and **Aggregate** (volume- and time-weighted plant totals) and confirm the prompt.
- The page automatically reloads and applies the new mode across the KPI table, Lowest OEE chart, and Last OEE (`S1`–`S3`).

> [!IMPORTANT]
> **Shared Global Setting:** Changing the OEE calculation mode writes to `hdps_common_mst_setting` in SQL Server, so it affects **all** viewers of HDP OEE Neo Spray across the plant — not only your browser session.

### Resetting Active Machines (`End Shift`)

- Click **Reset** under *"Reset active machines (e.g. Line A, B, C...)"* and confirm the dialog.
- This calls `POST /OEE/EndShift` to clear live floor states in `hdps_oee_cur_condition` at shift handover so stale machine statuses from the previous shift do not carry over.

> [!CAUTION]
> Triggering **Reset** clears live machine condition rows immediately for all machines. Only perform this action during planned shift transitions or authorized resets.

---

## 6. Viewing Power BI Reports

Open **More → Report (Power BI)** (`/OEE/NeoSprayReport`):
- View the interactive Power BI report directly inside the embedded full-screen card.
- Click the circular **external link** button in the top-right corner of the card to open the report in a full browser tab.

---

## 7. Troubleshooting

| Symptom | Likely Cause | Recommended Action |
| :--- | :--- | :--- |
| All machines display **NO SCH** (gray) | `fpc_server_state != 0` in `hdps_oee_cur_condition`, or `EndShift` was just executed and PC clients have not pushed fresh ticks yet | Check shopfloor OEE PC server connectivity and verify `hdps_oee_cur_condition` rows have `fpc_server_state = 0`. |
| KPI table shows `0%` and charts show **No Data** in Live mode | No `vw_hdps_oeens_log_oee` rows exist yet for `today` + active shift with `fstatus` in `("Active", "Done")`, or shift hours in `hdps_common_mst_productiontime` (`C073`) are misconfigured | Verify current shift rows in `vw_hdps_oeens_log_oee` and confirm `fproduction_start_at` entries for shifts `1`, `2`, `3` in `hdps_common_mst_productiontime`. |
| **Last OEE (`S1`/`S2`/`S3`)** displays `-` | A filter (Year, Month, WE, Date, Shift, or Machine) is currently active, or no data exists for yesterday/today's prior shifts | Click **Clear all filters** in the Filter panel to return to pure Live mode. |
| **Report (Power BI)** displays `"No report link configured."` | Missing record in `hdps_pbi_link` for `fprocess_code = 'C07'`, `fproject_name = 'OEE Neo Spray'`, `fno_link = 1` | Insert or update the row in `hdps_pbi_link` with a non-empty `flink` URL. |
| **Toy** dropdown shows `"No toys available"` in Input Reject | No `AS_OEE` record matches the selected `(Machine, Date, Shift)` combination | Confirm the production run was saved to `AS_OEE` for that machine, date, and shift. |
| Filter dropdown shows options that return empty charts | Filter options load from `AS_OEE` (`Process_Code = 'C07'`) while charts query `vw_hdps_oeens_log_oee` (`fmachine_code = 'C073'`) | Verify the view `vw_hdps_oeens_log_oee` includes records for the selected dates/machines. |
| Right-sidebar **Live** green dot is pulsing, yet data is stale | The **Live** panel (`Last scan HH:mm:ss`) is a local browser clock (`rsTickRadar()`), not a live server/database health check | Check browser Network tab for `GetSemiAutoSprayMachines` / `GetNeoSprayOEEMetrics` errors or verify IIS / SQL Server connectivity. |
