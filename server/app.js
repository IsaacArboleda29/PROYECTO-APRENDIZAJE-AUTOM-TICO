const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { predict } = require('./predictor'); // Asegúrate que la ruta es correcta

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Endpoint de predicción
app.get('/predictor/:localId/:visitanteId', async (req, res) => {
    try {
        const { localId, visitanteId } = req.params;
        const prediction = await predict(parseInt(localId), parseInt(visitanteId));
        res.json(prediction);
    } catch (error) {
        console.error('Error en el endpoint:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});