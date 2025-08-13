const express = require('express');
const cors = require('cors');
const path = require('path');
const { predictor } = require('./server/predictor'); // Ajusta la ruta si está en otra carpeta

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint para predecir usando el predictor modular
app.get('/predict/:local/:visitante', async (req, res) => {
    try {
        const localId = parseInt(req.params.local, 10);
        const visitanteId = parseInt(req.params.visitante, 10);

        if (isNaN(localId) || isNaN(visitanteId)) {
            return res.status(400).json({ error: 'IDs de equipos inválidos' });
        }

        const result = await predictor(localId, visitanteId);
        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
});

// Servir archivos estáticos (HTML, CSS, JS, imágenes) desde 'client'
app.use(express.static(path.join(__dirname, 'client')));

// Para servir index.html en la raíz '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'html', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
