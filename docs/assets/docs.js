/* ═══════════════════════════════════════════════
   Documentation Portal Engine
   Manifest-driven multi-page Markdown + Mermaid viewer
   Claude-inspired Editorial Dual-Mode (Ivory / Charcoal)
═══════════════════════════════════════════════ */

(function () {
  "use strict";

  const MERMAID_CDN_URL =
    "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js";

  // ── State ──
  let manifest = null;
  let flatPages = [];
  let currentRoute = "";
  let headingsData = [];
  let currentActiveHeadingId = "";
  let currentMermaidEntries = [];
  let mermaidLoadPromise = null;
  let mermaidInitializedTheme = "";
  let mermaidRenderToken = 0;
  let mermaidObserver = null;
  let mermaidQueue = Promise.resolve();
  let currentTheme =
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  let isTocHovered = false;
  let lightboxZoom = 1;

  // ── DOM References ──
  const navSidebar = document.getElementById("navSidebar");
  const navTree = document.getElementById("navTree");
  const navSearchInput = document.getElementById("navSearchInput");
  const clearNavSearchBtn = document.getElementById("clearNavSearchBtn");
  const navDocCount = document.getElementById("navDocCount");

  const tocSidebar = document.getElementById("tocSidebar");
  const tocScrollArea = document.getElementById("tocScrollArea");
  const tocList = document.getElementById("tocList");
  const tocCount = document.getElementById("tocCount");

  const breadcrumbs = document.getElementById("breadcrumbs");
  const readingTimeBadge = document.getElementById("readingTimeBadge");
  const copyPageLinkBtn = document.getElementById("copyPageLinkBtn");
  const markdownContent = document.getElementById("markdownContent");
  const docPagination = document.getElementById("docPagination");

  const loadingOverlay = document.getElementById("loadingOverlay");
  const errorContainer = document.getElementById("errorContainer");
  const errorTitle = document.getElementById("errorTitle");
  const errorMsg = document.getElementById("errorMsg");
  const errorTip = document.getElementById("errorTip");

  const brandHomeLink = document.getElementById("brandHomeLink");
  const mobileNavBtn = document.getElementById("mobileNavBtn");
  const mobileTocBtn = document.getElementById("mobileTocBtn");
  const searchTriggerBtn = document.getElementById("searchTriggerBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeToggleIcon = document.getElementById("themeToggleIcon");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  const diagramLightbox = document.getElementById("diagramLightbox");
  const diagramLightboxTitle = document.getElementById("diagramLightboxTitle");
  const diagramLightboxCanvas = document.getElementById("diagramLightboxCanvas");
  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");
  const zoomResetBtn = document.getElementById("zoomResetBtn");
  const zoomLevelText = document.getElementById("zoomLevelText");
  const closeLightboxBtn = document.getElementById("closeLightboxBtn");

  // ── Library Configuration ──
  if (window.marked) {
    marked.setOptions({
      gfm: true,
      breaks: false
    });
  }

  function getMermaidThemeVariables(theme) {
    if (theme === "dark") {
      return {
        darkMode: true,
        background: "#1f1f1d",
        primaryColor: "#2e2e2b",
        primaryTextColor: "#faf9f5",
        primaryBorderColor: "#4a4a46",
        lineColor: "#bf6542",
        secondaryColor: "#262624",
        tertiaryColor: "#1f1f1d",
        mainBkg: "#2e2e2b",
        nodeBorder: "#4a4a46",
        clusterBkg: "rgba(250, 249, 245, 0.04)",
        clusterBorder: "#3d3d3a",
        edgeLabelBackground: "#262624",
        actorBkg: "#2e2e2b",
        actorBorder: "#bf6542",
        actorTextColor: "#faf9f5",
        actorLineColor: "#52524e",
        signalColor: "#df825d",
        signalTextColor: "#faf9f5",
        noteBkgColor: "#2e2e2b",
        noteBorderColor: "#bf6542",
        noteTextColor: "#f5f4f0",
        attributeBackgroundColorOdd: "#262624",
        attributeBackgroundColorEven: "#2e2e2b",
        fontFamily: "Figtree, system-ui, -apple-system, sans-serif",
        fontSize: "13px"
      };
    }

    return {
      darkMode: false,
      background: "#f4f3ee",
      primaryColor: "#faf9f5",
      primaryTextColor: "#141413",
      primaryBorderColor: "#d4d1c5",
      lineColor: "#bf6542",
      secondaryColor: "#f0eee6",
      tertiaryColor: "#f4f3ee",
      mainBkg: "#faf9f5",
      nodeBorder: "#d4d1c5",
      clusterBkg: "rgba(20, 20, 19, 0.028)",
      clusterBorder: "#d4d1c5",
      edgeLabelBackground: "#f4f3ee",
      actorBkg: "#faf9f5",
      actorBorder: "#bf6542",
      actorTextColor: "#141413",
      actorLineColor: "#a3a096",
      signalColor: "#bf6542",
      signalTextColor: "#141413",
      noteBkgColor: "#f0eee6",
      noteBorderColor: "#d4d1c5",
      noteTextColor: "#3d3d3a",
      attributeBackgroundColorOdd: "#faf9f5",
      attributeBackgroundColorEven: "#f0eee6",
      fontFamily: "Figtree, system-ui, -apple-system, sans-serif",
      fontSize: "13px"
    };
  }

  function ensureMermaidLoaded() {
    if (window.mermaid) return Promise.resolve(true);
    if (mermaidLoadPromise) return mermaidLoadPromise;

    mermaidLoadPromise = new Promise(function (resolve) {
      const script = document.createElement("script");
      script.src = MERMAID_CDN_URL;
      script.async = true;
      script.onload = function () {
        resolve(Boolean(window.mermaid));
      };
      script.onerror = function () {
        mermaidLoadPromise = null;
        resolve(false);
      };
      document.head.appendChild(script);
    });

    return mermaidLoadPromise;
  }

  function initMermaid(theme) {
    if (!window.mermaid || mermaidInitializedTheme === theme) return;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis"
      },
      sequence: {
        useMaxWidth: true,
        mirrorActors: false
      },
      er: {
        useMaxWidth: true
      },
      themeVariables: getMermaidThemeVariables(theme)
    });
    mermaidInitializedTheme = theme;
  }

  function applyTheme(theme, rerenderDiagrams) {
    currentTheme = theme === "dark" ? "dark" : "light";
    const root = document.documentElement;

    // Disable transitions for 1 frame so mobile GPUs repaint instantly without jank
    root.classList.add("theme-switching");
    root.setAttribute("data-theme", currentTheme);

    if (themeToggleIcon && themeToggleBtn) {
      if (currentTheme === "dark") {
        themeToggleIcon.className = "fas fa-sun";
        themeToggleBtn.title = "Switch to Light mode";
      } else {
        themeToggleIcon.className = "fas fa-moon";
        themeToggleBtn.title = "Switch to Dark mode";
      }
    }

    void root.offsetHeight;
    requestAnimationFrame(function () {
      root.classList.remove("theme-switching");
    });

    try {
      localStorage.setItem("docs_theme", currentTheme);
    } catch (e) {
      /* ignore storage errors */
    }

    if (rerenderDiagrams && currentMermaidEntries.length > 0) {
      mermaidRenderToken++;
      const activeToken = mermaidRenderToken;
      const targetTheme = currentTheme;

      // Instant swap for any diagram already cached in targetTheme
      currentMermaidEntries.forEach(function (entry) {
        if (entry.svgCache[targetTheme]) {
          applyCachedMermaidSvg(entry, targetTheme);
        }
      });

      // Defer uncached visible diagrams until after the theme has painted
      requestAnimationFrame(function () {
        setTimeout(function () {
          if (activeToken !== mermaidRenderToken) return;
          scheduleMermaidDiagrams(currentMermaidEntries, activeToken, targetTheme);
        }, 0);
      });
    }
  }

  // ── Utilities ──
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function slugify(text) {
    return String(text)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function showLoading(show) {
    loadingOverlay.classList.toggle("hidden", !show);
  }

  function showError(title, message, tipHtml) {
    errorTitle.textContent = title;
    errorMsg.textContent = message;
    if (tipHtml) {
      errorTip.innerHTML = tipHtml;
      errorTip.style.display = "block";
    } else {
      errorTip.style.display = "none";
    }
    errorContainer.style.display = "block";
  }

  function hideError() {
    errorContainer.style.display = "none";
  }

  function buildFileCorsTip() {
    if (window.location.protocol === "file:") {
      return (
        'Browsers block <code>fetch()</code> requests over <code>file://</code>. ' +
        "Start a local HTTP server from the repository root (for example " +
        "<code>python -m http.server 8000</code> or VS Code Live Server) and open " +
        "<code>http://localhost:8000/docs/</code>."
      );
    }
    return "";
  }

  // ── Drawer & Modal Controls ──
  function closeAllDrawers() {
    navSidebar.classList.remove("open");
    tocSidebar.classList.remove("open");
    drawerOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  function toggleNavDrawer() {
    const willOpen = !navSidebar.classList.contains("open");
    closeAllDrawers();
    if (willOpen) {
      navSidebar.classList.add("open");
      drawerOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function toggleTocDrawer() {
    const willOpen = !tocSidebar.classList.contains("open");
    closeAllDrawers();
    if (willOpen) {
      tocSidebar.classList.add("open");
      drawerOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function getSvgNaturalWidth(svgElement) {
    if (svgElement.viewBox && svgElement.viewBox.baseVal && svgElement.viewBox.baseVal.width > 0) {
      return Math.ceil(svgElement.viewBox.baseVal.width);
    }
    const vbAttr = svgElement.getAttribute("viewBox");
    if (vbAttr) {
      const parts = vbAttr.trim().split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts[2] > 0) return Math.ceil(parts[2]);
    }
    const rect = svgElement.getBoundingClientRect();
    return rect.width > 0 ? Math.ceil(rect.width) : 800;
  }

  function openLightbox(title, svgElement) {
    diagramLightboxTitle.textContent = title || "Diagram Preview";
    diagramLightboxCanvas.innerHTML = "";
    const clone = svgElement.cloneNode(true);
    const naturalW = getSvgNaturalWidth(svgElement);
    const targetW = Math.max(Math.min(naturalW, 1800), 820);
    clone.removeAttribute("style");
    clone.removeAttribute("height");
    clone.setAttribute("width", String(targetW));
    clone.style.width = targetW + "px";
    clone.style.maxWidth = "none";
    clone.style.height = "auto";
    clone.style.display = "block";
    diagramLightboxCanvas.appendChild(clone);
    lightboxZoom = 1;
    applyLightboxZoom();
    diagramLightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    diagramLightbox.classList.remove("open");
    diagramLightboxCanvas.innerHTML = "";
    document.body.style.overflow = "";
  }

  function applyLightboxZoom() {
    diagramLightboxCanvas.style.transform = "scale(" + lightboxZoom + ")";
    zoomLevelText.textContent = Math.round(lightboxZoom * 100) + "%";
  }

  // ── Routing Helpers ──
  function parseHash() {
    const raw = (window.location.hash || "").replace(/^#/, "").trim();
    if (!raw) {
      return { route: manifest ? manifest.defaultPage : "", heading: "" };
    }
    const atIndex = raw.indexOf("@");
    if (atIndex !== -1) {
      return {
        route: raw.slice(0, atIndex),
        heading: decodeURIComponent(raw.slice(atIndex + 1))
      };
    }
    return { route: raw, heading: "" };
  }

  function findPageByRoute(route) {
    return flatPages.find(function (p) {
      return p.route === route;
    });
  }

  function resolveRelativePath(baseFile, relHref) {
    const baseParts = baseFile.split("/");
    baseParts.pop();
    const relParts = relHref.split("/");
    relParts.forEach(function (part) {
      if (!part || part === ".") return;
      if (part === "..") {
        baseParts.pop();
      } else {
        baseParts.push(part);
      }
    });
    return baseParts.join("/");
  }

  // ── Navigation Tree ──
  function renderNavTree(filterQuery) {
    const query = (filterQuery || "").toLowerCase().trim();
    navTree.innerHTML = "";
    let visiblePageCount = 0;

    manifest.groups.forEach(function (group) {
      const matchingPages = group.pages.filter(function (page) {
        if (!query) return true;
        const haystack = (
          group.title +
          " " +
          page.title +
          " " +
          (page.summary || "")
        ).toLowerCase();
        return haystack.includes(query);
      });

      if (matchingPages.length === 0) return;

      const groupEl = document.createElement("div");
      groupEl.className = "nav-group";
      groupEl.dataset.groupId = group.id;

      const headerBtn = document.createElement("button");
      headerBtn.type = "button";
      headerBtn.className = "nav-group-header";
      headerBtn.innerHTML =
        '<span class="nav-group-title">' +
        escapeHtml(group.title) +
        "</span>" +
        '<i class="fas fa-chevron-down nav-group-chevron"></i>';

      headerBtn.addEventListener("click", function () {
        groupEl.classList.toggle("collapsed");
      });

      const listEl = document.createElement("ul");
      listEl.className = "nav-group-pages";

      matchingPages.forEach(function (page) {
        visiblePageCount++;
        const route = group.id + "/" + page.id;
        const li = document.createElement("li");
        li.className = "nav-page-item";

        const a = document.createElement("a");
        a.href = "#" + route;
        a.className = "nav-page-link" + (route === currentRoute ? " active" : "");
        a.dataset.route = route;
        a.title = page.summary || page.title;
        a.textContent = page.title;

        a.addEventListener("click", function () {
          if (window.innerWidth < 1024) {
            closeAllDrawers();
          }
        });

        li.appendChild(a);
        listEl.appendChild(li);
      });

      groupEl.appendChild(headerBtn);
      groupEl.appendChild(listEl);
      navTree.appendChild(groupEl);
    });

    if (visiblePageCount === 0) {
      const empty = document.createElement("div");
      empty.className = "nav-empty-state";
      empty.textContent = 'No pages match "' + filterQuery + '".';
      navTree.appendChild(empty);
    }

    const total = flatPages.length;
    navDocCount.textContent =
      total + (total === 1 ? " document" : " documents");
  }

  function updateActiveNavLink() {
    navTree.querySelectorAll(".nav-page-link").forEach(function (link) {
      link.classList.toggle("active", link.dataset.route === currentRoute);
    });
  }

  // ── Document Rendering Pipeline ──
  async function loadPage(route, targetHeadingId) {
    const pageEntry = findPageByRoute(route) || flatPages[0];
    if (!pageEntry) {
      showError("No documents registered", "docs-manifest.json contains no pages.");
      showLoading(false);
      return;
    }

    currentRoute = pageEntry.route;
    currentActiveHeadingId = "";
    disconnectMermaidObserver();
    mermaidRenderToken++;
    currentMermaidEntries = [];
    hideError();
    showLoading(true);
    updateActiveNavLink();
    renderBreadcrumbs(pageEntry);
    renderPagination(pageEntry);

    try {
      const res = await fetch(pageEntry.file, { cache: "no-cache" });
      if (!res.ok) {
        throw new Error("HTTP " + res.status + " while fetching " + pageEntry.file);
      }

      const mdText = await res.text();
      updateReadingTime(mdText);

      markdownContent.innerHTML = marked.parse(mdText);

      transformCallouts();
      wrapResponsiveTables();
      rewriteInternalLinks(pageEntry);
      currentMermaidEntries = extractMermaidBlocks();
      highlightAndWrapCodeBlocks();
      buildTocAndAnchors();

      document.title =
        pageEntry.title + " — " + pageEntry.groupTitle + " | " + (manifest.siteTitle || "Docs");

      if (targetHeadingId) {
        scrollToHeading(targetHeadingId, false);
      } else {
        window.scrollTo({ top: 0 });
      }
      scrollSpy();
      showLoading(false);

      if (currentMermaidEntries.length > 0) {
        scheduleMermaidDiagrams(currentMermaidEntries, mermaidRenderToken, currentTheme);
      }
    } catch (err) {
      console.error("Failed to load documentation page:", err);
      markdownContent.innerHTML = "";
      tocList.innerHTML = "";
      tocCount.textContent = "0";
      showError(
        "Failed to load document",
        'Could not load "' + pageEntry.file + '". ' + err.message,
        buildFileCorsTip()
      );
      showLoading(false);
    }
  }

  function renderBreadcrumbs(pageEntry) {
    breadcrumbs.innerHTML =
      '<a href="#' + escapeHtml(manifest.defaultPage) + '">Docs</a>' +
      '<i class="fas fa-chevron-right breadcrumb-sep"></i>' +
      "<span>" + escapeHtml(pageEntry.groupTitle) + "</span>" +
      '<i class="fas fa-chevron-right breadcrumb-sep"></i>' +
      '<span class="breadcrumb-current">' + escapeHtml(pageEntry.title) + "</span>";
  }

  function updateReadingTime(mdText) {
    const words = mdText
      .replace(/```[\s\S]*?```/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 210));
    readingTimeBadge.innerHTML =
      '<i class="far fa-clock"></i> <span>' + mins + " min read</span>";
  }

  // Transform GitHub-style alert blockquotes (> [!NOTE], > [!TIP], etc.)
  function transformCallouts() {
    const calloutMeta = {
      NOTE: { cls: "note", icon: "fa-circle-info", label: "Note" },
      TIP: { cls: "tip", icon: "fa-lightbulb", label: "Tip" },
      IMPORTANT: { cls: "important", icon: "fa-circle-exclamation", label: "Important" },
      WARNING: { cls: "warning", icon: "fa-triangle-exclamation", label: "Warning" },
      CAUTION: { cls: "caution", icon: "fa-shield-halved", label: "Caution" }
    };

    markdownContent.querySelectorAll("blockquote").forEach(function (bq) {
      const firstP = bq.querySelector("p");
      if (!firstP) return;

      const match = firstP.innerHTML.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(<br\s*\/?>|\n)?/i);
      if (!match) return;

      const typeKey = match[1].toUpperCase();
      const meta = calloutMeta[typeKey];
      firstP.innerHTML = firstP.innerHTML.slice(match[0].length).trim();
      if (!firstP.innerHTML) {
        firstP.remove();
      }

      const box = document.createElement("div");
      box.className = "callout callout-" + meta.cls;

      const titleEl = document.createElement("div");
      titleEl.className = "callout-title";
      titleEl.innerHTML = '<i class="fas ' + meta.icon + '"></i><span>' + meta.label + "</span>";

      const bodyEl = document.createElement("div");
      bodyEl.className = "callout-body";
      while (bq.firstChild) {
        bodyEl.appendChild(bq.firstChild);
      }

      box.appendChild(titleEl);
      box.appendChild(bodyEl);
      bq.parentNode.replaceChild(box, bq);
    });
  }

  function wrapResponsiveTables() {
    markdownContent.querySelectorAll("table").forEach(function (table) {
      if (table.parentElement.classList.contains("table-scroll")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "table-scroll";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  function rewriteInternalLinks(pageEntry) {
    markdownContent.querySelectorAll("a[href]").forEach(function (a) {
      const href = a.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href) || href.startsWith("mailto:")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        return;
      }

      if (href.startsWith("#")) {
        const headingId = href.slice(1);
        a.href = "#" + pageEntry.route + "@" + encodeURIComponent(headingId);
        a.addEventListener("click", function (e) {
          e.preventDefault();
          scrollToHeading(headingId, true);
        });
        return;
      }

      const mdMatch = href.match(/^([^#?]+\.md)(?:#(.+))?$/i);
      if (mdMatch) {
        const resolved = resolveRelativePath(pageEntry.file, mdMatch[1]);
        const targetPage = flatPages.find(function (p) {
          return p.file.toLowerCase() === resolved.toLowerCase();
        });
        if (targetPage) {
          const hashTarget =
            "#" +
            targetPage.route +
            (mdMatch[2] ? "@" + encodeURIComponent(mdMatch[2]) : "");
          a.setAttribute("href", hashTarget);
        }
      }
    });

    markdownContent.querySelectorAll("img[src]").forEach(function (img) {
      const src = img.getAttribute("src") || "";
      if (!src || /^(https?:|data:|\/)/i.test(src)) return;
      img.setAttribute("src", resolveRelativePath(pageEntry.file, src));
      if (!img.getAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
    });
  }

  // Extract ```mermaid blocks before syntax highlighting
  function extractMermaidBlocks() {
    const entries = [];
    const blocks = markdownContent.querySelectorAll(
      "pre > code.language-mermaid, pre > code.lang-mermaid"
    );

    blocks.forEach(function (codeEl, idx) {
      const pre = codeEl.parentElement;
      const source = codeEl.textContent.trim();

      let label = "Architecture Diagram #" + (idx + 1);
      let prev = pre.previousElementSibling;
      while (prev) {
        if (/^H[2-4]$/.test(prev.tagName)) {
          label = prev.textContent.replace(/#$/, "").trim();
          break;
        }
        prev = prev.previousElementSibling;
      }

      const card = document.createElement("div");
      card.className = "mermaid-card";

      const header = document.createElement("div");
      header.className = "mermaid-card-header";
      header.innerHTML =
        '<span class="mermaid-card-label"><i class="fas fa-diagram-project"></i> ' +
        escapeHtml(label) +
        "</span>" +
        '<div class="mermaid-card-actions">' +
        '<button type="button" class="copy-code-btn mermaid-copy-btn" title="Copy Mermaid source">' +
        '<i class="far fa-copy"></i> <span>Source</span></button>' +
        '<button type="button" class="copy-code-btn mermaid-expand-btn" title="Expand diagram">' +
        '<i class="fas fa-expand"></i> <span>Expand</span></button>' +
        "</div>";

      const canvas = document.createElement("div");
      canvas.className = "mermaid-canvas";
      canvas.innerHTML = '<div class="mermaid-loading">Loading diagram...</div>';

      card.appendChild(header);
      card.appendChild(canvas);
      pre.parentNode.replaceChild(card, pre);

      const entry = {
        card: card,
        canvas: canvas,
        source: source,
        label: label,
        svgCache: {},
        renderedTheme: ""
      };

      const copyBtn = header.querySelector(".mermaid-copy-btn");
      copyBtn.addEventListener("click", function () {
        copyTextToClipboard(source, copyBtn, '<i class="far fa-copy"></i> <span>Source</span>');
      });

      const expandBtn = header.querySelector(".mermaid-expand-btn");
      expandBtn.addEventListener("click", async function () {
        if (entry.renderedTheme !== currentTheme || !canvas.querySelector("svg")) {
          await queueMermaidEntryRender(entry, mermaidRenderToken, currentTheme);
        }
        const svg = canvas.querySelector("svg");
        if (svg) {
          openLightbox(label, svg);
        }
      });

      entries.push(entry);
    });

    return entries;
  }

  function disconnectMermaidObserver() {
    if (mermaidObserver) {
      mermaidObserver.disconnect();
      mermaidObserver = null;
    }
  }

  function styleMermaidSvg(svg) {
    const naturalW = getSvgNaturalWidth(svg);
    const minReadableW = Math.min(naturalW, 640);
    svg.removeAttribute("height");
    svg.setAttribute("width", "100%");
    svg.style.width = "100%";
    svg.style.maxWidth = Math.max(naturalW, 680) + "px";
    svg.style.minWidth = minReadableW + "px";
    svg.style.height = "auto";
  }

  function applyCachedMermaidSvg(entry, theme) {
    const cachedHtml = entry.svgCache[theme];
    if (!cachedHtml) return false;
    entry.canvas.innerHTML = cachedHtml;
    entry.renderedTheme = theme;
    return true;
  }

  function isElementNearViewport(el, marginPx) {
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight || document.documentElement.clientHeight || 800;
    return rect.bottom >= -marginPx && rect.top <= viewH + marginPx;
  }

  function queueMermaidEntryRender(entry, token, theme) {
    if (entry.renderedTheme === theme && entry.canvas.querySelector("svg")) {
      return Promise.resolve();
    }
    if (applyCachedMermaidSvg(entry, theme)) {
      return Promise.resolve();
    }

    mermaidQueue = mermaidQueue.then(async function () {
      if (token !== mermaidRenderToken) return;
      if (entry.renderedTheme === theme && entry.canvas.querySelector("svg")) return;
      if (applyCachedMermaidSvg(entry, theme)) return;

      const loaded = await ensureMermaidLoaded();
      if (token !== mermaidRenderToken) return;
      if (!loaded) {
        entry.canvas.innerHTML =
          '<div class="mermaid-error">Mermaid library failed to load from CDN.\n\n' +
          escapeHtml(entry.source) +
          "</div>";
        return;
      }

      try {
        initMermaid(theme);
        const freshDiv = document.createElement("div");
        freshDiv.className = "mermaid";
        freshDiv.textContent = entry.source;
        entry.canvas.innerHTML = "";
        entry.canvas.appendChild(freshDiv);

        await mermaid.run({ nodes: [freshDiv] });
        if (token !== mermaidRenderToken) return;

        const svg = freshDiv.querySelector("svg");
        if (svg) {
          styleMermaidSvg(svg);
          entry.svgCache[theme] = entry.canvas.innerHTML;
          entry.renderedTheme = theme;
        }
      } catch (err) {
        if (token !== mermaidRenderToken) return;
        console.error("Mermaid render error:", err);
        entry.canvas.innerHTML =
          '<div class="mermaid-error">Diagram rendering error: ' +
          escapeHtml(err.message || String(err)) +
          "\n\n" +
          escapeHtml(entry.source) +
          "</div>";
      }

      // Yield briefly to keep mobile scrolling and taps responsive between diagrams
      await new Promise(function (r) {
        setTimeout(r, 0);
      });
    });

    return mermaidQueue;
  }

  function scheduleMermaidDiagrams(mermaidEntries, token, theme) {
    disconnectMermaidObserver();
    if (!mermaidEntries.length) return;

    const pendingEntries = mermaidEntries.filter(function (entry) {
      if (entry.renderedTheme === theme && entry.canvas.querySelector("svg")) return false;
      if (applyCachedMermaidSvg(entry, theme)) return false;
      return true;
    });

    if (!pendingEntries.length) return;

    if (!("IntersectionObserver" in window)) {
      pendingEntries.forEach(function (entry) {
        queueMermaidEntryRender(entry, token, theme);
      });
      return;
    }

    const entryMap = new WeakMap();
    mermaidObserver = new IntersectionObserver(
      function (items) {
        items.forEach(function (item) {
          if (!item.isIntersecting) return;
          const entry = entryMap.get(item.target);
          if (!entry) return;
          if (mermaidObserver) mermaidObserver.unobserve(item.target);
          queueMermaidEntryRender(entry, token, theme);
        });
      },
      { rootMargin: "320px 0px" }
    );

    pendingEntries.forEach(function (entry) {
      if (isElementNearViewport(entry.card, 320)) {
        queueMermaidEntryRender(entry, token, theme);
      } else {
        entryMap.set(entry.card, entry);
        mermaidObserver.observe(entry.card);
      }
    });
  }

  function highlightAndWrapCodeBlocks() {
    markdownContent.querySelectorAll("pre").forEach(function (pre) {
      if (pre.parentElement.classList.contains("code-block-container")) return;

      const codeEl = pre.querySelector("code");
      let langLabel = "Code";

      if (codeEl) {
        const langClass = Array.from(codeEl.classList).find(function (c) {
          return c.startsWith("language-");
        });
        if (langClass) {
          const rawLang = langClass.replace("language-", "");
          const friendlyNames = {
            sql: "T-SQL / SQL",
            cs: "C#",
            csharp: "C#",
            js: "JavaScript",
            json: "JSON",
            html: "HTML",
            css: "CSS",
            text: "Plain Text",
            bash: "Shell"
          };
          langLabel = friendlyNames[rawLang.toLowerCase()] || rawLang.toUpperCase();
        }

        if (window.hljs) {
          hljs.highlightElement(codeEl);
        }
      }

      const container = document.createElement("div");
      container.className = "code-block-container";

      const header = document.createElement("div");
      header.className = "code-block-header";
      header.innerHTML =
        '<span class="code-block-lang"><i class="fas fa-terminal"></i> ' +
        escapeHtml(langLabel) +
        "</span>" +
        '<button type="button" class="copy-code-btn" aria-label="Copy code">' +
        '<i class="far fa-copy"></i> <span>Copy</span></button>';

      pre.parentNode.insertBefore(container, pre);
      container.appendChild(header);
      container.appendChild(pre);

      const copyBtn = header.querySelector(".copy-code-btn");
      copyBtn.addEventListener("click", function () {
        const text = codeEl ? codeEl.textContent : pre.textContent;
        copyTextToClipboard(text, copyBtn, '<i class="far fa-copy"></i> <span>Copy</span>');
      });
    });
  }

  function copyTextToClipboard(text, btn, resetHtml) {
    if (!navigator.clipboard) return;
    navigator.clipboard
      .writeText(text)
      .then(function () {
        btn.classList.add("copied");
        btn.innerHTML = '<i class="fas fa-check"></i> <span>Copied</span>';
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.innerHTML = resetHtml;
        }, 1800);
      })
      .catch(function (err) {
        console.error("Clipboard copy failed:", err);
      });
  }

  // ── Right TOC & Scroll-Spy ──
  function buildTocAndAnchors() {
    const headings = markdownContent.querySelectorAll("h2, h3");
    tocList.innerHTML = "";
    headingsData = [];

    const usedIds = {};
    headings.forEach(function (heading) {
      const rawText = heading.textContent.trim();
      let id = slugify(rawText) || "section";
      if (usedIds[id]) {
        usedIds[id]++;
        id = id + "-" + usedIds[id];
      } else {
        usedIds[id] = 1;
      }
      heading.id = id;

      const anchor = document.createElement("a");
      anchor.className = "heading-anchor";
      anchor.href = "#" + currentRoute + "@" + encodeURIComponent(id);
      anchor.textContent = "#";
      anchor.title = "Copy link to section";
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        scrollToHeading(id, true);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).catch(function () {});
        }
      });
      heading.appendChild(anchor);

      headingsData.push({ id: id, element: heading });

      const li = document.createElement("li");
      li.className = "toc-item";

      const a = document.createElement("a");
      a.href = "#" + currentRoute + "@" + encodeURIComponent(id);
      a.className = "toc-link toc-" + heading.tagName.toLowerCase();
      a.dataset.headingId = id;
      a.textContent = rawText;
      a.title = rawText;

      a.addEventListener("click", function (e) {
        e.preventDefault();
        scrollToHeading(id, true);
        if (window.innerWidth < 1280) {
          closeAllDrawers();
        }
      });

      li.appendChild(a);
      tocList.appendChild(li);
    });

    tocCount.textContent = String(headingsData.length);
    if (headingsData.length === 0) {
      const emptyLi = document.createElement("li");
      emptyLi.className = "toc-empty";
      emptyLi.textContent = "No sub-sections";
      tocList.appendChild(emptyLi);
    }
  }

  function scrollToHeading(id, pushHash) {
    const target = document.getElementById(id);
    if (!target) return;

    const headerOffset = 80;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });

    if (pushHash) {
      history.replaceState(null, "", "#" + currentRoute + "@" + encodeURIComponent(id));
    }
  }

  function scrollSpy() {
    if (!headingsData.length) return;
    const scrollPos = window.scrollY + 100;
    let active = headingsData[0];

    for (let i = 0; i < headingsData.length; i++) {
      if (scrollPos >= headingsData[i].element.offsetTop) {
        active = headingsData[i];
      } else {
        break;
      }
    }

    if (active && active.id !== currentActiveHeadingId) {
      currentActiveHeadingId = active.id;
      tocList.querySelectorAll(".toc-link").forEach(function (link) {
        const isMatch = link.dataset.headingId === active.id;
        link.classList.toggle("active", isMatch);

        if (isMatch && !isTocHovered) {
          const linkTop = link.offsetTop;
          const viewHeight = tocScrollArea.clientHeight;
          const scrollTop = tocScrollArea.scrollTop;
          if (linkTop < scrollTop || linkTop > scrollTop + viewHeight - 40) {
            tocScrollArea.scrollTo({
              top: Math.max(0, linkTop - viewHeight / 2),
              behavior: "smooth"
            });
          }
        }
      });
    }
  }

  // ── Prev / Next Pagination ──
  function renderPagination(pageEntry) {
    const idx = flatPages.findIndex(function (p) {
      return p.route === pageEntry.route;
    });
    const prev = idx > 0 ? flatPages[idx - 1] : null;
    const next = idx >= 0 && idx < flatPages.length - 1 ? flatPages[idx + 1] : null;

    docPagination.innerHTML = "";
    if (!prev && !next) {
      docPagination.style.display = "none";
      return;
    }

    docPagination.style.display = "grid";

    if (prev) {
      const a = document.createElement("a");
      a.href = "#" + prev.route;
      a.className = "pagination-card prev";
      a.innerHTML =
        '<span class="pagination-dir"><i class="fas fa-arrow-left"></i> Previous</span>' +
        '<span class="pagination-title">' + escapeHtml(prev.title) + "</span>" +
        '<span class="pagination-group">' + escapeHtml(prev.groupTitle) + "</span>";
      docPagination.appendChild(a);
    }

    if (next) {
      const a = document.createElement("a");
      a.href = "#" + next.route;
      a.className = "pagination-card next";
      a.innerHTML =
        '<span class="pagination-dir">Next <i class="fas fa-arrow-right"></i></span>' +
        '<span class="pagination-title">' + escapeHtml(next.title) + "</span>" +
        '<span class="pagination-group">' + escapeHtml(next.groupTitle) + "</span>";
      docPagination.appendChild(a);
    }
  }

  // ── Event Listeners ──
  function bindEvents() {
    mobileNavBtn.addEventListener("click", toggleNavDrawer);
    mobileTocBtn.addEventListener("click", toggleTocDrawer);
    drawerOverlay.addEventListener("click", closeAllDrawers);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", function () {
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(nextTheme, true);
      });
    }

    searchTriggerBtn.addEventListener("click", function () {
      if (window.innerWidth < 1024 && !navSidebar.classList.contains("open")) {
        toggleNavDrawer();
      }
      setTimeout(function () {
        navSearchInput.focus();
        navSearchInput.select();
      }, 60);
    });

    navSearchInput.addEventListener("input", function (e) {
      const val = e.target.value;
      clearNavSearchBtn.style.display = val ? "block" : "none";
      renderNavTree(val);
    });

    clearNavSearchBtn.addEventListener("click", function () {
      navSearchInput.value = "";
      clearNavSearchBtn.style.display = "none";
      renderNavTree("");
      navSearchInput.focus();
    });

    tocSidebar.addEventListener("mouseenter", function () {
      isTocHovered = true;
    });
    tocSidebar.addEventListener("mouseleave", function () {
      isTocHovered = false;
    });

    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    copyPageLinkBtn.addEventListener("click", function () {
      copyTextToClipboard(
        window.location.href,
        copyPageLinkBtn,
        '<i class="fas fa-link"></i> <span>Copy link</span>'
      );
    });

    // Lightbox Controls
    closeLightboxBtn.addEventListener("click", closeLightbox);
    diagramLightbox.addEventListener("click", function (e) {
      if (e.target === diagramLightbox || e.target.id === "diagramLightboxStage") {
        closeLightbox();
      }
    });
    zoomInBtn.addEventListener("click", function () {
      lightboxZoom = Math.min(2.5, +(lightboxZoom + 0.2).toFixed(2));
      applyLightboxZoom();
    });
    zoomOutBtn.addEventListener("click", function () {
      lightboxZoom = Math.max(0.5, +(lightboxZoom - 0.2).toFixed(2));
      applyLightboxZoom();
    });
    zoomResetBtn.addEventListener("click", function () {
      lightboxZoom = 1;
      applyLightboxZoom();
    });

    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchTriggerBtn.click();
      } else if (
        e.key === "/" &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchTriggerBtn.click();
      } else if (e.key === "Escape") {
        if (diagramLightbox.classList.contains("open")) {
          closeLightbox();
        } else {
          closeAllDrawers();
        }
      }
    });

    window.addEventListener("scroll", function () {
      scrollTopBtn.classList.toggle("visible", window.scrollY > 320);
      scrollSpy();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1280) {
        closeAllDrawers();
      }
    });

    window.addEventListener("hashchange", function () {
      if (!manifest) return;
      const parsed = parseHash();
      if (parsed.route !== currentRoute) {
        loadPage(parsed.route, parsed.heading);
      } else if (parsed.heading) {
        scrollToHeading(parsed.heading, false);
      }
    });
  }

  // ── Bootstrap ──
  async function init() {
    bindEvents();
    applyTheme(currentTheme, false);
    showLoading(true);

    try {
      const res = await fetch("docs-manifest.json", { cache: "no-cache" });
      if (!res.ok) {
        throw new Error("HTTP " + res.status + " while fetching docs-manifest.json");
      }
      manifest = await res.json();

      flatPages = [];
      (manifest.groups || []).forEach(function (group) {
        (group.pages || []).forEach(function (page) {
          flatPages.push({
            route: group.id + "/" + page.id,
            groupId: group.id,
            groupTitle: group.title,
            id: page.id,
            title: page.title,
            file: page.file,
            summary: page.summary || ""
          });
        });
      });

      const defaultRoute = manifest.defaultPage || (flatPages[0] && flatPages[0].route) || "";
      if (brandHomeLink && defaultRoute) {
        brandHomeLink.setAttribute("href", "#" + defaultRoute);
      }

      renderNavTree("");

      const initial = parseHash();
      const matchedInitial = findPageByRoute(initial.route);
      const targetRoute = matchedInitial ? matchedInitial.route : defaultRoute;
      if (initial.route && !matchedInitial && targetRoute) {
        history.replaceState(null, "", "#" + targetRoute);
      }
      await loadPage(targetRoute, matchedInitial ? initial.heading : "");
    } catch (err) {
      console.error("Failed to initialize documentation portal:", err);
      showError(
        "Failed to initialize documentation portal",
        "Could not load docs-manifest.json. " + err.message,
        buildFileCorsTip()
      );
      showLoading(false);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
