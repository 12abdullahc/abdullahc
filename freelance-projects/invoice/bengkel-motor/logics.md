# Spesifikasi & Panduan Aplikasi Web Struk Bengkel Motor A5 (HTML/CSS/JS + Google Sheets API)

Dokumen ini berisi panduan perancangan, struktur file, dan **langkah demi langkah membuat database Google Sheets dari nol** untuk aplikasi Web POS Bengkel Sepeda Motor.

---

## 🔗 URL Web App Google Sheets Aktif

- **Web App API URL**: `https://script.google.com/macros/s/AKfycbxLs7YFICTbJnc0l2wJDMega9H_GTrR_mv12C0B4IjjYfocoSwg6DbkT25FRayiUtSj/exec`
- **Deployment ID**: `AKfycbxLs7YFICTbJnc0l2wJDMega9H_GTrR_mv12C0B4IjjYfocoSwg6DbkT25FRayiUtSj`

---

## 📁 Struktur File Aplikasi Web

- [index.html](file:///c:/Users/dring/source/repos/abdullahc/vba/invoice/bengkel-motor/index.html) : Halaman antarmuka input transaksi, tabel dinamis, dan pratinjau nota A5.
- [style.css](file:///c:/Users/dring/source/repos/abdullahc/vba/invoice/bengkel-motor/style.css) : Styling modern (Dark Mode POS) + Aturan `@media print` presisi **A5 Landscape** (210 mm x 148 mm).
- [app.js](file:///c:/Users/dring/source/repos/abdullahc/vba/invoice/bengkel-motor/app.js) : Logika POS, otomatisasi kalkulasi (Qty x Harga = Total, Uang Kembali), pencarian sparepart, dan Fetch API Google Sheets.
- [google-script.js](file:///c:/Users/dring/source/repos/abdullahc/vba/invoice/bengkel-motor/google-script.js) : Kode jembatan API (Copy-Paste ke Google Apps Script) untuk koneksi ke Google Sheets.

---

## 🛠️ Fitur Utama Aplikasi Web

1. **Input Transaksi Cepat & Interaktif**:
   - Generator No. Struk Otomatis.
   - Autocomplete dropdown pencarian Jasa & Sparepart.
   - Otomatis mengisi harga saat item dipilih.
   - Tambah & hapus baris dinamis.
   - Hitung Total & Uang Kembali secara real-time.

2. **Cetak Nota A5 Landscape Presisi**:
   - Didesain khusus menggunakan CSS `@media print` ukuran A5 Landscape (`210 mm x 148 mm`).
   - Saat tombol **"Cetak Struk A5"** diklik, antarmuka web (form & tombol) otomatis disembunyikan dan hanya menampilkan nota A5 yang siap dicetak ke printer apa saja tanpa perlu atur margin manual.

3. **Koneksi Google Sheets (Database Gratis)**:
   - Menyimpan riwayat transaksi ke sheet `Transaksi`.
   - Mengambil master harga dari sheet `MasterBarang`.
   - Terhubung secara otomatis dengan Google Apps Script milik Anda.

---

## 📋 Panduan Langkah demi Langkah Membuat Google Sheets dari Nol

### 📌 Langkah 1: Buat Spreadsheet Baru
1. Buka browser Anda dan ketik **[sheets.new](https://sheets.new)** (atau buka `sheets.google.com`).
2. Beri nama file Google Sheets Anda di kiri atas, contoh: `Database Bengkel Motor`.

---

### 📌 Langkah 2: Buat 2 Sheet / Tab Utama

#### 🟢 Sheet 1: `MasterBarang`
1. Double-click nama tab di bagian bawah (`Sheet1`), lalu ubah namanya menjadi **`MasterBarang`** *(perhatikan huruf besar/kecil)*.
2. Pada **Baris 1**, isi judul kolom berikut:
   - Cell **A1**: `NamaBarang`
   - Cell **B1**: `Harga`
3. Isi data barang/jasa Anda mulai dari baris 2 ke bawah, contoh:

| | **A (NamaBarang)** | **B (Harga)** |
|---|---|---|
| **1** | **NamaBarang** | **Harga** |
| **2** | Servis Ringan + Tune Up Injeksi | 85000 |
| **3** | Oli Mesin Shell Advance AX7 10W-40 0.8L | 55000 |
| **4** | Oli Gardan Honda Genuine 120ml | 18000 |
| **5** | Kampas Rem Vario (Depan & Belakang) | 60000 |
| **6** | Busi NGK CPR9EA-9 | 25000 |

---

#### 🟢 Sheet 2: `Transaksi`
1. Klik tombol **`+`** *(Add Sheet)* di pojok kiri bawah untuk membuat tab baru.
2. Ganti nama tab baru tersebut menjadi **`Transaksi`**.
3. Pada **Baris 1**, isi judul kolom (Header) berikut secara berurutan:

| A1 | B1 | C1 | D1 | E1 | F1 | G1 | H1 | I1 | J1 | K1 |
|---|---|---|---|---|---|---|---|---|---|---|
| `NoStruk` | `Tanggal` | `Pelanggan` | `NoHP` | `NoPol` | `Motor` | `Odometer` | `Mekanik` | `Total` | `Bayar` | `ItemsJSON` |

---

### 📌 Langkah 3: Pasang Kode Apps Script (Jembatan API)

1. Di Google Sheets Anda, klik menu **Extensions (Ekstensi)** ➡️ **Apps Script**.
2. Hapus seluruh isi kode bawaan `function myFunction() { ... }`.
3. Buka file [google-script.js](file:///c:/Users/dring/source/repos/abdullahc/vba/invoice/bengkel-motor/google-script.js), **Copy (Salin)** seluruh kodenya, lalu **Paste (Tempel)** ke dalam editor Apps Script tersebut.
4. Klik tombol 💾 **Save** (atau tekan `Ctrl + S`).

---

### 📌 Langkah 4: Publikasikan (Deploy) Web App

1. Di pojok kanan atas Apps Script, klik tombol biru **Deploy** ➡️ **New deployment**.
2. Di samping *Select type*, klik ikon roda gigi ⚙️ ➡️ pilih **Web app**.
3. Atur parameternya seperti ini:
   - **Description**: `API POS Bengkel`
   - **Execute as**: `Me (email anda)`
   - **Who has access**: **`Anyone`** *(Sangat Penting! Harus "Anyone" agar aplikasi web bisa membaca/menyimpan data tanpa perlu login Google)*.
4. Klik **Deploy**.
5. Klik **Authorize access** untuk memberikan izin:
   - Pilih akun Google Anda.
   - Jika muncul peringatan *"Google hasn't verified this app"*, klik link kecil **Advanced (Lanjutan)** di bagian bawah.
   - Klik **Go to Untitled project (unsafe)** ➡️ klik **Allow (Izinkan)**.
6. Salin / Copy **Web App URL** yang muncul (Contoh: `https://script.google.com/macros/s/AKfycb.../exec`).

---

### 📌 Langkah 5: Hubungkan ke Web App Bengkel Motor

1. Buka file [index.html](file:///c:/Users/dring/source/repos/abdullahc/vba/invoice/bengkel-motor/index.html) di browser.
2. Klik tombol **"Hubungkan Google Sheets"** (di pojok kanan atas).
3. **Paste URL** yang sudah Anda salin tadi ke dalam kolom input.
4. Klik **Simpan Pengaturan**.
