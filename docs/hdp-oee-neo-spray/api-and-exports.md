# API & Data Export Reference

This chapter provides the complete contract reference for all **HDP OEE Neo Spray** MVC actions, JSON API endpoints, mutation endpoints, and file exports exposed by `Controllers/OEEController.cs` in `inside-mvc`.

---

## 1. Common Filter Query Parameters

The analytics and export endpoints share six optional comma-separated query parameters:

| Parameter | Type | Example | Behavior |
| :--- | :--- | :--- | :--- |
| `year` | `string` *(CSV ints)* | `2026` or `2025,2026` | Triggers Historical mode; filters `fdate_at.Year` / `Date.Year`. |
| `month` | `string` *(CSV ints)* | `4` or `3,4` | Triggers Historical mode; filters month number (`1`–`12`). |
| `we` | `string` *(CSV dates)* | `2026-04-18` | Triggers Historical mode; matches Week Ending date (`fwe_at` / `WE`). |
| `date` | `string` *(CSV dates)* | `2026-04-15,2026-04-16` | Triggers Historical mode; matches exact calendar date(s). |
| `shift` | `string` *(CSV numbers)* | `1` or `1,2` | Filters shift number(s). In Live mode, uses the first shift value. |
| `machine` | `string` *(CSV codes/IDs)* | `1,2` or `A01,A02` | Matches `fmachine` string OR numeric `fmachine_no` (`AS_OEE.Machine` for export). |

---

## 2. Analytics & Status Endpoints (`GET`)

### `GET /OEE/GetNeoSprayOEEMetrics`

Returns aggregated KPI metrics, downtime/reject totals, machine utilization, and pure-live previous shift benchmarks (`S1`, `S2`, `S3`).

- **Attributes:** `[HttpGet]`, `[OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]`
- **Query Params:** `year`, `month`, `date`, `we`, `shift`, `machine`
- **DbContext:** `HDPStudioEntities`

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "calculationMode": 1,
  "currentDate": "2026-04-20",
  "currentShift": 2,
  "oee": 78.42,
  "availability": 88.5,
  "performance": 91.2,
  "quality": 97.16,
  "utilization": 84.0,
  "distinctMachineCount": 42,
  "machineCount": 48,
  "totalDowntimeDuration": 12.5,
  "totalRejectOutput": 314,
  "lastOeeS1": 81.15,
  "lastOeeS2": 76.9,
  "lastOeeS3": 79.04
}
```

> [!NOTE]
> - In Historical mode, `currentShift`, `lastOeeS1`, `lastOeeS2`, and `lastOeeS3` return `null`.
> - `totalDowntimeDuration` sums raw `vw_hdps_oeens_log_downtime.fduration` in **hours** across all linked `foee_id` rows (including `"Break"`), whereas `GetNeoSprayDowntime` excludes `"Break"` / `"BREAK"` and returns **minutes**.

---

### `GET /OEE/GetNeoSprayLowestOEE`

Returns machines ordered **ascending** by OEE percentage for the **Lowest OEE** horizontal bar chart.

- **Query Params:** `year`, `month`, `date`, `we`, `shift`, `machine`
- **DbContext:** `HDPStudioEntities`

**Success Response:**
```json
{
  "success": true,
  "labels": ["B04", "C09", "A07", "D02"],
  "data": [52.4, 61.85, 68.1, 74.25]
}
```

---

### `GET /OEE/GetNeoSprayDowntime`

Returns downtime duration aggregated in **minutes** (`fduration * 60`) grouped by `fdowntime_name` (excluding `"Break"` and `"BREAK"`), sorted **descending**.

- **Query Params:** `year`, `month`, `date`, `we`, `shift`, `machine`
- **DbContext:** `HDPStudioEntities`

**Success Response:**
```json
{
  "success": true,
  "currentDate": "2026-04-20",
  "currentShift": 2,
  "labels": ["Nozzle Clogged", "Color Change", "Masking Setup"],
  "data": [145, 92, 48],
  "totalDowntime": 285
}
```

---

### `GET /OEE/GetNeoSprayReject`

Returns total reject pieces grouped by `freject_name`, sorted **descending**.

- **Query Params:** `year`, `month`, `date`, `we`, `shift`, `machine`
- **DbContext:** `HDPStudioEntities`

**Success Response:**
```json
{
  "success": true,
  "currentDate": "2026-04-20",
  "currentShift": 2,
  "labels": ["Overspray", "Pin Hole", "Color Contamination"],
  "data": [142, 89, 54],
  "totalReject": 285
}
```

---

### `GET /OEE/GetSemiAutoSprayMachines`

Polled every **3 seconds** by `NeoSprayLayout.cshtml` to paint live floor status colors and hover tooltips for all machines under `fprocess_code == "C07"`.

- **Query Params:** None
- **DbContext:** `HDPStudioOEEStudioEntities` (`hdps_oee_cur_condition`)
- **Sibling Endpoint:** `GET /OEE/GetSemiAutoSprayStatus` returns a minimal subset (`machineCode`, `machineStatus`, `pcServerState`) for `fprocess_code == "C07"` *(exists in `OEEController.cs`, currently unused by `NeoSprayLayout.cshtml`)*.

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "machineCode": "SAS A01",
      "machineNo": 1,
      "partDescription": "Sample Painted Head Part",
      "oee": 0.8421,
      "availability": 0.91,
      "performance": 0.95,
      "quality": 0.974,
      "actualOutput": 820,
      "goodOutput": 799,
      "rejectOutput": 21,
      "shiftlyTarget": 1200,
      "machineStatus": 3,
      "pcServerState": 0
    }
  ]
}
```

