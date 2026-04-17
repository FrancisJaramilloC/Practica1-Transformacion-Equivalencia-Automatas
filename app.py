from flask import Flask, render_template, request, jsonify
from back.logic.generador import generar_cadenas
from back.logic.pertenencia import pertenece
from back.logic.union import union_lenguajes
from back.logic.concatenacion import concatenacion_lenguajes
from back.logic.kleene import kleene_star
from back.logic.kleene_plus import kleene_plus
from back.logic.analisis_crecimiento import analizar_crecimiento

app = Flask(__name__, 
            template_folder='front/templates', 
            static_folder='front/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/problema1', methods=['POST'])
def problema1():
    data = request.get_json()
    alfabeto_raw = data.get('alfabeto', '')
    max_len = int(data.get('max_len', 0))
    
    #procesaa alfabeto
    alfabeto = [s.strip() for s in alfabeto_raw.split(',') if s.strip()]
    
    #ejecuta logica
    resultado = generar_cadenas(alfabeto, max_len)
    
    #log en terminal
    print(f"\n--- Cadenas Generadas (Σ={alfabeto}, n={max_len}) ---")
    print(resultado)
    print(f"Total: {len(resultado)}\n")
    
    return jsonify({
        'resultado': resultado,
        'conteo': len(resultado)
    })

@app.route('/problema2', methods=['POST'])
def problema2():
    data = request.get_json()
    cadena = data.get('cadena', '')
    lenguaje = data.get('lenguaje', [])
    
    if cadena == 'λ' or cadena == '&lambda;':
        cadena = ""
        
    resultado = pertenece(cadena, lenguaje)

    return jsonify({
        'pertenece': resultado
    })

@app.route('/problema3', methods=['POST'])
def problema3():
    data = request.get_json()
    l1_raw = data.get('l1', [])
    l2_raw = data.get('l2', [])
    
    if isinstance(l1_raw, str):
        l1 = [s.strip() for s in l1_raw.split(',')]
    else:
        l1 = l1_raw
        
    if isinstance(l2_raw, str):
        l2 = [s.strip() for s in l2_raw.split(',')]
    else:
        l2 = l2_raw
        
    resultado = union_lenguajes(l1, l2)
    
    return jsonify({
        'resultado': resultado,
        'conteo': len(resultado)
    })

@app.route('/problema4', methods=['POST'])
def problema4():
    data = request.get_json()
    l1_raw = data.get('l1', [])
    l2_raw = data.get('l2', [])
    
    def procesar_lista(lista_raw):
        if isinstance(lista_raw, str):
            elementos = [s.strip() for s in lista_raw.split(',')]
        else:
            elementos = lista_raw
        
        return ["" if e == "λ" or e == "&lambda;" else e for e in elementos]

    l1 = procesar_lista(l1_raw)
    l2 = procesar_lista(l2_raw)
        
    resultado = concatenacion_lenguajes(l1, l2)
    
    return jsonify({
        'resultado': resultado,
        'conteo': len(resultado)
    })

@app.route('/problema5', methods=['POST'])
def problema5():
    data = request.get_json()
    lenguaje_raw = data.get('lenguaje', [])
    max_iter = int(data.get('max_iter', 0))
    
    if isinstance(lenguaje_raw, str):
        lenguaje = [s.strip() for s in lenguaje_raw.split(',')]
    else:
        lenguaje = lenguaje_raw
        
    lenguaje = ["" if e == "λ" or e == "&lambda;" else e for e in lenguaje]
    
    # Limitar por seguridad
    if max_iter > 10:
        max_iter = 10
        
    resultado = kleene_star(lenguaje, max_iter)
    
    return jsonify({
        'resultado': resultado,
        'conteo': len(resultado)
    })

@app.route('/problema6', methods=['POST'])
def problema6():
    data = request.get_json()
    lenguaje_raw = data.get('lenguaje', [])
    max_iter = int(data.get('max_iter', 0))
    
    if isinstance(lenguaje_raw, str):
        lenguaje = [s.strip() for s in lenguaje_raw.split(',')]
    else:
        lenguaje = lenguaje_raw
        
    lenguaje = ["" if e == "λ" or e == "&lambda;" else e for e in lenguaje]
    
    # Limitar por seguridad
    if max_iter > 10:
        max_iter = 10
        
    resultado = kleene_plus(lenguaje, max_iter)
    
    return jsonify({
        'resultado': resultado,
        'conteo': len(resultado)
    })

@app.route('/problema7', methods=['POST'])
def problema7():
    data = request.get_json()
    lenguaje_raw = data.get('lenguaje', [])
    
    if isinstance(lenguaje_raw, str):
        lenguaje = [s.strip() for s in lenguaje_raw.split(',')]
    else:
        lenguaje = lenguaje_raw
        
    lenguaje = ["" if e == "λ" or e == "&lambda;" else e for e in lenguaje]
    
    analisis = analizar_crecimiento(lenguaje)
    
    return jsonify({
        'resultado': analisis
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
