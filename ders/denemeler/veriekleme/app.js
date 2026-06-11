const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

 app.get('/', (req,res)=>{
    res.send(`
                <h1>Kaydetmek istediginiz kelimeyi yaziniz</h1>
                EN  <input type="text" placeholder="ingilizce kelime girin">
                <br>
                TR <input type="text" placeholder="Turkce karsiligini girin">
                <br>
                <button onclick="">Kelimeyi kaydet</button>
        `)
 });


 app.listen(port, ()=>{
    console.log("sunucu aktif");
    
 })