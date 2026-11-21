# HDP Counting Downtime DIJ — UI, PWA & Real-Time Sync

The entire operator experience lives inside a single self-contained Razor view (`Views/CountingDowntimeDIJ/Index.cshtml`) rendered within `_Layout_HDPStudio.cshtml`. It combines a high-contrast dark shopfloor interface, color-coded machine identity, a live drift-resistant stopwatch, per-machine installable PWA manifests, and a 4-layer real-time synchronization engine.

---

## 1. Layout Structure & Visual System

`Index.cshtml` uses a centered container (`.cd-container`, `max-width: 1300px`, `padding: 20px`) containing a two-column responsive CSS Grid (`.cd-main-grid`):

| Region | Grid Sizing | Collapses At | Surface & Key Components |
| :--- | :--- | :--- | :--- |
| **Left Panel — Downtime Controller** (`.cd-card`) | `380px` fixed column | `<= 960px` (stacks to `1fr`) | Dark `#262624` card with `#selectMachine` dropdown, `#timerBox` stopwatch display, **Start** / **Stop** buttons, `#inputNotes` textarea, and **Submit notes** button |
| **Right Panel — Recent Downtime History** (`.cd-table-card`) | `1fr` fluid column | `<= 960px` (stacks below) | Header with title + dynamic colored `#tableMachineBadge` pill, followed by a fixed-layout 5-column table (`#downtimeLogsTableBody`) showing up to **5 recent logs** |
| **Toast Stack** (`#toastContainer`) | Fixed bottom-right (`24px`) | All viewports | Auto-dismissing status notifications (`3.5s` visible + `300ms` fade/slide out) styled by `.success` (`#10b981`), `.error` (`#ef4444`), and `.info` (`#3b82f6`) |

### Semantic Color Palette (`:root` CSS Variables)

| Token | Hex / Value | UI Meaning |
| :--- | :--- | :--- |
| `--cd-bg` / `--cd-card-bg` | `#262624` | Primary card background matching the HDP Studio dark workspace |
| `--cd-accent-green` | `#10b981` | **Start** downtime button & success toast border |
| `--cd-accent-red` | `#ef4444` | **Stop** downtime button, active glowing stopwatch border/text (`.timer-active`), error toasts |
| `--cd-accent-amber` | `#f59e0b` | Reserved semantic warning token |
| `--cd-accent-blue` | `#3b82f6` | Info toast border |
| `--cd-text-muted` | `#8e8e89` | Labels, placeholders, and italic `"No notes"` empty cell text |

---

## 2. 12-Color Machine Identification Palette

To reduce operator mix-ups when running multiple DIJ stations side by side, `Index.cshtml` assigns every machine in `ViewBag.Machines` a deterministic high-contrast color via `machinePalette[i % 12]`. Selecting a machine calls `applyMachineSelectColor(machineName)` to style **both** the `<select id="selectMachine">` control and the `#tableMachineBadge` (`Machine <Name>`) pill in the history card header.

| Index (`i % 12`) | Color Name | Hex | Index (`i % 12`) | Color Name | Hex |
| :---: | :--- | :---: | :---: | :--- | :---: |
| `0` | Deep Blue | `#1e3a8a` | `6` | Deep Fuchsia | `#701a75` |
| `1` | Deep Emerald | `#064e3b` | `7` | Deep Sky Blue | `#0c4a6e` |
| `2` | Deep Purple | `#581c87` | `8` | Deep Amber | `#713f12` |
| `3` | Deep Orange | `#7c2d12` | `9` | Deep Indigo | `#312e81` |
| `4` | Deep Rose | `#831843` | `10` | Deep Green | `#14532d` |
| `5` | Deep Teal | `#134e4a` | `11` | Deep Crimson | `#881337` |

When `-- Select machine --` (`""`) is active, `#selectMachine` reverts to subtle translucent input styling (`rgba(255, 255, 255, 0.06)`) and `#tableMachineBadge` is hidden.

---

## 3. UI State Machine & Control Behavior

