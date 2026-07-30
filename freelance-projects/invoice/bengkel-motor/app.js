/**
 * ==============================================================================
 * BENGKEL MOTOR A5 POS SYSTEM - MAIN APPLICATION LOGIC
 * ==============================================================================
 */

// DEFAULT USER GOOGLE APPS SCRIPT WEB APP URL
const DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbxLs7YFICTbJnc0l2wJDMega9H_GTrR_mv12C0B4IjjYfocoSwg6DbkT25FRayiUtSj/exec';

// PRESET MASTER DATA (JASA & SPAREPART FALLBACK)
const DEFAULT_MASTER_ITEMS = [
  { nama: "Servis Ringan + Tune Up Injeksi", harga: 85000 },
  { nama: "Servis CVT Matic + Grease", harga: 45000 },
  { nama: "Ganti Oli Mesin + Jasa", harga: 15000 },
  { nama: "Bongkar & Bersihkan Karburator", harga: 40000 },
  { nama: "Oli Mesin Shell Advance AX7 10W-40 0.8L", harga: 55000 },
  { nama: "Oli Gardan Honda Genuine 120ml", harga: 18000 },
  { nama: "Kampas Rem Vario (Depan & Belakang)", harga: 60000 },
  { nama: "Kampas Rem Depan NMAX Original", harga: 75000 },
  { nama: "Busi NGK CPR9EA-9", harga: 25000 },
  { nama: "Roller CVT Set / Slider", harga: 15000 },
  { nama: "V-Belt Set Honda Genuine Vario 125", harga: 135000 },
  { nama: "Aki Motor Yuasa YTZ6V Dry", harga: 245000 }
];

// STATE APP
let masterItems = JSON.parse(localStorage.getItem('master_items')) || DEFAULT_MASTER_ITEMS;
let apiUrl = localStorage.getItem('google_script_api_url') || DEFAULT_API_URL;

// TRANSFORM CANVAS STATE (ZOOM & PAN)
let zoomScale = 1.0;
let panX = 0;
let panY = 0;
let isFitBothMode = true;

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initFormValues();
  setupEventListeners();
  addSampleRows();
  updateCalculations();
  updateApiStatusUI();
  setupDragToPan();
  
  setTimeout(() => {
    calculateFitBoth();
  }, 100);

  if (apiUrl) {
    fetchMasterDataFromSheets();
  }
});

// SETUP FORM DEFAULTS
function initFormValues() {
  // Generate Struk No
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNo = Math.floor(100 + Math.random() * 900);
  document.getElementById('no_struk').value = `STR/${dateStr}/${randomNo}`;
  
  // Set Current Date Time Local
  const localDatetime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
  document.getElementById('tanggal').value = localDatetime;

  // Sample Customer Defaults
  document.getElementById('pelanggan').value = "Bpk. Budi Santoso";
  document.getElementById('no_hp').value = "0819-8765-4321";
  document.getElementById('nopol').value = "B 3456 TKG";
  document.getElementById('motor').value = "Honda Vario 125 (2021)";
  document.getElementById('odometer').value = "24,150 Km";
  document.getElementById('mekanik').value = "Mas Agus";
}

// DEFAULT 9 EMPTY ROWS
function addSampleRows() {
  const tbody = document.getElementById('item-rows');
  tbody.innerHTML = '';
  
  for (let i = 1; i <= 9; i++) {
    createRowItem(i, '', 1, 0);
  }
  
  document.getElementById('bayar').value = 0;
}

