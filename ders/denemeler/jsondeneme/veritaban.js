//ilk veritabani json
const { log } = require('console');
const fs = require('fs');
const { CLIENT_RENEG_LIMIT } = require('tls');


const yeniKelime = [{
    en : "book",
    tr : "kitap",
    ogrenildi: false
},
{
    en: "blue",
    tr: "mavi",
    ogrenildi: true
},
{
    en: "one",
    tr: "bir",
    ogrenildi: true
},
{
    en: "yellow",
    tr: "sari",
    ogrenildi: true
}];

//once objeyi yaziya cevirmek gerekiyor.

const data = JSON.stringify(yeniKelime, null, 2);

fs.writeFileSync('sozluk.json', data);


console.log("kelime basariyla veritabanina kaydedildi");