---

### `GET /OEE/GetNeoSprayFilterOptions`

Initializes the six right-sidebar cascading filter dropdowns in `_Layout_HDPStudio.cshtml`.

- **Query Params:** None
- **DbContext:** `HDPStudioOEEStudioEntities` (`AS_OEE` where `Process_Code == "C07" && Date.HasValue`)

**Success Response:**
```json
{
  "success": true,
  "years": [2026, 2025],
  "yearMonths": ["2026-4", "2026-3"],
  "weekEndings": ["2026-04-18", "2026-04-11"],
  "dates": ["2026-04-20", "2026-04-19"],
  "rows": [
    { "year": 2026, "month": 4, "date": "2026-04-20", "we": "2026-04-25" }
  ],
  "shifts": [1, 2, 3],
  "machines": [1, 2, 3]
}
```

---

## 3. Settings & Shift Control Endpoints

### `GET /OEE/GetOEECalculationMode`

Returns the persisted Neo Spray OEE calculation mode.

- **Attributes:** `[HttpGet]`, `[OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]`
- **Response:** `{ "success": true, "mode": 1 }` *(where `1 = Simple`, `2 = Aggregate`; falls back to `mode: 1` on error)*.

### `POST /OEE/UpdateOEECalculationMode`

Persists the OEE calculation mode into `hdps_common_mst_setting` (creates the setting record if missing).

- **Attributes:** `[HttpPost]`, `[ValidateAntiForgeryToken]`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Form Fields:** `mode` (`1` or `2`), `__RequestVerificationToken`
- **Response:** `{ "success": true, "mode": 2 }`

### `POST /OEE/EndShift`

Resets all operational columns (including `foee_id`, `fdate`, `fshift`, metrics, part info, `fstatus`, `fpc_server_state`, `fmachine_status`, and overtime flags) to `null` in `hdps_oee_cur_condition`.

- **Attributes:** `[HttpPost]`
- **Optional Parameter:** `GeneratedId` (`int?`) — when omitted, resets **all** records in `hdps_oee_cur_condition`; when supplied, resets only the record matching `foee_id == GeneratedId`.
- **Response:**
  ```json
  {
    "success": true,
    "message": "Shift ended successfully for all 51 records"
  }
  ```

> [!WARNING]
> Calling `POST /OEE/EndShift` without `GeneratedId` clears every row in `hdps_oee_cur_condition` across the entire table (not filtered by `fprocess_code`). Use only during coordinated shift resets.