Client-side state is tracked by four variables (`_currentMachine`, `_activeFno`, `_activeStartTime`, `_timerInterval`) and transitions cleanly across three states:

| State | Trigger Function | `#timerDisplay` & `#timerBox` | `#timerStartTime` Subtitle | `Start` | `Stop` | `Notes` & `Submit notes` |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| **1. Idle (No Machine)** | `resetControlsToIdle()` when `_currentMachine === ''` | `00:00:00` (neutral border) | `Select a machine to begin` | Disabled | Disabled | Disabled & cleared |
| **2. Machine Ready (Running Normally)** | `resetControlsToIdle()` when `_currentMachine !== ''` and `isDowntimeActive === false` | `00:00:00` (neutral border) | `Ready / Running normally` | **Enabled** | Disabled | **Enabled** *(can pre-type notes or edit latest stopped row)* |
| **3. Downtime Active (Counting)** | `setControlsToDowntimeActive(activeData, preserveNotes)` | Live `HH:MM:SS` ticking every `1s`, red glowing `.timer-active` | `Started at: YYYY-MM-DD HH:mm:ss` | Disabled | **Enabled** | **Enabled** *(populates `activeData.notes` unless `preserveNotes = true`)* |

### Button Loading & Post-Action Transitions
- **Start (`startDowntime()`):** Disables `#btnStartDowntime`, displays `<i class="fas fa-spinner fa-spin"></i> Starting...`, posts `machineName`, `notes`, and CSRF token. On success, clears `#inputNotes`, switches UI immediately into **Downtime Active**, refreshes status (`preserveNotes = true`), and emits a `'start'` broadcast.
- **Stop (`stopDowntime()`):** Disables `#btnStopDowntime`, displays `Stopping...`, posts `machineName`, optional `_activeFno`, `notes`, and CSRF token. On success, clears `#inputNotes`, resets UI to **Machine Ready**, reloads history, and emits a `'stop'` broadcast.
- **Submit Notes (`submitNotes()`):** Disables `#btnSubmitNotes`, displays `Saving...`, posts `machineName`, optional `_activeFno`, `notes`, and CSRF token. On success, clears `#inputNotes`, refreshes status (`preserveNotes = true`), and emits a `'notes'` broadcast.

### Active-Downtime Machine Switch Guard
Inside `onMachineSelectionChanged(machineName)`, if a timer is currently running (`_timerInterval !== null || _activeFno !== null`) and the operator picks a different machine, the browser displays a native `confirm()` dialog:

> *"Downtime is currently counting for Machine `<current>`. Are you sure you want to switch to Machine `<next>`?"*

