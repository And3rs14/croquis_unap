"""
Genera carpas_data.js leyendo el Excel de distribución de carpas.
Ejecutar: python generate_data.py
"""
import openpyxl, json, re, os

EXCEL = "Distribución_de_carpas_02062026.xlsx"
OUT   = "carpas_data.js"

# Normalización de rubros: corrige typos del Excel
RUBRO_MAP = {
    "Accesocios / Tejidos":                          "Accesorios / Tejidos",
    "Accesorios / Bisuteria":                        "Accesorios / Bisutería",
    "Comida / Bebidas Alcoholicas":                  "Comida / Bebidas Alcohólicas",
    "Comida / Bebidas Alcoholicas / Refrigeración":  "Comida / Bebidas Alcohólicas / Refrigeración",
    "Comida / Porductos":                            "Comida / Productos",
    "Comida / Comida":                               "Comida / Platos",
    "Exposición / Entre del Estado":                 "Exposición / Ente del Estado",
    "Expisición / Empresa":                          "Exposición / Empresa",
}

def normalizar_rubro(r):
    return RUBRO_MAP.get(r, r)

wb = openpyxl.load_workbook(EXCEL, data_only=True)
ws = wb.worksheets[0]
rows = list(ws.iter_rows(values_only=True))

carpas = {}
current_key = None          # rastrear carpa actual (celdas combinadas)

for row in rows[1:]:
    if not any(row):
        continue

    # Columna A: solo tiene valor en la primera fila de cada carpa (celda combinada)
    carpa_raw = str(row[0]).strip() if row[0] else ""
    m = re.search(r"(\d+)", carpa_raw)
    if m:
        current_key = "C" + m.group(1)   # nueva carpa encontrada

    if not current_key:
        continue                           # aún no tenemos carpa

    stand_num = row[1]
    rubro     = normalizar_rubro(str(row[2]).strip() if row[2] else "")
    proyecto  = str(row[3]).strip() if row[3] else ""

    if not proyecto:                       # fila sin proyecto, saltar
        continue

    if current_key not in carpas:
        carpas[current_key] = {"carpa": current_key, "stands": []}
    carpas[current_key]["stands"].append({
        "stand":    stand_num,
        "proyecto": proyecto,
        "rubro":    rubro,
    })

js = "const carpasData = " + json.dumps(carpas, ensure_ascii=False, indent=2) + ";\n"

with open(OUT, "w", encoding="utf-8") as f:
    f.write(js)

print(f"OK: {len(carpas)} carpas -> {OUT}  ({os.path.getsize(OUT)//1024} KB)")
