/**
 * ==============================================================================
 * KODE GOOGLE APPS SCRIPT (GAS) UNTUK DATABASE GOOGLE SHEETS
 * ==============================================================================
 * 
 * CARA PASANG:
 * 1. Buka Google Sheets Anda.
 * 2. Buat 2 Sheet di dalamnya:
 *    - Sheet 1: `MasterBarang` (Header di baris 1: NamaBarang | Harga)
 *    - Sheet 2: `Transaksi` (Header di baris 1: NoStruk | Tanggal | Pelanggan | NoHP | NoPol | Motor | Odometer | Mekanik | Total | Bayar | ItemsJSON)
 * 3. Klik menu "Extensions" -> "Apps Script".
 * 4. Hapus semua isi kode default, lalu Paste seluruh kode di bawah ini.
 * 5. Klik tombol "Deploy" -> "New deployment".
 * 6. Pilih type: "Web app".
 *    - Description: "API Bengkel POS"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (PENTING!)
 * 7. Klik "Deploy", lalu Berikan Izin (Grant Permissions).
 * 8. Copy URL Web App yang dihasilkan (misal: https://script.google.com/macros/s/.../exec)
 *    dan masukkan ke dalam Web App Anda via tombol "Hubungkan Google Sheets".
 * ==============================================================================
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("MasterBarang");
    
    // Jika sheet MasterBarang belum ada, buatkan otomatis
    if (!sheet) {
      sheet = ss.insertSheet("MasterBarang");
      sheet.appendRow(["NamaBarang", "Harga"]);
      sheet.appendRow(["Servis Ringan + Tune Up Injeksi", 85000]);
      sheet.appendRow(["Oli Mesin Shell Advance AX7 10W-40 0.8L", 55000]);
      sheet.appendRow(["Oli Gardan Honda Genuine 120ml", 18000]);
      sheet.appendRow(["Kampas Rem Vario (Depan & Belakang)", 60000]);
      sheet.appendRow(["Busi NGK CPR9EA-9", 25000]);
      sheet.appendRow(["Roller CVT Set / Slider", 15000]);
    }
    
    var data = sheet.getDataRange().getValues();
    var masterList = [];
    
    // Skip header row
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) {
        masterList.push({
          nama: data[i][0],
          harga: Number(data[i][1]) || 0
        });
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(masterList))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Transaksi");
    
    // Jika sheet Transaksi belum ada, buatkan otomatis
    if (!sheet) {
      sheet = ss.insertSheet("Transaksi");
      sheet.appendRow(["NoStruk", "Tanggal", "Pelanggan", "NoHP", "NoPol", "Motor", "Odometer", "Mekanik", "Total", "Bayar", "ItemsJSON"]);
    }
    
    sheet.appendRow([
      contents.noStruk || "",
      contents.tanggal || new Date(),
      contents.pelanggan || "",
      contents.noHp || "",
      contents.nopol || "",
      contents.motor || "",
      contents.odometer || "",
      contents.mekanik || "",
      contents.total || 0,
      contents.bayar || 0,
      contents.items || "[]"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil disimpan!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