---

## 4. Input Reject (Throw-Off) Endpoints

> [!NOTE]
> Unlike `GetNeoSprayFilterOptions` and `ExportNeoSpray`, the `NeoSprayInputReject()` page loader and the three cascading lookup endpoints below query `AS_OEE` without filtering `Process_Code == "C07"`.

### `GET /OEE/GetDatesByMachine`
- **Params:** `machine` (`double`)
- **Returns:** `{ "success": true, "dates": [{ "value": "2026-04-20", "text": "04/20/2026" }] }` ordered descending.

### `GET /OEE/GetShiftsByMachineAndDate`
- **Params:** `machine` (`double`), `date` (`DateTime`)
- **Returns:** `{ "success": true, "shifts": [{ "value": "1", "text": "Shift 1" }] }` ordered ascending.

### `GET /OEE/GetToysByShift`
- **Params:** `machine` (`double`), `date` (`DateTime`), `shift` (`double`)
- **Logic:** Queries `AS_OEE`, joins `AS_OEE_Support` on `OEE_Id == ID || OEE_Id == Number`, formats label as `"{Part_Number} — {Part_Desc}"` (falling back to `"Item #" + Number`).
- **Returns:**
  ```json
  {
    "success": true,
    "toys": [
      {
        "oeeId": 10452,
        "text": "HDP-1234  —  Head Doll Paint",
        "actualOutput": 950,
        "lastReject": 18
      }
    ]
  }
  ```

### `POST /OEE/SaveNeoSprayInputReject`
- **Params:** `oeeId` (`int?`), `machine` (`double?`), `date` (`DateTime?`), `shift` (`double?`), `rejectName` (`string`), `inputReject` (`double?`)
- **Validation:** Rejects `inputReject <= 0` or empty `rejectName`; returns error if target `AS_OEE` row cannot be resolved.
- **Side Effects:** Updates `AS_OEE` (`Reject`, `Good_Output`, `Var`, `Quality`, `OEE`) and inserts a detail record into `AS_Reject`.
- **Returns:**
  ```json
  {
    "success": true,
    "message": "Reject quantity saved successfully!",
    "Reject": 23,
    "Reject_Code": "R04"
  }
  ```

---

## 5. Multi-Format Data Export (`GET /OEE/ExportNeoSpray`)

Streams filtered `AS_OEE` rows (`Process_Code == "C07" && Date.HasValue`, ordered ascending by `Date`) in one of three formats controlled by the `format` query parameter:

| `format` | Library / Generator | MIME Content-Type | Downloaded Filename | Layout Details |
| :--- | :--- | :--- | :--- | :--- |
| `csv` *(default)* | `StringBuilder` + UTF-8 BOM | `text/csv` | `NeoSpray_Export.csv` | Quoted values with `""` CSV escaping, UTF-8 BOM for clean Excel import |
| `xlsx` | **ClosedXML** (`XLWorkbook`) | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | `NeoSpray_Export.xlsx` | Worksheet `"NeoSpray"`, bold header row, numeric doubles preserved, auto-fit columns |
| `pdf` | **iTextSharp** (`PdfPTable`) | `application/pdf` | `NeoSpray_Export.pdf` | A4 Landscape (`PageSize.A4.Rotate()`), light-gray centered headers, 100% width 19-column table |

### Exported 19-Column Schema

`Date` · `WE` · `Machine` · `Shift` · `Total Time` · `Break` · `Briefing` · `Available Time` · `Total Breakdown Time` · `Operating Time` · `Standard Output` · `Good Output` · `Reject` · `Actual Output` · `Var` · `Availability` · `Performance` · `Quality` · `OEE`

Filter parameters are parsed strictly with `int.Parse` / `double.Parse` / `DateTime.Parse`; malformed query values or unhandled exceptions return `HTTP 500 Internal Server Error` with the exception message.

---

## Next Step

Continue to [Database Schema & Views](./database-schema.md) for full column-by-column definitions of every SQL view, master table, and operational table used by HDP OEE Neo Spray.
