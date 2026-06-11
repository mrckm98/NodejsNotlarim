const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// 1. JSON verilerini anlamamızı sağlar (req.body için)
app.use(express.json());

// 2. 'public' klasöründeki index.html'i otomatik olarak yayına alır
app.use(express.static('public'));

// 3. Log tutucu: Terminalde ne olup bittiğini görelim
app.use((req,res,next)=>{
   console.log(`📡 [${new Date().toLocaleTimeString()}] İstek: ${req.method} ${req.url}`);
    next();
});

app.get('/kelimeler', (req,res)=>{
    // once sozluk.json dosyasindan hamveri aliyor
    //sonra json parse ile anlamli string haline getiriyor
    const hamVeri = fs.readFileSync('sozluk.json', 'utf-8');
    res.json(JSON.parse(hamVeri));
});

app.post('/ekle', (req,res)=>{
    const veriler = JSON.parse(fs.readFileSync('sozluk.json', 'utf-8'));
    veriler.push(req.body);
    fs.writeFileSync('sozluk.json', JSON.stringify(veriler, null, 2));
    res.send("Kelime başarıyla eklendi.");
})
// DELETE: İsme göre kelimeyi sil
// ':ingilizce' bir değişkendir, req.params üzerinden okunur
app.get('/sil/:ingilizce', (req, res) => {
    const silinecek = req.params.ingilizce;
    let veriler = JSON.parse(fs.readFileSync('sozluk.json', 'utf-8'));
    
    // Silinecek kelime hariç yeni bir liste oluştur (Filtreleme)
    const yeniListe = veriler.filter(kelime => kelime.en !== silinecek);
    
    fs.writeFileSync('sozluk.json', JSON.stringify(yeniListe, null, 2));
    res.send("Silindi!");
});

app.listen(port, ()=>{
    console.log(`Sunucu http://localhost:${port} adresinde baslatildi`);
    
})