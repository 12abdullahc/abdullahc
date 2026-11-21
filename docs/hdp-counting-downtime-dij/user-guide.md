# HDP Counting Downtime DIJ — Operator & Supervisor Guide

This guide covers daily shopfloor operation, installing standalone per-machine PWA shortcuts on tablets or PCs, tuning automated Excel exports, and resolving common operational issues.

---

## 1. Opening the Application

Operators and supervisors can access **HDP Counting Downtime DIJ** from any of four entry points — **no INSIDE login is required** on shopfloor stations:

1. **HDP Studio Hub:** Open the HDP Studio landing page, filter by **DIJ** (or search `downtime` / `pwa`), and click the **Counting Downtime DIJ** card.
2. **HDP Studio Header Launcher:** Click the app-grid launcher icon in the top navigation bar and select **Counting Downtime DIJ**.
3. **Legacy INSIDE Sidebar:** Click **Counting Dt DIJ** in the navigation menu.
4. **Direct Machine Bookmark / QR Code:** Open a deep-linked URL pointing directly to a station, for example:
   - `/CountingDowntimeDIJ?A01`
   - `/CountingDowntimeDIJ?machine=A01`

> [!TIP]
> Bookmarking `/CountingDowntimeDIJ?<MachineName>` (or installing it as a PWA) automatically pre-selects the machine, applies its unique color badge, and displays live status immediately on load.

---

## 2. Installing Per-Machine Standalone PWAs (Edge / Chrome)

Because the app dynamically rewrites its Web App Manifest whenever a machine is selected, you can install **separate app shortcuts** for individual machines on the same tablet or PC:

1. Open `/CountingDowntimeDIJ` in Microsoft Edge or Google Chrome.
2. Select the target machine (e.g., `A01`) from the **Machine** dropdown. Verify the URL updates to `/CountingDowntimeDIJ?A01` and the tab title becomes **`A01 - Counting Downtime DIJ`**.
3. Click the **Install app** icon in the browser address bar (or open browser menu **Apps → Install this site as an app**).
4. Confirm the install dialog — the shortcut is named **`A01 - Counting Downtime DIJ`** (short name **`A01 Downtime`**) and opens in a clean standalone window without browser tabs.
5. Repeat with another machine (e.g., `A02`) if a supervisor workstation monitors multiple machines in dedicated windows.

> [!NOTE]
> Thanks to `launch_handler.client_mode = "focus-existing"`, clicking an already-open machine PWA shortcut brings its existing window to the foreground instead of launching duplicate windows.

---

## 3. Recording a Shopfloor Downtime Cycle

### Step-by-Step Workflow

1. **Select Machine:** Choose the DIJ machine from the **Machine** dropdown (confirm the dropdown background color and right-hand **`Machine <Name>`** badge match your station).
   - If the machine is running normally, the stopwatch shows **`00:00:00`**, status reads **`Ready / Running normally`**, and **Start** is enabled.
   - If another station already started downtime for this machine, the stopwatch turns red and ticks live automatically.
2. **Start Downtime:** Optionally type initial remarks in **Downtime Notes**, then click **Start** (green button).
   - The stopwatch box glows red, ticks every second (`HH:MM:SS`), and displays **`Started at: YYYY-MM-DD HH:mm:ss`**.
   - Row `1` of **Recent downtime history** immediately appears with **`Counting...`** in red under **Elapsed Time**.
3. **Add or Update Notes Anytime:**
   - **While counting:** Type cause details in **Downtime Notes** and click **Submit notes** (or leave them in the text box and click **Stop** — non-blank notes typed before clicking **Stop** are saved automatically!).
   - **After stopping:** While the machine is still selected in **Ready** mode, you can type remarks into **Downtime Notes** and click **Submit notes** to update the **most recent** downtime log for that machine.
4. **Stop Downtime:** When production resumes, click **Stop** (red button).
   - The server records `fdowntime_stop` and computes the final elapsed duration (`05m 25s`, `01h 02m 10s`, etc.).
   - Controls reset to **`Ready / Running normally`**, and row `1` of **Recent downtime history** updates with the completed Stop Time and formatted Elapsed Time.

