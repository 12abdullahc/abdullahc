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
let apiUrl = localStorage.getItem('google_script_api_url');
if (apiUrl === null) {
  apiUrl = DEFAULT_API_URL;
}
let isApiConnected = (apiUrl && apiUrl.trim() !== '') ? true : false;

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

// SEQUENTIAL STRUK NUMBER GENERATOR (FORMAT: STR/001, STR/002, STR/009...)
function generateSequentialStrukNo(customCount) {
  let count;
  if (customCount !== undefined && customCount !== null && !isNaN(customCount)) {
    count = parseInt(customCount, 10);
  } else {
    count = parseInt(localStorage.getItem('struk_counter') || '1', 10);
  }
  localStorage.setItem('struk_counter', count);

  const paddedNum = String(count).padStart(3, '0');
  return `STR/${paddedNum}`;
}

function incrementSequentialStrukNo() {
  let currentVal = parseInt(localStorage.getItem('struk_counter') || '1', 10);
  localStorage.setItem('struk_counter', currentVal + 1);
}

// HELPER TO PARSE NUMERIC VALUE FROM FORMATTED BAYAR INPUT (STRIPS DOTS)
function parseBayarValue() {
  const bayarInput = document.getElementById('bayar');
  if (!bayarInput) return 0;
  const rawStr = String(bayarInput.value || '').replace(/\D/g, '');
  return parseFloat(rawStr) || 0;
}

// SETUP FORM DEFAULTS
function initFormValues() {
  // Generate Sequential Struk No
  document.getElementById('no_struk').value = generateSequentialStrukNo();

  // Set Current Date Time Local
  const now = new Date();
  const localDatetime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
  document.getElementById('tanggal').value = localDatetime;

  // Clear 6 fields by default so user can fill them or use placeholders
  document.getElementById('pelanggan').value = "";
  document.getElementById('no_hp').value = "";
  document.getElementById('nopol').value = "";
  document.getElementById('motor').value = "";
  document.getElementById('odometer').value = "";
  document.getElementById('mekanik').value = "";

  // Catatan from localStorage if previously fetched from Google Sheets
  const savedCatatan = localStorage.getItem('master_catatan');
  document.getElementById('catatan').value = savedCatatan !== null && savedCatatan !== undefined ? savedCatatan : "";
}

