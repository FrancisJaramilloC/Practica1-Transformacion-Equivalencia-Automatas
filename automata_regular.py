def validar_lenguaje_regular(cadena):
    # Transiciones: (estado, simbolo) -> siguiente_estado
    transiciones = {
        ('q0', 'a'): 'q0',
        ('q0', 'b'): 'q1',
        ('q1', 'b'): 'q1',
    }
    
    estado = 'q0'
    for simbolo in cadena:
        # obtener el estado siguiente
        estado = transiciones.get((estado, simbolo), 'error') #da error si no existe la transicion
        if estado == 'error':
            break
    return estado == 'q1'

def probar_automata():
    cadenas_prueba = ["aaabb", "bbb", "aabba", "aaa"]
    print(f"{'Cadena':<10} | {'Resultado':<10}")
    print("-" * 23)
    
    for s in cadenas_prueba:
        resultado = "Aceptada" if validar_lenguaje_regular(s) else "Rechazada"
        print(f"{s:<10} | {resultado:<10}")

if __name__ == "__main__":
    probar_automata()