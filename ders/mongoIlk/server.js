const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

//bu satiri arastir  ve aciklamasini yaz
app.use(express.json());

//mongodb den kopyaladigin kodu yapistir
const MONGO_URI = "mongodb://mehmet:mehmet1@ac-5aanth7-shard-00-00.lvzkqte.mongodb.net:27017,ac-5aanth7-shard-00-01.lvzkqte.mongodb.net:27017,ac-5aanth7-shard-00-02.lvzkqte.mongodb.net:27017/?ssl=true&replicaSet=atlas-99qgub-shard-0&authSource=admin&appName=deneme-cluster"

//veritabanina baglanma komutu
mongoose.connect(MONGO_URI)
    .then(()=>{
        console.log("[BASARILI] bulut veritabanina baglandi");
    })
    .catch((hata)=>{
        console.log("[!HATA!] bulut veritabanina baglanamadi", hata);
        
    })

    //veritabanina eklenecek her kelimenin kuralini koyuyoruz (sema hazirlama)
    const kelimeKayit = new mongoose.Schema({
        ingilizce:String,
        turkce:String,
        eklenmeTarihi: {type:Date, default:Date.now}
    })

    //Kelime adinda yeni bir veritabani odasi aciyoruz
    const kelimeModeli = mongoose.model('Kelime', kelimeKayit);


    //buluta veri yollamak icin asenkron ve post yapisi kullanilir
    app.post('/api/kelime-ekle', async(req,res)=>{
        try {
            const {ingilizce,turkce} = req.body;

            // Kalibimizi kullanarak yeni bir kelime objesi uretiyoruz
            const yeniKelime = new kelimeModeli({
                ingilizce:ingilizce,
                turkce:turkce
            })


            //buluta yollama ani
            //internet uzerinden yapilan bir islem oldugu icin islemin basina 'await' yazilir
            //yani bu satirin calismanisi bekle anlamina gelir.
            await yeniKelime.save();

            res.status(201).send(`${ingilizce} kelimesi basari ile sunucuya yuklenmistir`);
        } catch (err) {
            res.status(500).send("Veri kaydedilirken bir hata olustu" + err.message);
        }
    })

app.get('/',(req,res)=>{
    res.send("<h1>Anasayfa</h1>");
})


app.get("/api/kelimeler", async(req,res)=>{
    try {
        
        //find parantezleri bos oldugu icin filtre uygulamadan tum verileri cagirir.
        //await yapisi try catch ile kullanilir ve internetten veri cektigi icin kullanmak zorunludur
        const tumKelimeler = await kelimeModeli.find();


        //buluttan gelen verileri json formatina ceviririz.
        res.status(201).json(tumKelimeler);
    } catch (err) {
        res.status(500).send("buluttan veri cekilirken hata oldu " + err.message);
    }
})

//rastgele kelime cagirma 
app.get('/api/kelime/rastgele', async(req,res) =>{

    try {

        //tum kelimeleri bu middleware icin cekmek gerekli
        const tumKelimeler = await kelimeModeli.find();

        //rastgele index numarasi uretme
        const rastgeleIndex = Math.floor(Math.random() * tumKelimeler.length);
        const secilenKelime = tumKelimeler[rastgeleIndex];

        res.status(201).json(secilenKelime);
    } catch (err) {
        
        res.status(500).send("Rastgele kelime cekilirken bir hata yasandi " + err.message);
    }
})


//idsi bilinen elemani veritabanindan silme
app.delete("/api/kelime-sil/:id", async(req,res)=>{
    try {
        //urlde de parametre olarak verilen idyi yakalama
        const arananId = req.params.id;
        
        //simdi id ile bulup silme komutu vericez
        const silinenKelime = await kelimeModeli.findByIdAndDelete(arananId);

        //silinmek istenen veri veritabaninda bulunmuyorsa hata versin
        if (!silinenKelime) {
            return res.status(404).send("Silmek istedigin kelime veritabaninda bulunamadi");
        }

        //eger silme islemi gerceklesirse basarili mesaji veriyoruz
        res.status(200).send(`${silinenKelime.ingilizce} kelimesi bulut veritabanindan basariyla silindi!`);
    } catch (err) {
        res.status(500).send("silme islemi sirasinda bir hata olustu" + err.message);
    }
})





//veri guncelleme 
//dinamik guncelleme
app.patch("/api/kelime-guncelle/:id", async(req,res)=>{
    try {
        //guncellenmek istenen idyi kullanicidan cekme
        const istenenId = req.params.id;

        //guncellenmek istenen kelimeyi paket olarak yakaliyoruz
        const guncellenecekKelime = req.body;
        console.log(guncellenecekKelime);
        

        //sunucudaki degistirecegimiz veriyi cagiriyoruz
        //guncellenmek istedigimiz veriyi id ile bulduk await cok gerekli
        //1.parametre hangi id guncellenecekse onu yaz
        //2.parametre paketten ne ciktiysa onu yaz guncellenmek istenen yeni verileri yaz
        //3.parametre {returnDocument :'after'} mongoose a guncellenmis yeni hayidi geri don demek.
        const guncellenmisKelime = await kelimeModeli.findByIdAndUpdate(
            istenenId,
            guncellenecekKelime,
            {returnDocument :'after'}
        );
        
        //kelimenin varligi kontrolu
        if (!guncellenmisKelime) {
            
           return res.status(404).send("DIKKAT! Guncellemek istediginiz kelime veritabaninda bulunamadi");
        }

        res.status(200).json({
            mesaj: "kelime basariyla dinamik olarak guncellendi",
            yeniHali: guncellenmisKelime
        })
        //veri
    } catch (err) {
        res.status(500).send("guncelleme sirasinda bir hata olustu " + err.message);
    }
})





app.listen(port,()=>{
    console.log(`Sunucu http://localhost:${port} adresinde calisiyor`);
    
})