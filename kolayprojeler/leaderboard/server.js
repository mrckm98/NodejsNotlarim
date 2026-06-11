const express = require('express');
const app = express();
const port= 3000;

//postmanden gelen gizli paketleri okumaya yarayan middleware
app.use(express.json());

//default skor tablosu
let skorTablosu = [
    {id:1, oyuncu:"kodtyper", skor:9000},
    {id:2, oyuncu:"alexcan", skor:9300}
];

// GET ile skor tablosunu kullaniciya doner
app.get('/api/skorlar', (req,res)=>{
    //toSorted metodu en modern yolu her tarayica calismaz
    //alternatifi 
    // const siraliListe = [...skorTablosu].sort((a, b) => b.skor - a.skor);
    const kucuktenBuyuge = skorTablosu.toSorted((a,b)=>{
        return b.skor - a.skor;
        // Sonuç pozitif ise (b > a): b, a'nın önüne geçer.
        // Sonuç negatif ise (b < a): a, b'nin önüne geçer.
        // Sonuç 0 ise: Sıra değişmez.
    })
    res.json(skorTablosu);
})

//POST ile listeye yeni skor ekleme
app.post('/api/skorlar', (req,res)=>{
    //postmanin body kismindan gonderdigimiz verileri key olarak kisa yoldan yakaliyoruz (Destructuring)
    const {oyuncu,skor} = req.body;

    //yeni bir skor objesi olusturuyoruz
    const yeniSkor = {
        id: skorTablosu.length + 1,
        oyuncu : oyuncu,
        skor: Number(skor)
    }

    skorTablosu.push(yeniSkor);
    res.send(`${oyuncu}, listeye ${skor} puanla kaydedildi.`)
})

//DELETE islemi
app.delete("/skorlar/sil/:id", (req,res)=>{
    const silinecekID = Number(req.params.id);

    //Silinmek istenen id listede var mi diye kontrol edilir.
    const idVarMi = skorTablosu.some(eleman => eleman.id === silinecekID);

    //eger eleman yoksa 404 hatasi verir
    if (!idVarMi) {
        return res.status(404).json({
            success: false,
            message: `Silinmek istenen ${silinecekID} idli skor bulunamadi`
        })
    } else {
//if bloguna return yazdigimiz icin bu satiri else icinde yazmamiza gerek yok. 
        
        
//id varsa silme islemini yap
        skorTablosu = skorTablosu.filter(eleman => eleman.id !== silinecekID);

        //filter ile silme mantigi: idsi esit olmayan elemanlari geri dondurur, idsi kontrol ettigimiz silinecekID ile ayni ise yeni listede geri donmez.

        //BASARILI mesaini gonderme
        res.json({
            success:true,
            message:"Skor basari ile silindi",
            kalanlar: skorTablosu
        })
    }
})

app.get('/', (req,res)=>{
    res.send("<h1> Anasayfa!</h1>");
    // res.send("<h1> Skor tablosu!</h1>");
});

app.listen(port,()=>{
    console.log(`Sunucu http://localhost:${port} adreside calisiyor.`);
    
});