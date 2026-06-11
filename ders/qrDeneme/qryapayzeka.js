const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Ortaya koyacağımız logonun sunucudaki sabit yolu
const LOGO_PATH = path.join(__dirname, 'logolar', '1.png'); 

async function generateQRBuffer(text, size = 400) {
    const canvas = createCanvas(size, size);
    
    await QRCode.toCanvas(canvas, text, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: size
    });

    const ctx = canvas.getContext('2d');

    // --- DEBUG BAŞLANGICI ---
    console.log("================ DEBUG RAPORU ================");
    console.log("1. Kodun çalıştığı ana dizin (__dirname):", __dirname);
    console.log("2. Kodun aradığı tam logo yolu (LOGO_PATH):", LOGO_PATH);
    
    const logoKlasoruVarMi = fs.existsSync(path.join(__dirname, 'logolar'));
    console.log("3. 'logolar' isimli klasör var mı?:", logoKlasoruVarMi ? "EVET" : "HAYIR");

    const logoDosyasıVarMi = fs.existsSync(LOGO_PATH);
    console.log("4. 'logo.png' dosyası gerçekten orada mı?:", logoDosyasıVarMi ? "EVET" : "HAYIR");
    console.log("==============================================");
    // --- DEBUG BİTİŞİ ---

    if (logoDosyasıVarMi) {
        const logo = await loadImage(LOGO_PATH);
        const logoSize = size * 0.23;
        const x = (size - logoSize) / 2;
        const y = (size - logoSize) / 2;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
        ctx.drawImage(logo, x, y, logoSize, logoSize);
    } else {
        // Logo yoksa sunucu çökmesin, en azından logosuz normal QR kodu üretsin ki 
        // sorunun sadece logodan kaynaklandığından emin olalım.
        console.warn("⚠️ Logo bulunamadığı için QR kod LOGOSUZ üretiliyor.");
    }

    return canvas.toBuffer('image/png');
}

// --- API ENDPOINT ---
// Tarayıcıdan şu şekilde çağırılacak: http://localhost:3000/generate-qr?url=https://github.com
app.get('/generate-qr', async (req, res) => {
    const targetUrl = req.query.url; // Tarayıcıdan gelen url parametresi

    if (!targetUrl) {
        return res.status(400).send('Lütfen bir "url" parametresi gönderin. Örn: ?url=https://google.com');
    }

    try {
        // QR kodu hafızada üret
        const qrBuffer = await generateQRBuffer(targetUrl, 400);

        // Tarayıcıya "Ben sana bir PNG resmi gönderiyorum" diyoruz
        res.setHeader('Content-Type', 'image/png');
        
        // Resmi canlı olarak gönder
        res.send(qrBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('QR kod oluşturulurken bir sunucu hatası oluştu.');
    }
});

app.listen(PORT, () => {
    console.log(`QR Servisi http://localhost:${PORT} adresinde hazır!`);
});