// CREATE ROW ITEM IN TABLE
function createRowItem(no, desc = '', qty = 1, harga = 0) {
  const tbody = document.getElementById('item-rows');
  const rowCount = tbody.children.length + 1;
  const rowNo = no || rowCount;

  const tr = document.createElement('tr');
  tr.className = 'item-row';
  
  // Datalist options
  let datalistOptions = masterItems.map(m => `<option value="${m.nama}">`).join('');

  tr.innerHTML = `
    <td class="text-center row-no">${rowNo}</td>
    <td>
      <input type="text" class="form-control item-desc" list="master-list" value="${desc}" placeholder="Ketik/Pilih Item..." required>
      <datalist id="master-list">${datalistOptions}</datalist>
    </td>
    <td>
      <input type="number" class="form-control item-qty text-center" value="${qty}" min="1" required>
    </td>
    <td>
      <input type="number" class="form-control item-harga text-right" value="${harga}" min="0" required>
    </td>
    <td class="text-right item-total font-mono font-bold">
      Rp ${formatNumber(qty * harga)}
    </td>
    <td class="text-center">
      <button type="button" class="btn-icon btn-remove-row text-danger" title="Hapus Baris">
        <i class="ri-delete-bin-line"></i>
      </button>
    </td>
  `;

  tbody.appendChild(tr);

  // Attach Event Listeners to row inputs
  const descInput = tr.querySelector('.item-desc');
  const qtyInput = tr.querySelector('.item-qty');
  const hargaInput = tr.querySelector('.item-harga');
  const removeBtn = tr.querySelector('.btn-remove-row');

  // Auto-fill price when selecting from master list
  descInput.addEventListener('input', (e) => {
    const found = masterItems.find(m => m.nama.toLowerCase() === e.target.value.toLowerCase());
    if (found) {
      hargaInput.value = found.harga;
    }
    updateRowCalculations(tr);
  });

  qtyInput.addEventListener('input', () => updateRowCalculations(tr));
  hargaInput.addEventListener('input', () => updateRowCalculations(tr));

  removeBtn.addEventListener('click', () => {
    if (tbody.children.length > 1) {
      tr.remove();
      reindexRowNumbers();
      updateCalculations();
    } else {
      alert("Minimal harus ada 1 baris item!");
    }
  });

  updateRowCalculations(tr);
}

// REINDEX ROW NUMBERS
function reindexRowNumbers() {
  const rows = document.querySelectorAll('#item-rows tr');
  rows.forEach((tr, index) => {
    tr.querySelector('.row-no').innerText = index + 1;
  });
}

// ROW CALCULATION
function updateRowCalculations(tr) {
  const qty = parseFloat(tr.querySelector('.item-qty').value) || 0;
  const harga = parseFloat(tr.querySelector('.item-harga').value) || 0;
  const total = qty * harga;

  tr.querySelector('.item-total').innerText = `Rp ${formatNumber(total)}`;
  updateCalculations();
}

// OVERALL CALCULATIONS & RENDER PREVIEW
function updateCalculations() {
  let grandTotal = 0;
  const rows = document.querySelectorAll('#item-rows tr');

  rows.forEach(tr => {
    const qty = parseFloat(tr.querySelector('.item-qty').value) || 0;
    const harga = parseFloat(tr.querySelector('.item-harga').value) || 0;
    grandTotal += (qty * harga);
  });

  const bayar = parseFloat(document.getElementById('bayar').value) || 0;
  const kembali = bayar - grandTotal;

  document.getElementById('txt-grand-total').innerText = `Rp ${formatNumber(grandTotal)}`;
  document.getElementById('txt-kembali').innerText = `Rp ${formatNumber(Math.max(0, kembali))}`;

  renderStrukPreview();

  if (isFitBothMode) {
    calculateFitBoth();
  }
}

