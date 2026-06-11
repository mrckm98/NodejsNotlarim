const express = require('express');
const port = 8000;
const app = express();




app.use("/user/:username",(req,res)=>{
    
    console.log(req.params);
    console.log(`kullanici adiniz: ${req.params.username}`);
    res.end(`hosgeldiniz ${req.params.username}!`);

});

app.use("/", (req,res)=>{
  
        console.log("burasi anasayfa");
        res.send("Anasayfa");

        // console.log(req);
});



app.listen(port, ()=>{
    console.log(`Sunucu ayakta. Port: ${port}`);
});



