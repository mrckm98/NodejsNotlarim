const express = require('express');
const app = express();
const port = 3000;  

app.get('/selamla', (req, res) => {
    const gelenIsim = req.query.isim;
    if (!gelenIsim) {
        return res.status(400).send('Lütfen bir isim sağlayın.');
    }
    res.send(`Hello, ${gelenIsim}!`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});