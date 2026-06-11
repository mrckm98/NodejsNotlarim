const express = require('express'); // Express kütüphanesini çağır
const app = express(); // Uygulamayı başlat
const port = 3000; // Sunucunun çalışacağı kapı numarası

// Birisi ana sayfaya (/) gelirse ne yapalım?
app.get('/', (req, res) => {
  res.send('<h1> Kelime Uygulaması Sunucusuna Hoş Geldin!</h1>');
});

// Sunucuyu dinlemeye başla
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde hazır!`);
});