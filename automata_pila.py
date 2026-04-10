def validar_igualdad_ab(cadena):

    pila = []
    # Transiciones: (estado, simbolo) -> siguiente_estado, accion
    transiciones = {
        ('q0', 'a'): ('q0', lambda: pila.append('a')),
        ('q0', 'b'): ('q1', lambda: pila.pop()),
        ('q1', 'b'): ('q1', lambda: pila.pop()),
    }
    estado = 'q0'

    try:
        for simbolo in cadena:
            # obtiene la transicion o lanza error si 'a' despues de 'b'
            estado, accion = transiciones[(estado, simbolo)]
            accion() 
        return len(pila) == 0 # lanza true si el numero de 'a' = 'b' 
    except (KeyError, IndexError):
        return False

def probar_automata_pila():
    cadenas_prueba = ["aabb", "aaabbb", "aab", "bbaa"]
    print(f"{'Cadena':<10} | {'Resultado':<10}")
    print("-" * 23)
    
    for s in cadenas_prueba:
        resultado = "Aceptada" if validar_igualdad_ab(s) else "Rechazada"
        print(f"{s:<10} | {resultado:<10}")

if __name__ == "__main__":
    probar_automata_pila()
