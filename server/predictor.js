const pool = require('../db');
const { spawn } = require('child_process');
const path = require('path');

// Mapeo de columnas necesarias para el modelo
const FEATURE_MAP = {
    'local_avg_last5': 'local_avg_last5',
    'visitante_avg_last5': 'visitante_avg_last5',
    'ratio_ataques_peligrosos': 'ratio_ataques_peligrosos',
    'eficiencia_corner_local': 'eficiencia_corner_local',
    'posesion_local': 'posesion_local',
    'local_corner_category': 'local_corner_category',
    'tiros_bloqueados_local': 'tiros_bloqueados_local',
    'intentos_a_porteria_local': 'intentos_a_porteria_local',
    'visitante_corner_category': 'visitante_corner_category',
    'atajadas_visitante': 'atajadas_visitante',
    'ataques_peligrosos_local': 'ataques_peligrosos_local',
    'atajadas_local': 'atajadas_local',
    'intentos_a_porteria_visitante': 'intentos_a_porteria_visitante',
    'tiros_a_puerta_local': 'tiros_a_puerta_local',
    'tiros_bloqueados_visitante': 'tiros_bloqueados_visitante',
    'tiros_fuera_local': 'tiros_fuera_local',
    'consistencia_corners_local': 'consistencia_corners_local',
    'diff_last3_vs_last5_visitante': 'diff_last3_vs_last5_visitante',
    'diff_last3_vs_last5_local': 'diff_last3_vs_last5_local',
    'visitante_avg_last3': 'visitante_avg_last3',
    'local_avg_last3': 'local_avg_last3',
    'last3_vs_media_liga': 'last3_vs_media_liga',
    'local_last1': 'local_last1',
    'visitante_last1': 'visitante_last1',
    'corners_vs_rival': 'corners_vs_rival',
    'equipo_local_id': 'equipo_local_id',
    'equipo_visitante_id': 'equipo_visitante_id'
};

// Obtener último partido de la BD
async function getLastMatch(id_local, id_visitante) {
    const query = `
        SELECT
        local_avg_last5,
        visitante_avg_last5,
        ratio_ataques_peligrosos,
        eficiencia_corner_local,
        posesion_local,
        local_corner_category,
        tiros_bloqueados_local,
        intentos_a_porteria_local,
        visitante_corner_category,
        atajadas_visitante,
        ataques_peligrosos_local,
        atajadas_local,
        intentos_a_porteria_visitante,
        tiros_a_puerta_local,
        tiros_bloqueados_visitante,
        tiros_fuera_local,
        consistencia_corners_local,
        diff_last3_vs_last5_visitante,
        diff_last3_vs_last5_local,
        visitante_avg_last3,
        local_avg_last3,
        last3_vs_media_liga,
        local_last1,
        visitante_last1,
        corners_vs_rival,
        equipo_local_id,
        equipo_visitante_id,
        fecha
    FROM corners_tabla
    WHERE equipo_local_id = $1 AND equipo_visitante_id = $2
    ORDER BY fecha DESC
    LIMIT 1

    `;

    const { rows } = await pool.query(query, [id_local, id_visitante]);

    if (rows.length === 0) {
        return null;
    }
    return rows[0];
}

// Preparar datos para enviar a Python
function prepareModelInput(matchData) {
    const modelInput = {};
    for (const [dbCol, modelFeature] of Object.entries(FEATURE_MAP)) {
        modelInput[modelFeature] = matchData[dbCol] !== undefined ? matchData[dbCol] : 0;
    }
    return modelInput;
}

// Ejecutar script Python y obtener predicción
function runPythonModel(modelInput) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, 'python_model', 'predict.py');
        const py = spawn('python', [scriptPath]);

        let result = '';
        let error = '';

        py.stdout.on('data', data => result += data.toString());
        py.stderr.on('data', data => error += data.toString());

        py.on('close', code => {
            if (code !== 0) {
                return reject(new Error(error || `Python error (code ${code})`));
            }
            try {
                const parsed = JSON.parse(result);
                resolve(parsed);
            } catch (err) {
                reject(err);
            }
        });

        py.stdin.write(JSON.stringify(modelInput));
        py.stdin.end();
    });
}

// Función principal para usar en server.js
async function predictor(id_local, id_visitante) {
    const lastMatch = await getLastMatch(id_local, id_visitante);
    if (!lastMatch) {
        throw new Error('No se encontraron datos para estos equipos');
    }

    const modelInput = prepareModelInput(lastMatch);
    const prediction = await runPythonModel(modelInput);

    return {
        prediction,
        historico: {
            resultado: lastMatch.goles_local !== undefined && lastMatch.goles_visitante !== undefined
                ? `${lastMatch.goles_local} - ${lastMatch.goles_visitante}`
                : 'datos no disponibles',
            corners: lastMatch.corners_vs_rival !== undefined ? lastMatch.corners_vs_rival : 'datos no disponibles'
        }
    };
}

module.exports = { predictor };
