const express = require('express');
const app = express();
const port = 3000;

let users = ["mehmet", "nur"];


app.get('/', (req,res)=>{
    
   res.send("ANASAYFA");
});

// :isim yerine yazilan yeri req.params.isim ile yakalanir
app.get('/profil/:isim',(req,res)=>{
    const gelenIsim = req.params.isim.toLowerCase();

    //user listesinde varsa ekrana yazdirma

    if (users.includes(gelenIsim)) {
        return res.send(`${req.params.isim} kullanicisinin profiline hosgeldiniz`);
    }else{
        return res.send(`Maalesef ${req.params.isim} adinda bir kullanici kayitli degil.`);
    }
})

//=============profil ekleme===============

app.get('/profil/ekle/:yeniIsim',(req,res)=>{
    const yeniGelen = req.params.yeniIsim.toLowerCase();

    if (users.includes(yeniGelen)) {
        return res.send(`${yeniGelen} isimli kullanici sisteme kayitli`)
    }else{
        users.push(yeniGelen);
        console.log(users);
        return res.send(`${yeniGelen} isimli kullanici basari ile kaydedildi`)
        
    }
})


//=================Profil SILME===============

app.get('/profil/sil/:silinen',(req,res)=>{
    const silinecek = req.params.silinen.toLowerCase();

    if (users.includes(silinecek)) {
        users = users.filter(sil => sil !== silinecek);
        console.log(users);
        return res.send(`${silinecek} isimli kullanici basari ile silindi`);
        
    } else {
        console.log(users);
        return res.send(`${silinecek} isimli kullanici kayili degil.`);

    }

})

app.listen(port, ()=>{
    console.log(`Sunucu http://localhost:${port}/ ayakta`);
    
})