// DEFAULT 8 EMPTY ROWS
function addSampleRows() {
  const tbody = document.getElementById('item-rows');
  tbody.innerHTML = '';

  for (let i = 1; i <= 8; i++) {
    createRowItem(i, '', 1, 0);
  }

  document.getElementById('bayar').value = '0';
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

// REFRESH ALL DATALISTS WITH LATEST MASTER ITEMS
function refreshAllDataLists() {
  const datalistOptions = masterItems.map(m => `<option value="${m.nama}">`).join('');
  document.querySelectorAll('datalist#master-list').forEach(dl => {
    dl.innerHTML = datalistOptions;
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

  const bayar = parseBayarValue();
  const kembali = bayar - grandTotal;

  document.getElementById('txt-grand-total').innerText = `Rp ${formatNumber(grandTotal)}`;
  const kembaliEl = document.getElementById('txt-kembali');
  kembaliEl.innerText = `Rp ${formatNumber(kembali)}`;
  kembaliEl.style.color = kembali < 0 ? '#ef4444' : '#10b981';

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
    const rawDesc = (tr.querySelector('.item-desc').value || '').trim();
    const qtyVal = tr.querySelector('.item-qty').value;
    const hargaVal = tr.querySelector('.item-harga').value;

    const qty = parseFloat(qtyVal) || 0;
    const harga = parseFloat(hargaVal) || 0;
    const total = qty * harga;

    if (rawDesc !== '' || harga > 0) {
      grandTotal += total;
      items.push({ no: idx + 1, desc: rawDesc, qty: qty, harga: harga, total: total, isEmpty: false });
    } else {
      items.push({ no: idx + 1, desc: '', qty: '', harga: '', total: '', isEmpty: true });
    }
  });

  const bayar = parseBayarValue();
  const kembali = bayar - grandTotal;

  // PAD TO MINIMUM 8 ROWS: always show at least 8 baris in preview & print
  const MIN_ROWS = 8;
  while (items.length < MIN_ROWS) {
    items.push({ no: items.length + 1, desc: '', qty: '', harga: '', total: '', isEmpty: true });
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
      if (item.isEmpty) {
        rowsHtml += `
          <tr>
            <td style="text-align: center; width: 5%;">${item.no}</td>
            <td style="width: 50%;"></td>
            <td style="text-align: center; width: 8%;"></td>
            <td style="text-align: right; width: 18%;"></td>
            <td style="text-align: right; width: 19%;"></td>
          </tr>
        `;
      } else {
        rowsHtml += `
          <tr>
            <td style="text-align: center; width: 5%;">${item.no}</td>
            <td style="width: 50%;">${escapeHtml(item.desc)}</td>
            <td style="text-align: center; width: 8%;">${item.qty}</td>
            <td style="text-align: right; width: 18%;">${formatNumber(item.harga)}</td>
            <td style="text-align: right; width: 19%;">${formatNumber(item.total)}</td>
          </tr>
        `;
      }
    });

    // TOP SECTION: Page 1 has Shop Header + Info Grid. Page 2+ has minimal continuation line!
    const topSectionHtml = isFirstPage ? `
      <div class="struk-header">
        <img src="img/image.png" class="struk-logo" alt="SP 76 Motor Logo">
        <div class="struk-header-content">
          <h2>SP 76 Motor - Motorcycle repairs shop${totalPages > 1 ? ' <span style="font-size: 11px; font-weight: normal;">(Hal 1/' + totalPages + ')</span>' : ''}</h2>
          <p>Jl. Raya Cimareme No.204, Cimareme, Kec. Ngamprah, Kabupaten Bandung Barat, Jawa Barat 40552</p>
        </div>
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
        <table class="struk-footer-table" style="width: 100%; border-collapse: collapse; border-bottom: 1px solid #000; padding-bottom: 6px; margin-bottom: 2px;">
          <tr>
            <td rowspan="3" style="width: 63%; vertical-align: top; padding-right: 12px;" class="struk-notes">
              <strong>Catatan:</strong><br>
              ${escapeHtml(catatan).replace(/\n/g, '<br>')}
            </td>
            <td style="width: 18%; vertical-align: middle; font-weight: bold; font-size: 10.5px; padding: 2px 0;">TOTAL</td>
            <td style="width: 19%; vertical-align: middle; font-weight: bold; font-size: 10.5px; padding: 2px 4px;"><div style="display: flex; justify-content: space-between;"><span>: Rp</span><span>${formatNumber(grandTotal)}</span></div></td>
          </tr>
          <tr>
            <td style="width: 18%; vertical-align: middle; font-size: 10.5px; padding: 2px 0;">Bayar</td>
            <td style="width: 19%; vertical-align: middle; font-size: 10.5px; padding: 2px 4px;"><div style="display: flex; justify-content: space-between;"><span>: Rp</span><span>${formatNumber(bayar)}</span></div></td>
          </tr>
          <tr>
            <td style="width: 18%; vertical-align: middle; font-size: 10.5px; padding: 2px 0;">Kembali</td>
            <td style="width: 19%; vertical-align: middle; font-size: 10.5px; padding: 2px 4px;"><div style="display: flex; justify-content: space-between;"><span>: Rp</span><span>${formatNumber(kembali)}</span></div></td>
          </tr>
        </table>

        <div class="struk-signatures">
          <div class="struk-sign-box">
            <div>Hormat Kami,</div>
            <div>( Kasir / Bengkel )</div>
          </div>
          <div class="struk-sign-box">
            <div>Pelanggan,</div>
            <div>( ${escapeHtml(pelanggan)} )</div>
          </div>
        </div>

        <div class="struk-greeting">
          "Terima kasih atas kunjungan Anda"
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

  const bayarEl = document.getElementById('bayar');
  bayarEl.addEventListener('input', (e) => {
    let rawStr = e.target.value.replace(/\D/g, '');
    if (!rawStr) {
      e.target.value = '';
    } else {
      let num = parseInt(rawStr, 10);
      e.target.value = formatNumber(num);
    }
    updateCalculations();
  });

  const odometerEl = document.getElementById('odometer');

  odometerEl.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
      const selStart = odometerEl.selectionStart;
      const selEnd = odometerEl.selectionEnd;

      // If user highlighted text, let standard delete happen
      if (selStart !== selEnd) {
        return;
      }

      // Deleting last digit when pressing Backspace
      e.preventDefault();
      let rawStr = odometerEl.value.replace(/\D/g, '');
      if (rawStr.length > 0) {
        let newRaw = rawStr.slice(0, -1);
        if (!newRaw) {
          odometerEl.value = '';
        } else {
          let num = parseInt(newRaw, 10);
          odometerEl.value = formatNumber(num) + ' Km';
        }
        updateCalculations();
      }
    }
  });

  odometerEl.addEventListener('input', () => {
    let rawStr = odometerEl.value.replace(/\D/g, '');
    if (!rawStr) {
      odometerEl.value = '';
    } else {
      let num = parseInt(rawStr, 10);
      odometerEl.value = formatNumber(num) + ' Km';
    }
    updateCalculations();
  });

  // Input fields changes update preview
  const inputs = ['no_struk', 'tanggal', 'pelanggan', 'no_hp', 'nopol', 'motor', 'mekanik', 'catatan'];
  inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', updateCalculations);
  });

  // Admin button password protection using custom password modal (password: 1111)
  const btnAdmin = document.getElementById('btn-admin-link');
  const modalAuth = document.getElementById('modal-auth-admin');
  const inputAuthPass = document.getElementById('admin-password-input');
  const errorAuthMsg = document.getElementById('auth-error-msg');
  const btnSubmitAuth = document.getElementById('btn-submit-auth');
  const btnCancelAuth = document.getElementById('btn-cancel-auth');
  const btnCloseAuth = document.getElementById('btn-close-auth-modal');

  const closeAuthModal = () => {
    if (modalAuth) modalAuth.classList.add('hidden');
    if (inputAuthPass) inputAuthPass.value = '';
  };

  const verifyAndSubmitPass = () => {
    if (!inputAuthPass) return;
    const pass = inputAuthPass.value.trim();
    if (pass === "1111") {
      sessionStorage.setItem('admin_auth', 'true');
      closeAuthModal();
      window.location.href = 'admin.html';
    } else {
      inputAuthPass.value = '';
      inputAuthPass.focus();
    }
  };

  if (btnAdmin && modalAuth) {
    btnAdmin.addEventListener('click', (e) => {
      e.preventDefault();
      closeAuthModal();
      modalAuth.classList.remove('hidden');
      setTimeout(() => { if (inputAuthPass) inputAuthPass.focus(); }, 100);
    });

    if (btnSubmitAuth) btnSubmitAuth.addEventListener('click', verifyAndSubmitPass);
    if (btnCancelAuth) btnCancelAuth.addEventListener('click', closeAuthModal);
    if (btnCloseAuth) btnCloseAuth.addEventListener('click', closeAuthModal);

    if (inputAuthPass) {
      inputAuthPass.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          verifyAndSubmitPass();
        } else if (e.key === 'Escape') {
          closeAuthModal();
        }
      });
    }
  }

  // Print button (automatically saves to Google Sheets, alerts success, then opens print dialog)
  document.getElementById('btn-print').addEventListener('click', saveToGoogleSheets);

  // Config API Modal (if elements present)
  const btnConfigApi = document.getElementById('btn-config-api');
  if (btnConfigApi) {
    btnConfigApi.addEventListener('click', () => {
      const inputEl = document.getElementById('api_url');
      if (inputEl) inputEl.value = apiUrl;
      const modal = document.getElementById('modal-api');
      if (modal) modal.classList.remove('hidden');
    });
  }

  const btnCloseModal = document.getElementById('btn-close-modal');
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      const modal = document.getElementById('modal-api');
      if (modal) modal.classList.add('hidden');
    });
  }

  const btnSaveApi = document.getElementById('btn-save-api');
  if (btnSaveApi) {
    btnSaveApi.addEventListener('click', () => {
      const inputEl = document.getElementById('api_url');
      if (inputEl) apiUrl = inputEl.value.trim();
      localStorage.setItem('google_script_api_url', apiUrl);
      const modal = document.getElementById('modal-api');
      if (modal) modal.classList.add('hidden');
      updateApiStatusUI();
      if (apiUrl) fetchMasterDataFromSheets();
    });
  }

  // Reset form
  const btnReset = document.getElementById('btn-reset-form');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm("Reset form transaksi?")) {
        initFormValues();
        addSampleRows();
        updateCalculations();
      }
    });
  }

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
  if (!badge) return;
  if (apiUrl && apiUrl.trim() !== '' && isApiConnected) {
    badge.innerText = "Mode Online: Google Sheets Connected";
    badge.className = "badge badge-success";
    badge.style.background = "rgba(16, 185, 129, 0.2)";
    badge.style.color = "#34d399";
    badge.style.border = "1px solid #10b981";
  } else {
    badge.innerText = (apiUrl && apiUrl.trim() !== '') ? "Koneksi API Gagal / URL Tidak Valid" : "Belum Terhubung (Google Sheets)";
    badge.className = "badge badge-danger";
    badge.style.background = "rgba(239, 68, 68, 0.2)";
    badge.style.color = "#f87171";
    badge.style.border = "1px solid #ef4444";
  }
}

// FETCH MASTER DATA FROM GOOGLE SHEETS
function fetchMasterDataFromSheets() {
  if (!apiUrl || apiUrl.trim() === '') {
    isApiConnected = false;
    updateApiStatusUI();
    return;
  }

  const cacheBusterUrl = apiUrl + (apiUrl.includes('?') ? '&' : '?') + 'action=getMaster&t=' + Date.now();

  fetch(cacheBusterUrl)
    .then(res => res.json())
    .then(data => {
      console.log("Response from Google Sheets:", data);
      if (data && (Array.isArray(data) || typeof data === 'object')) {
        isApiConnected = true;
        updateApiStatusUI();

        if (Array.isArray(data) && data.length > 0) {
          masterItems = data;
          localStorage.setItem('master_items', JSON.stringify(masterItems));
          refreshAllDataLists();
        } else if (typeof data === 'object') {
          if (Array.isArray(data.items) && data.items.length > 0) {
            masterItems = data.items;
            localStorage.setItem('master_items', JSON.stringify(masterItems));
            refreshAllDataLists();
          }
          if (data.catatan !== undefined && data.catatan !== null) {
            localStorage.setItem('master_catatan', data.catatan);
            document.getElementById('catatan').value = data.catatan;
            updateCalculations();
          }
          if (data.nextCounter) {
            document.getElementById('no_struk').value = generateSequentialStrukNo(data.nextCounter);
            updateCalculations();
          }
        }
      } else {
        isApiConnected = false;
        updateApiStatusUI();
      }
    })
    .catch(err => {
      console.warn("Fallback to local master items:", err);
      isApiConnected = false;
      updateApiStatusUI();
    });
}

// SAVE TRANSACTION TO GOOGLE SHEETS & OPEN PRINT DIALOG
function saveToGoogleSheets() {
  const currentStrukNo = document.getElementById('no_struk').value;

  if (!apiUrl || apiUrl.trim() === '') {
    alert("⚠️ Google Sheets API belum terhubung!\n\nSilakan atur URL Web App Google Apps Script di Halaman Admin terlebih dahulu.");
    return;
  }

  if (!isApiConnected) {
    alert("❌ Koneksi Google Sheets API bermasalah / URL tidak valid!\n\nSilakan periksa kembali URL Web App Anda di Halaman Admin sebelum mencetak.");
    return;
  }

  const btnPrint = document.getElementById('btn-print');

  if (btnPrint) {
    btnPrint.disabled = true;
  }

  const rowsData = [];
  document.querySelectorAll('#item-rows tr').forEach(tr => {
    const desc = tr.querySelector('.item-desc').value.trim();
    const qty = parseFloat(tr.querySelector('.item-qty').value) || 0;
    const harga = parseFloat(tr.querySelector('.item-harga').value) || 0;
    if (desc !== '' || harga > 0) {
      rowsData.push({
        desc: desc,
        qty: qty,
        harga: harga,
        total: qty * harga
      });
    }
  });

  const grandTotalText = document.getElementById('txt-grand-total').innerText.replace(/[^\d]/g, '');

  const payload = {
    noStruk: currentStrukNo,
    tanggal: document.getElementById('tanggal').value,
    pelanggan: document.getElementById('pelanggan').value,
    noHp: document.getElementById('no_hp').value,
    nopol: document.getElementById('nopol').value,
    motor: document.getElementById('motor').value,
    odometer: document.getElementById('odometer').value,
    mekanik: document.getElementById('mekanik').value,
    total: parseFloat(grandTotalText) || 0,
    bayar: parseBayarValue(),
    items: JSON.stringify(rowsData)
  };

  const sendPayloadToBackend = (receiptImageData = '') => {
    payload.receiptImage = receiptImageData;

    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(res => {
        if (btnPrint) {
          btnPrint.disabled = false;
        }

        if (res.status === 'success') {
          isApiConnected = true;
          updateApiStatusUI();
          // Print first with the CURRENT struk number
          window.print();
          // After print dialog closes, update to next struk number for the next transaction
          if (res.nextCounter) {
            document.getElementById('no_struk').value = generateSequentialStrukNo(res.nextCounter);
          } else {
            incrementSequentialStrukNo();
            document.getElementById('no_struk').value = generateSequentialStrukNo();
          }
          updateCalculations();
        } else {
          isApiConnected = false;
          updateApiStatusUI();
          alert("❌ Gagal menyimpan ke Google Sheets: " + (res.message || "Error") + "\n\nCetak struk dibatalkan.");
        }
      })
      .catch(err => {
        if (btnPrint) {
          btnPrint.disabled = false;
        }
        isApiConnected = false;
        updateApiStatusUI();
        alert("❌ Gagal terhubung ke Google Sheets API!\n\nPeriksa kembali URL Web App di Halaman Admin. Cetak struk dibatalkan.");
      });
  };

  const captureTarget = document.querySelector('.struk-a5-container') || document.getElementById('print-area-preview');

  if (window.html2canvas && captureTarget) {
    html2canvas(captureTarget, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      sendPayloadToBackend(imgData);
    }).catch(err => {
      console.warn("Capture preview error:", err);
      sendPayloadToBackend('');
    });
  } else {
    sendPayloadToBackend('');
  }
}

// UTILITY FUNCTIONS
function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}