// RENDER OPTIMIZED DYNAMIC MULTI-PAGE STRUK A5 PREVIEW (PAGE 1: 13 ITEMS, PAGE 2+: 19 ITEMS FULL FILL)
function renderStrukPreview() {
  const noStruk = document.getElementById('no_struk').value;
  const tanggalInput = document.getElementById('tanggal').value;
  const formattedDate = tanggalInput ? new Date(tanggalInput).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-';
  const pelanggan = document.getElementById('pelanggan').value || '-';
  const noHp = document.getElementById('no_hp').value || '-';
  const nopol = document.getElementById('nopol').value.toUpperCase() || '-';
  const motor = document.getElementById('motor').value || '-';
  const odometer = document.getElementById('odometer').value || '-';
  const mekanik = document.getElementById('mekanik').value || '-';
  const catatan = document.getElementById('catatan').value;

  const rows = document.querySelectorAll('#item-rows tr');
  const items = [];
  let grandTotal = 0;

  rows.forEach((tr, idx) => {
    const desc = tr.querySelector('.item-desc').value || '-';
    const qty = parseFloat(tr.querySelector('.item-qty').value) || 0;
    const harga = parseFloat(tr.querySelector('.item-harga').value) || 0;
    const total = qty * harga;
    grandTotal += total;

    items.push({ no: idx + 1, desc, qty, harga, total });
  });

  const bayar = parseFloat(document.getElementById('bayar').value) || 0;
  const kembali = Math.max(0, bayar - grandTotal);

  // PAD TO MINIMUM 10 ROWS: always show at least 10 baris in preview & print
  const MIN_ROWS = 9;
  while (items.length < MIN_ROWS) {
    items.push({ no: items.length + 1, desc: '', qty: '', harga: '', total: '' });
  }

  // DYNAMIC CAPACITY CALCULATION:
  // - 1 Page Total: 7 items (with shop header, info grid, & full footer)
  // - Page 1 of Multi-page: 13 items (with shop header & info grid, fills 100% to bottom)
  // - Intermediate Pages (Page 2, 3, etc.): 19 items (NO shop header, NO info grid, fills 100% to bottom!)
  // - Final Page of Multi-page: 13 items (NO shop header, NO info grid, with full footer!)

  let remaining = [...items];
  let pagesItems = [];
  let pageIndex = 0;

  while (remaining.length > 0) {
    let capacity;
    if (pageIndex === 0) {
      if (items.length <= 7) {
        capacity = 7;
      } else {
        capacity = 13;
      }
    } else {
      // Continuation pages (Page 2, 3, etc.)
      if (remaining.length <= 13) {
        capacity = 13; // Final page fits 13 items + full footer
      } else {
        capacity = 19; // Intermediate page fits 19 items, filling ALL THE WAY DOWN!
      }
    }

    pagesItems.push(remaining.splice(0, capacity));
    pageIndex++;
  }

  const totalPages = pagesItems.length;
  let pagesHtml = '';

  for (let p = 0; p < totalPages; p++) {
    const pageItems = pagesItems[p];
    const isFirstPage = (p === 0);
    const isLastPage = (p === totalPages - 1);

    let rowsHtml = '';
    pageItems.forEach(item => {
      const isEmptyRow = item.qty === '' && item.harga === '' && item.total === '';
      rowsHtml += `
        <tr>
          <td style="text-align: center; width: 5%;">${item.no}</td>
          <td style="width: 50%;">${escapeHtml(item.desc)}</td>
          <td style="text-align: center; width: 8%;">${isEmptyRow ? '' : item.qty}</td>
          <td style="text-align: right; width: 18%;">${isEmptyRow ? '' : formatNumber(item.harga)}</td>
          <td style="text-align: right; width: 19%;">${isEmptyRow ? '' : formatNumber(item.total)}</td>
        </tr>
      `;
    });

    // TOP SECTION: Page 1 has Shop Header + Info Grid. Page 2+ has minimal continuation line!
    const topSectionHtml = isFirstPage ? `
      <div class="struk-header">
        <h2>BENGKEL MOTOR "MAJU JAYA"${totalPages > 1 ? ' <span style="font-size: 11px; font-weight: normal;">(Hal 1/' + totalPages + ')</span>' : ''}</h2>
        <p>Jl. Raya Otomotif No. 88, Jakarta | WA: 0812-3456-7890</p>
        <p>Spesialis Injeksi, Matic & Tune Up</p>
      </div>

      <div class="struk-info-grid">
        <div class="struk-info-col">
          <div><span class="lbl">No. Struk</span>: ${escapeHtml(noStruk)}</div>
          <div><span class="lbl">Pelanggan</span>: ${escapeHtml(pelanggan)}</div>
          <div><span class="lbl">No. HP</span>: ${escapeHtml(noHp)}</div>
          <div><span class="lbl">Mekanik</span>: ${escapeHtml(mekanik)}</div>
        </div>
        <div class="struk-info-col">
          <div><span class="lbl">Tanggal / Jam</span>: ${formattedDate}</div>
          <div><span class="lbl">No. Polisi</span>: ${escapeHtml(nopol)}</div>
          <div><span class="lbl">Motor / Type</span>: ${escapeHtml(motor)}</div>
          <div><span class="lbl">Odometer</span>: ${escapeHtml(odometer)}</div>
        </div>
      </div>
    ` : `
      <!-- CONTINUATION PAGE HEADER -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #000; padding-bottom: 4px; margin-bottom: 6px; font-size: 10px; font-weight: bold;">
        <span>SAMBUNGAN STRUK: ${escapeHtml(noStruk)} (${escapeHtml(pelanggan)} - ${escapeHtml(nopol)})</span>
        <span>Halaman ${p + 1}/${totalPages}</span>
      </div>
    `;

    // BOTTOM FOOTER SECTION
    const bottomSectionHtml = isLastPage ? `
      <div class="struk-footer-wrapper">
        <div class="struk-footer-grid">
          <div class="struk-notes">
            <strong>Catatan / Garansi Servis:</strong><br>
            ${escapeHtml(catatan).replace(/\n/g, '<br>')}
          </div>
          <div>
            <table class="struk-totals-table">
              <tr>
                <td><strong>TOTAL</strong></td>
                <td style="text-align: right;"><strong>: Rp ${formatNumber(grandTotal)}</strong></td>
              </tr>
              <tr>
                <td>Bayar</td>
                <td style="text-align: right;">: Rp ${formatNumber(bayar)}</td>
              </tr>
              <tr>
                <td>Kembali</td>
                <td style="text-align: right;">: Rp ${formatNumber(kembali)}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="struk-signatures">
          <div class="struk-sign-box">
            <div>Hormat Kami,</div>
            <div>( Kasir / Bengkel )</div>
          </div>
          <div class="struk-sign-box">
            <div>Pelanggan / Consignee,</div>
            <div>( ${escapeHtml(pelanggan)} )</div>
          </div>
        </div>

        <div class="struk-greeting">
          "Terima Kasih Atas Kunjungan Anda - Keselamatan Anda Adalah Prioritas Kami"
        </div>
      </div>
    ` : `
      <div class="struk-footer-wrapper">
        <div style="text-align: right; font-style: italic; font-size: 10px; border-top: 1px dashed #000; padding-top: 4px;">
          *** Bersambung ke Halaman ${p + 2} ***
        </div>
      </div>
    `;

    pagesHtml += `
      <div class="struk-a5-container">
        <div class="struk-body-top">
          ${topSectionHtml}

          <table class="struk-table">
            <thead>
              <tr>
                <th>NO</th>
                <th>DESKRIPSI JASA / SPAREPART</th>
                <th>QTY</th>
                <th>HARGA (RP)</th>
                <th>TOTAL (RP)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        ${bottomSectionHtml}
      </div>
    `;
  }

  const previewContainer = document.getElementById('print-area-preview');
  if (previewContainer) {
    previewContainer.innerHTML = pagesHtml;
  }
  document.getElementById('print-area').innerHTML = pagesHtml;
}

