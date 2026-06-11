const fs = require('fs');

// json dosyasindaki ham veriyi oku
const hamVeri = fs.readFileSync('sozluk.json', 'utf-8');

// yaziyi tekrar javascript objesine donusturme
const kelimeObjesi = JSON.parse(hamVeri);

console.log(kelimeObjesi);
console.log(kelimeObjesi[0].en);
console.log(kelimeObjesi[0].tr);
console.log(kelimeObjesi[1].en);
console.log(kelimeObjesi[1].tr);
