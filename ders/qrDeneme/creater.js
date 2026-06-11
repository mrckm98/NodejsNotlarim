const express = require('express');
const {createCanvas, loadImage} = require('canvas');
const QRCode = require('qrcode');
const app = express();
const fs = require('fs');

const path = require('path');
const port = 3002;

const LOGO_PATH = path.join(__dirname, 'logolar', 'sponsorsuminikaretemizv2.png');

async function generateQRBuffer(text, size = 500){ //text > qr yapilacak veri 
    const canvas = createCanvas(size,size); // 400e400luk bos seffaf kanvas olusturduk
    const ctx = canvas.getContext('2d');//ctx, canvasin 2d calisma ortami


    await QRCode.toCanvas(canvas,text , {
        errorCorrectionLevel:'H',
        margin: 3,
        width: size,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    });
    



    

    //LOGO ISLEMLERI
    //Logo varsa tam ortaya yerlestir
    if (fs.existsSync(LOGO_PATH)) {
        const logo = await loadImage(LOGO_PATH); //adresteki pngyi hafizaya ceker
        const logoSize = size*0.23; //logo,qr in 4de1 oldu
        const x = (size - logoSize)/2;
        const y = (size - logoSize)/2; //x ve y eksenine gore logo ortalandi


        const logoRadius = 15; // Logonun köşelerinin ne kadar yuvarlanacağı (piksel)
        
        //qrcodun ana hatlarini kaydediyoruz
        ctx.save();
  
        //logo arkasindaki beyaz kisimi yuvarlama
        ctx.beginPath();

        ctx.roundRect(x - 4, y - 4, logoSize + 8,logoSize + 8, logoRadius + 4);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();


        //logonun kendisini yuvarlama
        ctx.beginPath();
        ctx.roundRect(x,y,logoSize, logoSize, logoRadius);
        ctx.clip(); // logoda disari tasan kisimlari siler

        //logoyu ciz
        ctx.drawImage(logo, x, y, logoSize, logoSize);

        //fircayi eski haline dondur (ctx.save)
        ctx.restore();
    }else{
        console.warn(`⚠️ Logo bulunamadı: ${LOGO_PATH}`);
        
    }

    //globalCompositeOperation > cizdigim alanin icindekiler kalsin disi silinsin
    ctx.globalCompositeOperation = 'destination-in';

    const qrRadius = 80; //dis koseler 30piksel yuvarlanacak!
        //QR dis koseleri yuvarlama
    ctx.beginPath();
    ctx.roundRect(5, 5, size-10, size-10, qrRadius);
    ctx.fill(); //koselere seffaf maske yapiyor

    ctx.globalCompositeOperation = 'source-over';
    //     //stroke cerceve
    ctx.strokeStyle = "black"; // Çerçeve rengi
    ctx.lineWidth = 5;         // Çerçeve kalınlığı
    ctx.stroke();             // Etrafına siyah çizgi çek
    


   

    return canvas.toBuffer('image/png'); //png formatinda kaydetti
    }

app.get('/generate-qr', async (req,res)=>{
    const targetUrl = req.query.url; 
    //http://localhost:3000/generate-qr adresine get ile gelen url parametresini yakalar.
    //ornek http://localhost:3000/generate-qr?url=google.com
    if(!targetUrl){
        return res.status(400).send('Lütfen bir "url" parametresi gönderin...');
    }
    try{
        const qrBuffer = await generateQRBuffer(targetUrl,400);
        res.setHeader('Content-Type', 'image/png');
        res.send(qrBuffer);
    }catch(error){
        console.log(error);
        res.status(500).send('Qr olustururken bir hata oldu.');
    }
});


/*
app.get('/', (req,res)=>{
    res.send("<h1>Anasayfa</h1>")
    // res.send(`<img src="/1.png" alt="Logo">`);
    // res.send('<img src="/logolar/1.png">')
    // res.send(`<img src="/${LOGO_PATH}">`)
    console.log(LOGO_PATH);
    
})
*/

app.listen(port , ()=>{
    console.log(`QR Servisi http://localhost:${port} adresinde hazır!`);
    // console.log(__dirname);
    
})