Clicking **Cancel** restores `#selectMachine.value` and its badge color back to `_currentMachine` without interrupting the active timer. Clicking **OK** switches the view only (the previous machine's active downtime continues counting safely on the server in SQL).

---

## 4. Live Stopwatch vs. Recent Downtime History Table

### Client-Side Live Stopwatch (`startLiveStopwatch`)
- Parses `activeData.start_iso` into `_activeStartTime = new Date(startTimeIso)`.
- **Anti-Flicker Guard:** If `_timerInterval` is already running and `Math.abs(_activeStartTime - newStart) < 1000` ms, the interval is **not** restarted — avoiding timer jitter during 3-second polling ticks.
- **Drift-Free Tick:** Every `1000ms`, recalculates `Math.max(0, Math.floor((new Date() - _activeStartTime) / 1000))` and formats it with `formatTimeDisplay()` as zero-padded `HH:MM:SS` using `font-variant-numeric: tabular-nums` so digits never shift horizontally.

### Recent Downtime History Table (`renderTableLogs`)
Displays up to **5 most recent records** (`logs.slice(0, 5)`) in a fixed-layout (`table-layout: fixed`) 5-column table:

| Column | Width | Rendering Behavior |
| :--- | :---: | :--- |
| **No** | `20px` | 1-based row index (`1`–`5`) |
| **Start Time** | `120px` | Monospace `yyyy-MM-dd HH:mm:ss` (`-` if null) |
| **Stop Time** | `120px` | Monospace `yyyy-MM-dd HH:mm:ss` (`-` while active) |
| **Elapsed Time** | `120px` | If `is_active_downtime === true`: bold red **`Counting...`** (`#f87171`). Otherwise: server-formatted `elapsed_display` (e.g., `01h 05m 12s`, `05m 12s`, `12s`) |
| **Notes** | `120px` | Single-line ellipsis truncation with full text exposed via hover `title` attribute; shows muted italic `No notes` when empty |

---

## 5. URL Deep-Linking & Dynamic Per-Machine PWA

### Supported URL Formats (`initUrlMachineSelection`)
On `DOMContentLoaded` and browser `popstate` (Back/Forward), `Index.cshtml` parses `window.location.search` and matches the machine name **case-insensitively** against `#selectMachine` options:

- **Short Query Format (Canonical):** `/CountingDowntimeDIJ?A01`
- **Named Query Parameter Format:** `/CountingDowntimeDIJ?machine=A01`

Whenever the user selects a machine from the dropdown, `onMachineSelectionChanged()` updates the browser address bar without a full page reload via `window.history.pushState({ machine }, '', pathname + '?' + encodeURIComponent(machine))`.

### Dynamic Per-Machine Web App Manifest (`updateAppManifest`)
Every machine selection calls `updateAppManifest(machineName)`, which creates (if missing) or updates `<link id="appManifestLink" rel="manifest">` in `<head>`:

- **Manifest URL:** `/CountingDowntimeDIJ/Manifest?machine=<encodedMachine>`
- **Page Title:** `<MachineName> - Counting Downtime DIJ` (or `Counting Downtime DIJ` when idle)
- **Standalone Identity:** The server generates a machine-specific `id`, `name`, `short_name`, and `start_url` (`/CountingDowntimeDIJ?<machine>`) with `display: "standalone"` and `launch_handler: { client_mode: "focus-existing" }`.
- **Result:** A single tablet or workstation can install multiple independent desktop/home-screen PWA apps (for example, `A01 Downtime` and `A02 Downtime`), each launching directly into its assigned machine and focusing any already-open window for that machine instead of spawning duplicate windows.

> [!NOTE]
> **No Service Worker Registered:** `inside-mvc` does not ship a `service-worker.js` file for this module. PWA installability relies on the dynamic Web App Manifest over HTTPS (or `localhost`), and live downtime logging always requires active network connectivity to SQL Server.

---

## 6. 4-Layer Real-Time Synchronization Mechanics

| Layer | Mechanism | Scope | Latency | Purpose |
| :---: | :--- | :--- | :---: | :--- |
| **1** | `BroadcastChannel('hdps_downtime_sync_channel')` | Same browser profile / same origin tabs & PWA windows | Instant (`< 50ms`) | Primary cross-window push whenever `Start`, `Stop`, or `Submit notes` succeeds |
| **2** | `window.addEventListener('storage')` on `localStorage['hdps_downtime_sync_event']` | Same browser profile / same origin tabs | Instant (`< 100ms`) | Fallback transport for browsers or contexts where `BroadcastChannel` is unavailable |
| **3** | `startStatusPolling()` (`setInterval(..., 3000)`) | Across separate physical tablets, PCs, and kiosks | `<= 3s` | Guarantees multi-device consistency when another workstation starts/stops downtime |
| **4** | `window.focus` & `document.visibilitychange` (`visible`) | Local tab / minimized tablet PWA | Immediate on resume | Immediately resynchronizes state when waking a sleeping tablet or switching back to the window |

All four layers invoke `fetchMachineStatus(_currentMachine, true, true)`:
1. **`_isFetchingStatus` Mutex:** Drops overlapping fetches if a previous request is still in flight.
2. **`preserveNotes = true`:** Keeps any unsaved text currently typed in `#inputNotes` intact.
3. **`isBackground = true`:** Suppresses error toast popups during transient background polling failures (logging only to `console.warn`).

---

## Next Step

Review every server-side endpoint contract, JSON payload, duration formatting rule, and the scheduled EPPlus Excel exporter in [API & Auto-Export Reference](./api-and-auto-export.md).
