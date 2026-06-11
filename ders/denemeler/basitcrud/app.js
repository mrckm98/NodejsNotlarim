const express = require("express");
const app = express();
const port = 8000 ;

app.use("/",(req,res)=>{
    res.send("<h1>Burasi anasayfa</h1>");
});




app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`);
})