> [!IMPORTANT]
> **Clearing vs. Preserving Notes:**
> - Clicking **Stop** with an **empty** Notes textarea **preserves** any notes previously saved during that downtime.
> - Clicking **Submit notes** with an **empty** Notes textarea intentionally **clears** `fnotes` on the target record.

### Switching Machines While Counting
If you change the **Machine** dropdown while a downtime timer is actively running, a confirmation dialog asks whether you really want to switch.
- Click **Cancel** to stay on the current machine.
- Click **OK** to inspect another machine — the previous machine's active downtime continues counting accurately on the server and resumes seamlessly when you switch back.

---

## 4. Multi-Device & Multi-Tab Synchronization

- **Same PC / Same Browser Profile:** Starting, stopping, or saving notes in one tab or PWA window updates any other open tab viewing the same machine almost instantaneously (`BroadcastChannel` + `localStorage`).
- **Different Tablets / Supervisor PCs:** Background heartbeat polling refreshes every **3 seconds** automatically, and wakes up immediately when a tablet screen unlocks or a window regains focus.
- **Typing Protection:** Background refreshes never overwrite text you are actively typing inside **Downtime Notes**.

---

## 5. Supervisor Administration: Managing Scheduled Excel Exports

The background EPPlus auto-exporter reads `hdps_common_mst_exportedpath` on every tick, so supervisors or DBAs can adjust export behavior **without restarting IIS**:

| Task | SQL Action on `hdps_common_mst_exportedpath` *(where `fprocess_code = 'C05'`, `fproject_name = 'Counting Downtime DIJ'`, `fproject_no = 1`)* |
| :--- | :--- |
| **Pause auto-export** | Set `fis_active = 0` — takes effect on the very next timer tick |
| **Resume auto-export** | Set `fis_active = 1` |
| **Change export frequency** | Update `fduration` (in seconds, e.g., `60` for 1 min, `300` for 5 min, `900` for 15 min) |
| **Redirect file / sheet** | Update `fpath`, `ffile_name`, or `fsheet_name` |

### Managing Available Machines
To add or retire a DIJ machine in the dropdown:
- Insert or update its row in `hdps_common_mst_machine` with `fprocess_code = 'C05'`, non-empty `fmachine_name`, sort order `fmachine_no`, and `fis_active = 1` (or `0` to hide).
- Reload the page to refresh `ViewBag.Machines`.

---

## 6. Troubleshooting Guide

| Symptom | Likely Cause | Resolution |
| :--- | :--- | :--- |
| **Machine missing from dropdown** | Row in `hdps_common_mst_machine` has `fis_active <> 1`, wrong `fprocess_code` (not `'C05'`), or blank `fmachine_name` | Verify active `C05` row in `hdps_common_mst_machine` and refresh the browser |
| **"Machine X already has an active downtime in progress."** | Another station started downtime (or a prior run was never stopped) leaving `fdowntime_stop IS NULL` | Refresh the page to load the active timer and click **Stop**, or verify open rows in `hdps_cddij_log_downtime` |
| **Excel export file is not updating** | (1) `fis_active` is `0`/`NULL` in `hdps_common_mst_exportedpath`; (2) IIS AppDomain recycled due to idle timeout and hasn't received a request yet; (3) IIS App Pool identity lacks write permission on the UNC share; (4) Another user has the `.xlsx` file locked open in Excel | (1) Check `fis_active = 1`; (2) Open `/CountingDowntimeDIJ` once to wake the static timer; (3) Verify IIS app-pool write permissions on `fpath`; (4) Close exclusive Excel locks on the shared file |
| **Notes look cut off in Recent History** | Table column uses single-line ellipsis truncation (`text-overflow: ellipsis`) | Hover the mouse over the Notes cell to read the full text tooltip, or inspect the exported `.xlsx` workbook |
| **PWA shortcut opens blank selection instead of a machine** | PWA was installed while `-- Select machine --` was active | Uninstall the generic shortcut, select the target machine so `?A01` appears in the address bar, then reinstall |
| **Action fails with server error after long idle period** | Expired or mismatched anti-forgery cookie/token (`__RequestVerificationToken`) | Reload the page (`F5`) to obtain a fresh anti-forgery token |
