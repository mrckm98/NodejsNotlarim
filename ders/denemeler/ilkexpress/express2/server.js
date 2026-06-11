const express = require('express');
const port = 8000;
const app = express();

// app.get() app.post() app.put() app.delete() HTTP METODS



//app.use kullanirken '/' yani anasayfayi en alta koy
app.use('/about',(req,res)=>{
    res.send("burasi hakkimda sayfasi");
    //res.json(nessage :"Hakkimda sayfa");
    
})

app.use('/', (req,res)=>{
    res.send("burasi ana sayfasi");
});



app.listen(port, ()=>{
    
    
    console.log(`Sunucu https://localhost:${port} adresinde calisiyor.`);


});