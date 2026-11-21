# HDP Counting Downtime DIJ — API & Auto-Export Reference

All server endpoints and background export routines reside in `Controllers/CountingDowntimeDIJController.cs` (namespace `LoginAndRegisterMVCMD5.Controllers`). Every database operation runs against a single Entity Framework 6 context (`HDPStudioEntities`), and all three state-mutating `POST` endpoints enforce `[ValidateAntiForgeryToken]`.

---

## 1. Endpoint Summary Matrix

| Method | Route | CSRF Required | Content Type | Purpose |
| :---: | :--- | :---: | :--- | :--- |
| `GET` | `/CountingDowntimeDIJ` *(or `/Index`)* | No | `text/html` | Preloads active `C05` machines into `ViewBag.Machines` and renders `Index.cshtml` |
| `GET` | `/CountingDowntimeDIJ/Manifest` | No | `application/manifest+json` | Generates a dynamic per-machine Web App Manifest for standalone PWA installation |
| `GET` | `/CountingDowntimeDIJ/GetMachines` | No | `application/json` | Returns ordered active `C05` machines *(utility endpoint)* |
| `GET` | `/CountingDowntimeDIJ/GetMachineStatus` | No | `application/json` | Returns active downtime state (if any) and latest **5** downtime logs for a machine |
| `POST` | `/CountingDowntimeDIJ/StartDowntime` | **Yes** | `application/json` | Starts a new downtime record if no active downtime is currently open |
| `POST` | `/CountingDowntimeDIJ/StopDowntime` | **Yes** | `application/json` | Stops the active downtime, computes `fdowntime_elapsed` in seconds, and saves optional notes |
| `POST` | `/CountingDowntimeDIJ/SubmitNotes` | **Yes** | `application/json` | Updates or clears `fnotes` on the target `fno` or latest downtime row for a machine |

---

## 2. Read & Manifest Endpoints

### `GET /CountingDowntimeDIJ/Index`

Queries `hdps_common_mst_machine` for `fprocess_code == "C05" && fis_active == true` with non-blank `fmachine_name`, sorted by `fmachine_no ?? 9999` ascending then `fmachine_name` ascending. Assigns the list to `ViewBag.Machines` and renders `Views/CountingDowntimeDIJ/Index.cshtml`.

---

### `GET /CountingDowntimeDIJ/Manifest`

Generates a dynamic PWA Web App Manifest (`application/manifest+json`) tailored to the selected machine so shopfloor tablets or desktops can install independent per-machine shortcuts.

**Query Parameters:**

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `machine` | `string` | Optional | Machine name (trimmed). If empty, returns generic `"Counting Downtime DIJ"` manifest |

**Example Response (`?machine=A01`):**

