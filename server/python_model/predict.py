import sys
import json
import pickle
import pandas as pd
import os

#  Columnas que espera el modelo (orden correcto según entrenamiento)
FEATURE_COLUMNS = [
    'local_avg_last5',
    'visitante_avg_last5',
    'ratio_ataques_peligrosos',
    'eficiencia_corner_local',
    'posesion_local',
    'local_corner_category',
    'tiros_bloqueados_local',
    'intentos_a_porteria_local',
    'visitante_corner_category',
    'atajadas_visitante',
    'ataques_peligrosos_local',
    'atajadas_local',
    'intentos_a_porteria_visitante',
    'tiros_a_puerta_local',
    'tiros_bloqueados_visitante',
    'tiros_fuera_local',
    'consistencia_corners_local',
    'diff_last3_vs_last5_visitante',
    'diff_last3_vs_last5_local',
    'visitante_avg_last3',
    'local_avg_last3',
    'last3_vs_media_liga',
    'local_last1',
    'visitante_last1',
    'corners_vs_rival',
    'equipo_local_id',
    'equipo_visitante_id'
]

#  Ruta segura del modelo
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'modelo_lgbm_tiros_de_esquina.pkl')
with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)

def main():
    try:
        raw_input = sys.stdin.read()
        match_data = json.loads(raw_input)

        df = pd.DataFrame([match_data])

        # Añadir columnas faltantes con 0
        for col in FEATURE_COLUMNS:
            if col not in df.columns:
                df[col] = 0

        # Reordenar
        df = df[FEATURE_COLUMNS]

        # Convertir a float para evitar errores de tipo
        df = df.astype(float)

        # Predicción
        prediction = model.predict(df)

        # Asegurar formato lista de listas
        if prediction.ndim == 1:
            prediction = prediction.reshape(-1, prediction.shape[0])

        result = {"prediction": prediction.tolist()}
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
