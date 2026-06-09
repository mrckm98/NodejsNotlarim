const express= require('express');
const app = express();
const port = 3000;  

let sepet = ["elma", "armut", "muz"];

const sepetigoruntule = () => {
    return `Alışveris sepetteki ürünler! > ${sepet.join(', ')}`;
    //.join(', ') sepet dizisindeki ürünleri virgülle ayırarak tek bir string haline getirir.   
};


app.get('/sepet', (req, res) => {

    //sepeti goruntule
    res.send(`Alışveris sepetteki ürünler! > ${sepetigoruntule()}`);
    //.join(', ') sepet dizisindeki ürünleri virgülle ayırarak tek bir string haline getirir.

    if(sepet.length === 0) {
        return res.send('Alışveris sepetiniz boş!');
    }   


});

// Sepete ürün ekleme endpointi

app.get('/sepet/ekle', (req, res) => {

    const yeniUrun = req.query.urun; // İstekten "urun" parametresini al 

    if(!yeniUrun) {
        return res.send('Lütfen "urun" parametresini girin örneğin: /sepet/ekle?urun=portakal');
    }   


    sepet.push(yeniUrun);
    res.send(`Ürün eklendi! ${sepetigoruntule()}`);
});

//sepeti listele endpointi

app.get('/sepet/listele', (req,res)=>{

    const sepetiListele = sepet.map((value,index)=>`${index + 1 }. ${value}`).join("<br>");
    
    res.send(sepetiListele);
});

//sepeti temizleme endpointi

app.get('/sepet/temizle', (req, res) =>{
    sepet = [];
    res.send(`Alisveris listesi temizlendi! ${sepetigoruntule()}`);
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});