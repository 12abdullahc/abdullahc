/**
 * ==============================================================================
 * KODE GOOGLE APPS SCRIPT (GAS) UNTUK DATABASE GOOGLE SHEETS
 * ==============================================================================
 * 
 * CARA PASANG:
 * 1. Buka Google Sheets Anda.
 * 2. Buat 3 Sheet di dalamnya:
 *    - Sheet 1: `MasterBarang` (Header di baris 1: NamaBarang | Harga)
 *    - Sheet 2: `Transaksi` (Header di baris 1: NoStruk | Tanggal | Pelanggan | NoHP | NoPol | Motor | Odometer | Mekanik | Total | Bayar | ItemsJSON)
 *    - Sheet 3: `Catatan` (Header di baris 1: IsiCatatan)
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
    
    // 1. MASTER BARANG SHEET
    var sheetMaster = ss.getSheetByName("MasterBarang");
    if (!sheetMaster) {
      sheetMaster = ss.insertSheet("MasterBarang");
      sheetMaster.appendRow(["NamaBarang", "Harga"]);
      sheetMaster.appendRow(["Servis Ringan + Tune Up Injeksi", 85000]);
      sheetMaster.appendRow(["Oli Mesin Shell Advance AX7 10W-40 0.8L", 55000]);
      sheetMaster.appendRow(["Oli Gardan Honda Genuine 120ml", 18000]);
      sheetMaster.appendRow(["Kampas Rem Vario (Depan & Belakang)", 60000]);
      sheetMaster.appendRow(["Busi NGK CPR9EA-9", 25000]);
      sheetMaster.appendRow(["Roller CVT Set / Slider", 15000]);
    }
    
    var dataMaster = sheetMaster.getDataRange().getValues();
    var masterList = [];
    for (var i = 1; i < dataMaster.length; i++) {
      if (dataMaster[i][0]) {
        masterList.push({
          nama: dataMaster[i][0],
          harga: Number(dataMaster[i][1]) || 0
        });
      }
    }
    
    // 2. CATATAN SHEET
    var sheetCatatan = ss.getSheetByName("Catatan");
    if (!sheetCatatan) {
      sheetCatatan = ss.insertSheet("Catatan");
      sheetCatatan.appendRow(["IsiCatatan"]);
      sheetCatatan.appendRow(["- Garansi Servis 7 Hari / 500 km (Bawa nota ini)."]);
      sheetCatatan.appendRow(["- Sparepart bekas/lama diserahkan ke konsumen."]);
    }
    
    var dataCatatan = sheetCatatan.getDataRange().getValues();
    var catatanLines = [];
    for (var c = 1; c < dataCatatan.length; c++) {
      if (dataCatatan[c][0]) {
        catatanLines.push(String(dataCatatan[c][0]));
      }
    }
    var catatanText = catatanLines.join("\n");
    
    // 3. SEQUENTIAL STRUK COUNTER FROM TRANSAKSI SHEET (FORMAT: STR/001, STR/002...)
    var sheetTx = ss.getSheetByName("Transaksi");
    var totalTx = sheetTx ? Math.max(0, sheetTx.getLastRow() - 1) : 0;
    var nextCounter = totalTx + 1;

    var responseData = {
      items: masterList,
      catatan: catatanText,
      nextCounter: nextCounter,
      totalTx: totalTx
    };

    return ContentService
      .createTextOutput(JSON.stringify(responseData))
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

    var newTotalTx = Math.max(0, sheet.getLastRow() - 1);

    // KIRIM EMAIL CAPTURE NOTA KE DAFTAR EMAIL PADA SHEET "Email"
    var sheetEmail = ss.getSheetByName("Email");
    if (sheetEmail && sheetEmail.getLastRow() > 1) {
      try {
        var dataEmail = sheetEmail.getDataRange().getValues();
        var emailList = [];
        for (var eIdx = 1; eIdx < dataEmail.length; eIdx++) {
          var em = String(dataEmail[eIdx][0] || "").trim();
          if (em && em.indexOf("@") !== -1) {
            emailList.push(em);
          }
        }

        if (emailList.length > 0) {
          var subject = "SP 76 Motor - Nota Transaksi " + (contents.noStruk || "");
          var hasImage = contents.receiptImage && contents.receiptImage.indexOf("data:image") !== -1;
          
          var imageBlob = null;
          var inlineObj = {};
          var attachmentsList = [];
          var imgHtmlCode = '';

          if (hasImage) {
            var base64Data = contents.receiptImage.replace(/^data:image\/(png|jpeg);base64,/, "");
            imageBlob = Utilities.newBlob(Utilities.base64Decode(base64Data), "image/png", "Nota_" + (contents.noStruk || "Struk").replace(/[\/\\]/g, "_") + ".png");
            inlineObj = { receiptImg: imageBlob };
            attachmentsList = [imageBlob];
            imgHtmlCode = '<div style="margin: 20px 0; text-align: center;"><img src="cid:receiptImg" style="max-width: 100%; height: auto; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" /></div>';
          }

          var htmlBody = '<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">' +
            '<h2 style="color: #2563eb; margin-top: 0;">SP 76 Motor - Nota Struk Transaksi</h2>' +
            '<p>Halo,</p>' +
            '<p>Berikut adalah bukti transaksi nota struk <b>' + (contents.noStruk || "") + '</b>' +
            (contents.pelanggan ? ' atas nama <b>' + contents.pelanggan + '</b>' : '') + ':</p>' +
            '<ul style="line-height: 1.6; font-size: 14px;">' +
            '<li><b>No. Struk:</b> ' + (contents.noStruk || "-") + '</li>' +
            '<li><b>Pelanggan:</b> ' + (contents.pelanggan || "-") + '</li>' +
            '<li><b>No. Polisi:</b> ' + (contents.nopol || "-") + '</li>' +
            '<li><b>Total Transaksi:</b> Rp ' + (contents.total ? contents.total.toLocaleString('id-ID') : '0') + '</li>' +
            '</ul>' +
            imgHtmlCode +
            '<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />' +
            '<p style="color: #666; font-size: 12px;">Terima kasih atas kunjungan Anda.<br><b>SP 76 Motor - Motorcycle repairs shop</b></p>' +
            '</div>';

          emailList.forEach(function (recipient) {
            MailApp.sendEmail({
              to: recipient,
              subject: subject,
              body: "Nota Struk Transaksi " + (contents.noStruk || "") + " - SP 76 Motor",
              htmlBody: htmlBody,
              inlineImages: inlineObj,
              attachments: attachmentsList
            });
          });
        }
      } catch (emailErr) {
        Logger.log("Gagal mengirim email nota: " + emailErr.toString());
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Data & email nota berhasil diproses!",
        nextCounter: newTotalTx + 1
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// FUNGSI UJI COBA OTORISASI EMAIL (JALANKAN DARI APPS SCRIPT EDITOR)
function testSendEmail() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetEmail = ss.getSheetByName("Email");
  if (!sheetEmail || sheetEmail.getLastRow() < 2) {
    Logger.log("Sheet Email kosong atau belum dibuat.");
    return;
  }
  var testEmail = String(sheetEmail.getRange("A2").getValue()).trim();
  if (testEmail) {
    MailApp.sendEmail(testEmail, "Tes Otorisasi Email - SP 76 Motor", "Email berhasil dikirim dari Google Apps Script!");
    Logger.log("Email tes berhasil dikirim ke: " + testEmail);
  }
}
