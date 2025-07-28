const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const predictor = require('./predictor');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde el frontend
app.use(express.static(path.join(__dirname, '../client')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/html/index.html'));
});

// Ruta para la predicción
app.post('/api/predict', async (req, res) => {
    const { team1, team2 } = req.body;
    const prediction = await predictor.predict(team1, team2);
    res.json({ prediction });
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
