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

app.get('/',(req,res)=>{
    res.send("<h1>Anasayfa</h1>");
})

app.listen(port,()=>{
    console.log(`Sunucu http://localhost:${port} adresinde calisiyor`);
    
})