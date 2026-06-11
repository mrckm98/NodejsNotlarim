const express = require('express'); // Express modülünü projeye dahil eder
const fs = require('fs'); // Dosya okuma/yazma (File System) modülünü dahil eder
const app = express(); // Express uygulamasını başlatır

app.use(express.json()); // Gelen JSON formatındaki verileri okumayı sağlar (Middleware)

const DATA_FILE = './todos.json'; // Verilerin tutulacağı dosya yolunu belirler

const readData = () => { // JSON dosyasından veri okuyan yardımcı fonksiyon
    const data = fs.readFileSync(DATA_FILE, 'utf-8'); // Dosyayı metin formatında okur
    return JSON.parse(data); // Metni (string) JavaScript dizisine/objesine çevirir
};

const writeData = (data) => { // JSON dosyasına veri yazan yardımcı fonksiyon
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); // Obje/diziyi JSON formatına çevirip kaydeder
};

app.get('/todos', (req, res) => { // "/todos" adresine gelen GET (listeleme) isteklerini yakalar
    const todos = readData(); // Dosyadaki güncel veriyi okur
    res.json(todos); // Okunan veriyi istemciye (tarayıcıya) JSON olarak gönderir
});

app.post('/todos', (req, res) => { // "/todos" adresine gelen POST (ekleme) isteklerini yakalar
    const todos = readData(); // Önce mevcut listeyi dosyadan çeker
    const newTodo = { // Yeni eklenecek görev objesini oluşturur
        id: Date.now(), // O anki zaman damgasını eşsiz bir kimlik (ID) olarak atar
        task: req.body.task, // İstekle gelen (gönderilen) görev metnini alır
        completed: false // Yeni görevi varsayılan olarak "yapılmadı" işaretler
    };
    
    todos.push(newTodo); // Yeni objeyi mevcut listenin (dizinin) sonuna ekler
    writeData(todos); // Listenin son halini dosyaya geri yazar
    res.status(201).json(newTodo); // Başarılı oluşturma koduyla (201) yeni görevi geri döner
});


app.delete('/todos/:id', (req, res) => { // URL üzerinden gelen bir ID ile silme isteğini yakalar
    const { id } = req.params; // URL'deki ":id" kısmını değişkene alır (örneğin /todos/123)
    let todos = readData(); // Mevcut listeyi dosyadan okur
    
    // Listeyi filtrele: Gelen ID'ye eşit OLMAYANLARI tut, eşit olanı listeden at
    const newTodos = todos.filter(todo => todo.id !== parseInt(id)); 
    
    writeData(newTodos); // Yeni (eleman eksilmiş) listeyi dosyaya kaydeder
    res.json({ message: 'Görev başarıyla silindi' }); // İşlem bittiğinde onay mesajı döner
});


app.delete('/todos/:id', (req, res) => { // URL üzerinden gelen bir ID ile silme isteğini yakalar
    const { id } = req.params; // URL'deki ":id" kısmını değişkene alır (örneğin /todos/123)
    let todos = readData(); // Mevcut listeyi dosyadan okur
    
    // Listeyi filtrele: Gelen ID'ye eşit OLMAYANLARI tut, eşit olanı listeden at
    const newTodos = todos.filter(todo => todo.id !== parseInt(id)); 
    
    writeData(newTodos); // Yeni (eleman eksilmiş) listeyi dosyaya kaydeder
    res.json({ message: 'Görev başarıyla silindi' }); // İşlem bittiğinde onay mesajı döner
});

app.listen(3000, () => { // Sunucuyu 3000 numaralı portta dinlemeye başlar
    console.log('Sunucu http://localhost:3000 adresinde çalışıyor'); // Konsola bilgilendirme mesajı yazar
});