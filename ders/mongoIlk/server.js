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
app.listen(port,()=>{
    console.log(`Sunucu http://localhost:${port} adresinde calisiyor`);
    
})