const express = require("express");
const fs = require("fs");
const app = express();
const port = 8000;

app.use(express.json());

 const dataFile= "./todos.json";
 
 //yardimci fonksiyon => dosyayi okuma
 const readData  =  ()=>{
    //dosyayi senkron bir sekilde "utf-8" formatinda okur.
    // console.log(JSON.parse(fs.readFileSync("dataFile")));
    const data = fs.readFileSync(dataFile, "utf-8");
    //okudugu veriyi konsola yazar
    console.log(data);

    return JSON.parse(data);
 }

 //yardimci fonskiyon => json dosyasina yazar
 const writeData = (data)=>{
    fs.writeFileSync(dataFile, JSON.stringify(data,null,2));
 };

 // /todos adresine gelen get yani veri isteklerini yakalar
 app.get("/todos",(req,res)=>{
   const todos = readData();
   res.json(todos); //okunan veriyi tarayiciya json formatinda gozterir.(restapi mantigi)
   
 });


 // /todos adresine gelen post(ekleme) isteklerini yakalar
   app.post("/todos",(req,res)=>{
      const todos = readData(); // mevcut listeyi dosyadan ceker
      const newTodo= {
         id : Date.now(), // o anki zaman damgasi unique id olusturr
         task : req.body.task, // gelen istegin gorev metnini alir
         complated : false  // yeni gorev varsayilan olarak yapilmadi secilir
   }
      todos.push(newTodo); // yeni task objesni dizinin sonuna ekler.
      writeData(todos); // listenin son halini dosyaya yazar(veritabanina)
      res.status(201).json(newTodo); // basarili koduyla yeni gorevi geri doner
   });


   // DELETE

  app.delete("/todos/:id", (req,res)=>{
   const { id } = req.params; //urldeki :id kismini alir.{}icerisde oldugundan kolayca boyle alinir
   let todos = readData(); //mevcut listeyi vtabanindan ceker

   //listeyi filtrele: gelen idye esit olmayanlari tutar. esit olani siler.
   const newTodos = todos.filter(todo => todo.id !== parseInt(id) );// paremetre olanid int olur
   writeData(newTodos); // elemanin silinmis hali olan listeyi vtabina kaydet
   // res.json({message:"gorev basariyla silindi"}); //islem bitti onayi
   res.json(readData());

});
app.listen(port,()=>{
    console.log(`Server Running on http://localhost:${port}`);
    
})