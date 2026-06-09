const express = require('express');
const app = express();
const port = 3000;  

app.get('/', (req, res) => {
  res.send('Anasayfaya hoş geldiniz!');
});

app.get('/selamla', (req, res) => {
  
    // İstekten "isim" parametresini al
    const gelensIsim = req.query.isim;
    

    if(!gelensIsim) {
        return res.send('Lütfen "isim" parametresini girin örneğin: /selamla?isim=Ahmet');
    }
    

  res.send(`Merhaba, ${gelensIsim}!`);
});

app.get('/tekrarla', (req, res) => {
        const gelensKelime = req.query.kelime;  



        const gelensTekrarSayisi = Number(req.query.tekrar) || 1;
        // gelensTekrarSayisi değeri yoksa veya geçerli bir sayı değilse varsayılan olarak 1 kullanılır

 
        if(!gelensKelime) {
            return res.send('Lütfen "kelime" parametresini girin örneğin: /tekrarla?kelime=Merhaba');
        }

        res.send(`Tekrarlanan kelime: ${gelensKelime} `.repeat(gelensTekrarSayisi));       
});

app.get('/coklu-parametre', (req, res) => {
    const gelensParametre1 = req.query.isim;
    const gelensParametre2 = req.query.soyisim;  
    const gelensParametre3 = req.query.yas;

    if(!gelensParametre1 || !gelensParametre2 || !gelensParametre3) {
        return res.send('Lütfen "isim", "soyisim" ve "yas" parametrelerini girin örneğin: /coklu-parametre?isim=Ahmet&soyisim=Yılmaz&yas=30');
    }
    res.send(`İsim: ${gelensParametre1}, Soyisim: ${gelensParametre2}, Yaş: ${gelensParametre3}`);
});





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




   // "start": "node server.js",
    // "dev": "nodemon server.js"