const fs = require('fs');

const veri = JSON.parse(fs.readFileSync('sozluk.json', 'utf-8'));

//rastgele bir index secme
const rastgeleIndex = Math.floor(Math.random()* veri.length);
const secilen = veri[rastgeleIndex];

console.log("-------------");
console.log(`ingilizcesi : ${secilen.en}`);
console.log(`Turkcesi ${secilen.tr}`);
console.log("--------------");

