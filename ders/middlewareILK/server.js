const express = require('express');
const app = express();
const port = 3000;

//bilet kontrol middleware (fonksiyon)

const biletKontrolcu = (req,res,next) =>{
    //url uzerinden bilet kontrolu ornet ?bilet=var
    const biletDurumu = req.query.bilet?.toLowerCase();

    if (biletDurumu === "var") {
        //bilet varsa next() fonksiyonu cagrilir
        //bilet kontrol edildi bir sonraki asamaya gecebilir.
        console.log("biletiniz gecerli");
        
        next();
    }else{
        //bilet yoksa next yazmadan reddedilir
        console.log("gecersiz bilet!!");
        res.send("Biletiniz olmadan giremezsiniz");
    }
}

//sadece bileti olanlarin girebildigi alan
//biletKontrolcu middleware ini kontrol etmesi icin cagirdik
app.get("/sinema-salonu", biletKontrolcu, (req,res)=>{
    //eger kullanici yukardaki middlewarei gecebildiyse o zaman bu kod calisacak
    res.send("Biletli alana hosgeldiniz!");
})


//Herkese acik alan bilet olmasa bile herkes girebilir
//cunku bilet kontrolu yapilmiyor
app.get('/',(req,res)=>{
    res.send("Anasayfa");
})

app.listen(port, ()=>{
    console.log(`Sunucu http://localhost:${port} adresinde ayakta`);
    
})
