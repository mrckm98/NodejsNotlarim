const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // sifre gizleyici kutuphanemiz 
const port = 3000;

const app = express();
app.use(express.json()); //json dosyalari yazilim icin okunur hale getirir


// GunlukDB kismi baglanmak istedigimiz veri tabaninin ismidir
//eger bu isimde veri tabani yoksa ilk veri kaydetme isleminde otomatik olusturulur 
const MONGO_URI = "mongodb://mehmet:mehmet1@ac-5aanth7-shard-00-00.lvzkqte.mongodb.net:27017,ac-5aanth7-shard-00-01.lvzkqte.mongodb.net:27017,ac-5aanth7-shard-00-02.lvzkqte.mongodb.net:27017/GunlukDB?ssl=true&replicaSet=atlas-99qgub-shard-0&authSource=admin&appName=deneme-cluster"

mongoose.connect(MONGO_URI)
    .then(()=> console.log("🟢[Diary project] Bulut veritabanina basariyla baglandi"))
    .catch( err =>( console.log("🔴Bulut baglanti hatasi: ", err)));



    //kullanici kalibi schema (verilerin kurallar listesi)
    //kullaniciAdi ve sifre verilerinin ikiside hem string olmali hem de bosbirakilmalidir. 
    //ancak saadece kullaniciAdi veritabaninda sadece bir kez kaydolabilir (unique)
    const kullaniciSemasi = new mongoose.Schema({
        kullaniciAdi: {type:String, required:true, unique:true},
        sifre: {type:String, required:true}
    });

    //veritabanina baglanip uzerinde islemler yapmak icin MODEL olusturulur
    //DB ulasmak icin Kullanici parametresi yazmamiz lazim ancak mongo uzerinde bizim 3.parametrede belirttigimiz gibi kullanicilar yazmaktadir.
    //2. parametre bizim onceden belirledigimiz kurallari uygulamak icin
    const kullaniciModeli = mongoose.model("Kullanici", kullaniciSemasi,"kullanicilar");


    //Sifreyi maskeleme(hashing)
    //guvenli kayit sistemi
    app.post("/api/auth/kayit", async (req,res)=>{
        try{
            const {kullaniciAdi,sifre} = req.body;

            if (!kullaniciAdi || !sifre) {
                return res.status(400).send("Kullanici adi ve sifre zorunludur");
            }

            //maskeleme zamani
            //sifreyi karistirmak icin 10derecelik gizli salt olustur
            const salt = await bcrypt.genSalt(10);

            //tuz ile sifreyi karistirma hash
            //hash fonksiyonu geri alinamaz tek yonlu bir metoddur
            const maskeliSifre = await bcrypt.hash(sifre,salt);

            //DBye duz sifreyi degil, Maskelenmis sifreyi veriyoruz
            const yeniKullanici = new kullaniciModeli({
                kullaniciAdi: kullaniciAdi,
                sifre: maskeliSifre
            });

            //persistence (kalici) olarak kayit etme
            await yeniKullanici.save();
            res.status(201).send(`${kullaniciAdi} isimli kullanici guvenle sunucuya kaydolmustur`);
        }catch(err){
            res.status(500).send("Kayit islemi sirasinda hata oldu (kullanici adi alinmis olabilir)", err);
        }
    })

    //tum kullanicilari yazdir
    app.get('/api/kullanicilar', async (req,res)=>{
        try {
            
            //find metodunda parametre olmadigi icin filtre uygulamadan DB herseyi cagirir.

            const tumKullanicilar = await kullaniciModeli.find();
            res.status(201).json(tumKullanicilar);
        } catch (err) {
            res.status(400).send("veri cekilirken hata oldu", err.message);
        }
    })
app.listen(port, ()=>{
    console.log(`Sunucu http://localhost:${port} adresinde ayakta!`);
    
})