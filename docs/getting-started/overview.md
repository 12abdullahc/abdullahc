# Technical Documentation Portal

Welcome to the central technical documentation hub for projects built and maintained across manufacturing systems, internal web applications, and engineering tools.

> [!NOTE]
> Every document in this portal is authored in plain Markdown with native support for **Mermaid architecture diagrams**, syntax-highlighted code blocks, GitHub-style callouts, and deep-linkable section anchors.

---

## Available Projects

| Project | Stack | Status | Chapters |
| :--- | :--- | :--- | :--- |
| **HDP OEE Neo Spray** | ASP.NET MVC 5, EF6, SQL Server, Chart.js | Active | [Overview](../hdp-oee-neo-spray/overview.md) · [System Architecture](../hdp-oee-neo-spray/system-architecture.md) · [Pages & UI](../hdp-oee-neo-spray/pages-and-ui.md) · [OEE Formulas](../hdp-oee-neo-spray/oee-formulas-and-logic.md) · [API & Exports](../hdp-oee-neo-spray/api-and-exports.md) · [Database Schema](../hdp-oee-neo-spray/database-schema.md) · [User Guide](../hdp-oee-neo-spray/user-guide.md) |

---

## Portal Layout & Navigation

This portal uses a reusable **3-column documentation layout**:

1. **Left Navigation Sidebar:** Browse projects and chapters loaded dynamically from `docs/docs-manifest.json`. Press `Ctrl+K` (or `/`) at any time to filter pages.
2. **Center Reading Pane:** Displays rendered Markdown, copyable code snippets, responsive tables, and interactive Mermaid diagrams (click **Expand** on any diagram for full-screen zoom).
3. **Right "On This Page" Outline:** Tracks `H2` and `H3` headings with scroll-spy highlighting so you can jump directly to any section.

---

## Adding New Documentation

The layout is intentionally **manifest-driven** — adding a new chapter or onboarding another module (such as *Preventive Maintenance*, *Sample Tracking*, or *Semi-Auto Spray*) requires no changes to HTML, CSS, or JavaScript:

1. Create a folder and Markdown file under `docs/`, for example:
   ```text
   docs/<project-slug>/<page-slug>.md
   ```
2. Register the group or page inside `docs/docs-manifest.json`:
   ```json
   {
     "id": "my-module",
     "title": "My Module",
     "icon": "fa-cubes",
     "badge": "MVC 5",
     "pages": [
       {
         "id": "overview",
         "title": "Overview",
         "file": "my-module/overview.md",
         "summary": "Short description shown in search and navigation tooltips."
       }
     ]
   }
   ```
3. Reload the portal — the sidebar navigation, breadcrumbs, URL hash route (`#my-module/overview`), and Previous/Next pagination update automatically.

> [!TIP]
> To preview locally without browser CORS restrictions on `fetch()`, serve the repository root over HTTP (for example using VS Code **Live Server** or `python -m http.server 8000`) and open `http://localhost:8000/docs/`.