// TRANSFORM CANVAS FUNCTIONS (FIT BOTH WIDTH & HEIGHT, ZOOM TO CURSOR & PANNING)
function applyTransform() {
  const wrapper = document.getElementById('preview-wrapper');
  if (wrapper) {
    wrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
  }
  const badge = document.getElementById('txt-zoom-level');
  if (badge) {
    badge.innerText = Math.round(zoomScale * 100) + "%";
  }
}

// FIT BOTH WIDTH AND HEIGHT DYNAMICALLY TO FILL THE VIEWPORT BOX
function calculateFitBoth() {
  const viewport = document.getElementById('preview-viewport');
  const printAreaPreview = document.getElementById('print-area-preview');
  if (!viewport || !printAreaPreview) return;

  const contentWidth = printAreaPreview.scrollWidth || 794;
  const contentHeight = printAreaPreview.scrollHeight || 559;

  const availWidth = viewport.clientWidth - 32;
  const availHeight = viewport.clientHeight - 32;

  const scaleX = availWidth / contentWidth;
  const scaleY = availHeight / contentHeight;

  let fitScale = Math.min(scaleX, scaleY);
  fitScale = Math.max(0.15, Math.min(fitScale, 1.5));

  if (isFitBothMode) {
    zoomScale = fitScale;
    panX = 0;
    panY = 0;
    applyTransform();
  }
}

