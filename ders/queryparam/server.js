const express = require('express');
const app = express();
const port = 3001;

app.get("/selamla", (req,res)=>{
    const gelenIsim = req.query.isim;

    //kullanici isim girmezse uyari verilicek
    if(!gelenIsim){
        return res.send("Merhaba Isminizi girmediniz!");
    }

    res.send(`Hos geldi ${gelenIsim}`);
})

app.get("/tekrarla",(req,res)=>{
    const gelenKelime = req.query.kelime;

    if(!gelenKelime){
        return res.send("bir kelime giriniz");
    }
    const tripleRepeat = `${gelenKelime} `.repeat(3)

    res.send(`Yanki odasi: ${tripleRepeat}`);

})


app.get('/kare',(req,res)=>{
    const gelenSayi = Number(req.query.sayi);
    // gelenSayi = Number(gelenSayi);iptal
    if(!gelenSayi){
        return res.send("Bir sayi giriniz");
    }

    const hesapla = gelenSayi**2; //ust alma 
    res.send(`Girdiginiz sayi${gelenSayi}. Karesi:${hesapla}`);
})
app.listen(port,()=>{
    console.log(`Sunucu calisiyor`);
})