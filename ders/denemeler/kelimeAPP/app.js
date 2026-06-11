const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;


app.get('/', (req,res) =>{
    res.send(`<h1>Kelime uygulamasi backend yayinda!Kelime sayfasina gitmek icin <a href= "/kelime">tikla</a></h1>`);
});

app.get('/kelime', (req,res)=>{
    
    const hamVeri = fs.readFileSync('datas/sozluk.json', 'utf-8');
    const kelimeler = JSON.parse(hamVeri);

    const secilen = kelimeler[Math.floor(Math.random()* kelimeler.length)];
    res.send(`<h1>Burasi kelime sayfasi</h1>
        <h1>Kelimeniz</h1>
        <h2>${secilen.en}</h2>
        <h2>${secilen.tr}</h2>
        <button onclick ="location.reload()">Baska kelime getir</button>`);
});


app.get('/toplam', (req,res)=>{
    const hamVeri = fs.readFileSync('datas/sozluk.json', 'utf-8');
    const kelimeler = JSON.parse(hamVeri);
    res.send(`<h1>Veritabanimizda toplam kelime sayisi : ${kelimeler.length}</h1>`);
})


app.listen(port, ()=>{
    console.log(`sunucu http://localhost:${port} adresinde calisiyor.`);
});