function zoomAtPoint(delta, clientX, clientY) {
  const viewport = document.getElementById('preview-viewport');
  if (!viewport) return;

  const oldScale = zoomScale;
  let newScale;

  if (delta > 0) {
    newScale = Math.min(2.5, oldScale + 0.1);
  } else {
    newScale = Math.max(0.15, oldScale - 0.1);
  }

  if (newScale === oldScale) return;

  isFitBothMode = false;

  const rect = viewport.getBoundingClientRect();
  const mouseX = clientX !== undefined ? clientX - rect.left - rect.width / 2 : 0;
  const mouseY = clientY !== undefined ? clientY - rect.top - rect.height / 2 : 0;

  const scaleRatio = newScale / oldScale;
  panX = mouseX - (mouseX - panX) * scaleRatio;
  panY = mouseY - (mouseY - panY) * scaleRatio;

  zoomScale = newScale;
  applyTransform();
}

function zoomIn() {
  zoomAtPoint(1);
}

function zoomOut() {
  zoomAtPoint(-1);
}

function resetZoomFitBoth() {
  isFitBothMode = true;
  calculateFitBoth();
}

// HOLD CLICK & DRAG TO PAN PREVIEW CANVAS
function setupDragToPan() {
  const viewport = document.getElementById('preview-viewport');
  if (!viewport) return;

  let isMouseDown = false;
  let startMouseX = 0;
  let startMouseY = 0;
  let startPanX = 0;
  let startPanY = 0;

  viewport.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    viewport.style.cursor = 'grabbing';
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startPanX = panX;
    startPanY = panY;
  });

  window.addEventListener('mouseup', () => {
    if (isMouseDown) {
      isMouseDown = false;
      viewport.style.cursor = 'grab';
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    isFitBothMode = false;
    panX = startPanX + (e.clientX - startMouseX);
    panY = startPanY + (e.clientY - startMouseY);
    applyTransform();
  });
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
  document.getElementById('btn-add-item').addEventListener('click', () => {
    createRowItem();
  });

  document.getElementById('bayar').addEventListener('input', updateCalculations);
  
  // Input fields changes update preview
  const inputs = ['no_struk', 'tanggal', 'pelanggan', 'no_hp', 'nopol', 'motor', 'odometer', 'mekanik', 'catatan'];
  inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', updateCalculations);
  });

  // Print button
  document.getElementById('btn-print').addEventListener('click', () => {
    window.print();
  });

  // Save to Google Sheets
  document.getElementById('btn-save-sheets').addEventListener('click', saveToGoogleSheets);

  // Config API Modal
  document.getElementById('btn-config-api').addEventListener('click', () => {
    document.getElementById('api_url').value = apiUrl;
    document.getElementById('modal-api').classList.remove('hidden');
  });

  document.getElementById('btn-close-modal').addEventListener('click', () => {
    document.getElementById('modal-api').classList.add('hidden');
  });

  document.getElementById('btn-save-api').addEventListener('click', () => {
    apiUrl = document.getElementById('api_url').value.trim();
    localStorage.setItem('google_script_api_url', apiUrl);
    document.getElementById('modal-api').classList.add('hidden');
    updateApiStatusUI();
    if (apiUrl) fetchMasterDataFromSheets();
  });

  // Reset form
  document.getElementById('btn-reset-form').addEventListener('click', () => {
    if (confirm("Reset form transaksi?")) {
      initFormValues();
      addSampleRows();
      updateCalculations();
    }
  });

  // ZOOM CONTROLS
  document.getElementById('btn-zoom-in').addEventListener('click', zoomIn);
  document.getElementById('btn-zoom-out').addEventListener('click', zoomOut);
  document.getElementById('btn-zoom-reset').addEventListener('click', resetZoomFitBoth);

  // MOUSE WHEEL ZOOM TOWARDS CURSOR LOCATION
  const viewport = document.getElementById('preview-viewport');
  if (viewport) {
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      zoomAtPoint(delta, e.clientX, e.clientY);
    }, { passive: false });
  }

  // AUTO FIT (WIDTH & HEIGHT) ON WINDOW RESIZE
  window.addEventListener('resize', () => {
    if (isFitBothMode) calculateFitBoth();
  });
}