```json
{
  "name": "A01 - Counting Downtime DIJ",
  "short_name": "A01 Downtime",
  "id": "/CountingDowntimeDIJ?A01",
  "start_url": "/CountingDowntimeDIJ?A01",
  "scope": "/CountingDowntimeDIJ",
  "display": "standalone",
  "background_color": "#262624",
  "theme_color": "#262624",
  "launch_handler": {
    "client_mode": "focus-existing"
  },
  "icons": [
    {
      "src": "/Asset/HDPStudio/mattel.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/Asset/HDPStudio/mattel.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

---

### `GET /CountingDowntimeDIJ/GetMachines`

Utility JSON endpoint returning active `C05` machines sorted identically to `Index`. Not directly invoked by `Index.cshtml`, but available for external scripts or diagnostics.

**Response:**

```json
{
  "success": true,
  "data": [
    { "machine_name": "A01", "machine_code": "C051", "machine_no": 1 },
    { "machine_name": "A02", "machine_code": "C051", "machine_no": 2 }
  ]
}
```

---

### `GET /CountingDowntimeDIJ/GetMachineStatus`

Primary read API called on machine selection, post-mutation refresh, cross-tab sync events, focus/visibility return, and the 3-second heartbeat poll.

**Query Parameters:**

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `machineName` | `string` | **Yes** | Trimmed machine identifier; returns `{ success: false, message: "Machine name is required." }` if blank |

**Behavior:**
1. Queries the active downtime record: `fprocess_code == "C05" && fmachine_name == machineName && fdowntime_stop == null && fis_active == true`, ordered descending by `fdowntime_start`.
2. Queries the latest **5** active logs (`fis_active == true`) for the machine, ordered descending by `fdowntime_start`.
3. If an active record exists, computes live `elapsedNow = (int)Math.Max(0, (DateTime.Now - fdowntime_start.Value).TotalSeconds)`.

**Example Response (Downtime Currently Running):**

```json
{
  "success": true,
  "machine_name": "A01",
  "isDowntimeActive": true,
  "active": {
    "fno": 412,
    "machine_name": "A01",
    "start_display": "2026-11-21 09:42:10",
    "start_iso": "2026-11-21T09:42:10.0000000+07:00",
    "elapsed_seconds": 325,
    "elapsed_display": "05m 25s",
    "notes": "Nozzle clog cleaning"
  },
  "logs": [
    {
      "fno": 412,
      "machine_name": "A01",
      "start": "2026-11-21 09:42:10",
      "start_iso": "2026-11-21T09:42:10.0000000+07:00",
      "stop": "-",
      "stop_iso": null,
      "elapsed_seconds": null,
      "elapsed_display": "-",
      "notes": "Nozzle clog cleaning",
      "is_active_downtime": true
    },
    {
      "fno": 409,
      "machine_name": "A01",
      "start": "2026-11-21 08:10:00",
      "start_iso": "2026-11-21T08:10:00.0000000+07:00",
      "stop": "2026-11-21 08:17:45",
      "stop_iso": "2026-11-21T08:17:45.0000000+07:00",
      "elapsed_seconds": 465,
      "elapsed_display": "07m 45s",
      "notes": "Ink refill",
      "is_active_downtime": false
    }
  ]
}
```

---

## 3. State-Mutating `POST` Endpoints (CSRF-Protected)

All `POST` requests must be sent as `application/x-www-form-urlencoded` and include `__RequestVerificationToken` extracted from `@Html.AntiForgeryToken()`.

### `POST /CountingDowntimeDIJ/StartDowntime`

Starts a new downtime session for a machine.

**Form Parameters:**

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `machineName` | `string` | **Yes** | Target DIJ machine name |
| `notes` | `string` | Optional | Optional initial cause notes (trimmed; stored as `null` if blank) |
| `__RequestVerificationToken` | `string` | **Yes** | ASP.NET MVC anti-forgery token |

**Validation & Side Effects:**
- Rejects with `{ success: false, message: "Please select a machine first." }` if `machineName` is blank.
- Checks for an existing open row (`fdowntime_stop == null && fis_active == true`). If found, rejects with `"Machine {machineName} already has an active downtime in progress."`.
- Looks up `fmachine_code` and `fmachine_no` from `hdps_common_mst_machine`.
- Inserts a new `hdps_cddij_log_downtime` row with `fprocess_code = "C05"`, `fdowntime_start = DateTime.Now`, `fdowntime_stop = null`, `fdowntime_elapsed = null`, `fis_active = true`, `fcreated_by = null`.

**Success Response:**

```json
{
  "success": true,
  "fno": 412,
  "machine_name": "A01",
  "start_iso": "2026-11-21T09:42:10.0000000+07:00",
  "start_display": "2026-11-21 09:42:10",
  "message": "Downtime started for machine A01."
}
```

---

### `POST /CountingDowntimeDIJ/StopDowntime`

Closes an active downtime session and persists its total duration in seconds.

**Form Parameters:**

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `machineName` | `string` | **Yes** | Target DIJ machine name |
| `fno` | `int?` | Optional | Primary key of the active downtime row (`_activeFno`). If omitted or not found, falls back to the latest open row (`fdowntime_stop == null`) for `machineName` |
| `notes` | `string` | Optional | If **non-blank**, overwrites `fnotes` with `notes.Trim()`. If blank, **preserves** any existing notes already saved on the record |
| `__RequestVerificationToken` | `string` | **Yes** | ASP.NET MVC anti-forgery token |

**Elapsed Duration Calculation:**
- `fdowntime_stop = now` (`DateTime.Now`)
- `fdowntime_elapsed = (int)Math.Max(0, (now - record.fdowntime_start.Value).TotalSeconds)`
- Updates `fupdated_at = now` and `fupdated_by = null`.

**Success Response:**

```json
{
  "success": true,
  "fno": 412,
  "machine_name": "A01",
  "stop_iso": "2026-11-21T09:48:22.0000000+07:00",
  "stop_display": "2026-11-21 09:48:22",
  "elapsed_seconds": 372,
  "elapsed_display": "06m 12s",
  "notes": "Nozzle clog cleaning",
  "message": "Downtime stopped for machine A01."
}
```

---

### `POST /CountingDowntimeDIJ/SubmitNotes`

Updates (or clears) the `fnotes` column on either the currently active downtime or the most recent downtime record for a machine.

**Form Parameters:**

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `machineName` | `string` | **Yes** | Target DIJ machine name |
| `fno` | `int?` | Optional | Explicit row key (`_activeFno`). If null/missing, falls back to the latest active **or completed** row (`fis_active == true`, `OrderByDescending(fdowntime_start)`) for `machineName` |
| `notes` | `string` | Optional | Trimmed string saved to `fnotes`; unlike `StopDowntime`, submitting an empty/whitespace value **clears** `fnotes` to `null` |
| `__RequestVerificationToken` | `string` | **Yes** | ASP.NET MVC anti-forgery token |

**Success Response:**

```json
{
  "success": true,
  "fno": 412,
  "notes": "Replaced damper & ran printhead flush",
  "message": "Notes updated successfully."
}
```

---

## 4. Server Duration Formatting (`FormatSeconds`)

`CountingDowntimeDIJController.FormatSeconds(int? totalSec)` formats stored integer seconds into human-readable display strings for `elapsed_display`:

| Input (`totalSec`) | Condition | Output Format | Example |
| :--- | :--- | :--- | :--- |
| `null` or `< 0` | Invalid / still running | `"-"` | `"-"` |
| `0` – `59` | `< 1 minute` | `"{seconds}s"` *(no leading zero)* | `"8s"`, `"45s"` |
| `60` – `3599` | `1 min` – `59m 59s` | `"{minutes:D2}m {seconds:D2}s"` | `"05m 25s"` |
| `>= 3600` | `>= 1 hour` | `"{hours:D2}h {minutes:D2}m {seconds:D2}s"` | `"01h 05m 12s"` |

---

## 5. Scheduled Network Excel Auto-Export (`EPPlus`)

Automated `.xlsx` exports are driven by `static readonly System.Threading.Timer _exportTimer` inside `CountingDowntimeDIJController`.

### Dynamic Scheduling & Kill Switch

1. **Initialization (Static Constructor):** Queries `hdps_common_mst_exportedpath` for:
   ```csharp
   x.fis_active == true &&
   x.fprocess_code == "C05" &&
   x.fproject_name == "Counting Downtime DIJ" &&
   x.fproject_no == 1
   ```
   Starts `_exportTimer` with an initial startup delay of **`10 seconds`** and a recurring period equal to `config.fduration` seconds (defaulting to **`300 seconds` / 5 minutes** if missing or `<= 0`).
2. **Per-Tick Re-Evaluation (`OnExportTimerCallback`):**
   - Re-queries the SQL configuration row on every execution so database changes apply live without restarting IIS.
   - **Master Kill Switch:** If no matching row exists or `fis_active != true`, the callback returns immediately without writing a file.
   - **Live Interval Update:** If `config.fduration > 0`, calls `_exportTimer.Change(newInterval, newInterval)` dynamically.
3. **Workbook Generation (`ExportDataToNetworkPathStatic`):**
   - Uses `ExcelPackage.LicenseContext = LicenseContext.NonCommercial`.
   - Creates the target directory via `Directory.CreateDirectory(networkDir)` if absent.
   - Queries **all** active `C05` records from `hdps_cddij_log_downtime` ordered by `fdowntime_start` descending.
   - Overwrites the target `.xlsx` file atomically via `package.SaveAs(new FileInfo(filePath))`.

### Configuration Fields & Fallback Defaults

| SQL Column (`hdps_common_mst_exportedpath`) | Role | Fallback Default (if null/whitespace) |
| :--- | :--- | :--- |
| `fis_active` | Master on/off toggle (`1` = enabled, `0`/null = paused) | *Must be `true` to export* |
| `fduration` | Polling interval in **seconds** | `300` (5 minutes) |
| `fpath` | Destination network directory (UNC path) | `\\<file-server>\Public\HDP\HDP Studio\Exported` *(hostname sanitized)* |
| `ffile_name` | Output workbook filename | `Counting Downtime DIJ.xlsx` |
| `fsheet_name` | Worksheet tab name | `Sheet1` |

### Exported `.xlsx` Column Schema

Row `1` contains bold headers (`Style.Font.Bold = true`), data begins on Row `2`, and `AutoFitColumns()` is applied across the full populated range:

| Column | Header Text | Source Field / Transformation | Format / Type |
| :---: | :--- | :--- | :--- |
| `A` | `No` | `row - 1` (1-based sequential index) | Integer |
| `B` | `Process Code` | `item.fprocess_code` | String (`"C05"`) |
| `C` | `Machine Name` | `item.fmachine_name` | String |
| `D` | `Downtime Start` | `item.fdowntime_start?.ToString("yyyy-MM-dd HH:mm:ss")` | String timestamp |
| `E` | `Downtime Stop` | `item.fdowntime_stop?.ToString("yyyy-MM-dd HH:mm:ss")` | String timestamp *(blank if still active)* |
| `F` | `Downtime Elapsed` | `item.fdowntime_elapsed` | Raw integer **seconds** *(blank if still active)* |
| `G` | `Notes` | `item.fnotes` | String |
| `H` | `Created At` | `item.fcreated_at?.ToString("yyyy-MM-dd HH:mm:ss")` | String timestamp |
| `I` | `Updated At` | `item.fupdated_at?.ToString("yyyy-MM-dd HH:mm:ss")` | String timestamp |

---

## Next Step

Inspect the complete SQL table definitions and entity relationships in [Database Schema](./database-schema.md).
