const express = require('express');
const app = express();
const port = 3001;

let sayac = 0;

app.get('/sayac', (req,res)=>{
    res.send(`Mevcut sayac degeri: ${sayac}`);
});
app.get('/arttir', (req,res)=>{
    sayac++;
    res.send(`Sayac degeri arttirildi. Yeni deger: ${sayac}`);
});
app.get('/azalt', (req,res)=>{
    sayac--;
        res.send(`Sayac degeri azaltildi. Yeni deger: ${sayac}`);
})
app.get("/sifirla", (req,res)=>{
    sayac = 0;
    res.send(`Sayac sifirlandi. Sayac degeri: ${sayac}`);
});
app.get("/katla",(req,res)=>{
    sayac = sayac * 2;
    res.send(`Sayac iki katina cikarildi. Sayac degeri: ${sayac}`);
})

app.get("/", (req,res)=>{
   res.send("Burasi anasayfa");
})
app.listen(port,()=>{
    console.log(`🚀 Sunucu http://localhost:${port} adresinde hazır!`);
});