// API STATUS BADGE
function updateApiStatusUI() {
  const badge = document.getElementById('status-mode');
  if (apiUrl) {
    badge.innerText = "Mode Online: Google Sheets Connected";
    badge.className = "badge badge-info";
    badge.style.background = "rgba(16, 185, 129, 0.2)";
    badge.style.color = "#34d399";
  } else {
    badge.innerText = "Mode Standalone / Demo";
    badge.className = "badge badge-info";
  }
}

// FETCH MASTER DATA FROM GOOGLE SHEETS
function fetchMasterDataFromSheets() {
  if (!apiUrl) return;

  fetch(apiUrl + '?action=getMaster')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        masterItems = data;
        localStorage.setItem('master_items', JSON.stringify(masterItems));
        console.log("Master items updated from Google Sheets", masterItems);
      }
    })
    .catch(err => console.warn("Fallback to local master items:", err));
}

// SAVE TRANSACTION TO GOOGLE SHEETS
function saveToGoogleSheets() {
  if (!apiUrl) {
    alert("URL Google Sheets API belum diatur! Klik tombol 'Hubungkan Google Sheets' di kanan atas.");
    document.getElementById('modal-api').classList.remove('hidden');
    return;
  }

  const btn = document.getElementById('btn-save-sheets');
  const originalText = btn.innerHTML;
  btn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Menyimpan...`;
  btn.disabled = true;

  const rowsData = [];
  document.querySelectorAll('#item-rows tr').forEach(tr => {
    rowsData.push({
      desc: tr.querySelector('.item-desc').value,
      qty: parseFloat(tr.querySelector('.item-qty').value) || 0,
      harga: parseFloat(tr.querySelector('.item-harga').value) || 0,
      total: (parseFloat(tr.querySelector('.item-qty').value) || 0) * (parseFloat(tr.querySelector('.item-harga').value) || 0)
    });
  });

  const grandTotalText = document.getElementById('txt-grand-total').innerText.replace(/[^\d]/g, '');

  const payload = {
    noStruk: document.getElementById('no_struk').value,
    tanggal: document.getElementById('tanggal').value,
    pelanggan: document.getElementById('pelanggan').value,
    noHp: document.getElementById('no_hp').value,
    nopol: document.getElementById('nopol').value,
    motor: document.getElementById('motor').value,
    odometer: document.getElementById('odometer').value,
    mekanik: document.getElementById('mekanik').value,
    total: parseFloat(grandTotalText),
    bayar: parseFloat(document.getElementById('bayar').value) || 0,
    items: JSON.stringify(rowsData)
  };

  fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(res => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    if (res.status === 'success') {
      alert("Nota berhasil disimpan ke Google Sheets! Menampilkan cetakan...");
      window.print();
    } else {
      alert("Respon Google Sheets: " + (res.message || "Gagal menyimpan"));
    }
  })
  .catch(err => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    alert("Terjadi kesalahan jaringan / CORS. Membuka opsi cetak offline...");
    window.print();
  });
}

// UTILITY FUNCTIONS
function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}
