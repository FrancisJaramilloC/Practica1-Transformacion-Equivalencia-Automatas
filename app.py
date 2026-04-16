from flask import Flask, render_template, request, jsonify
from logic.generador import generar_cadenas

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/problema1', methods=['POST'])
def problema1():
    data = request.get_json()
    alfabeto_raw = data.get('alfabeto', '')
    max_len = int(data.get('max_len', 0))
    
    # Procesar alfabeto: quitar espacios y separar por comas
    alfabeto = [s.strip() for s in alfabeto_raw.split(',') if s.strip()]
    
    # Ejecutar lógica (Backend puro)
    resultado = generar_cadenas(alfabeto, max_len)
    
    return jsonify({
        'resultado': resultado,
        'conteo': len(resultado)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
