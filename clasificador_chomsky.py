from automata_regular import validar_lenguaje_regular
from automata_pila import validar_igualdad_ab

def clasificar_cadena(cadena):
    # definir criterios en orden -> el más complejo primero
    criterios = [
        (validar_igualdad_ab, "Libre de Contexto (Tipo 2)"),
        (validar_lenguaje_regular, "Regular (Tipo 3)")
    ]
    
    # recorremos los criterios y retornamos el primero que coincida
    for validador, descripcion in criterios:
        if validador(cadena):
            return descripcion            
    return "Fuera de Tipo 2 y 3"

def ejecutar_pruebas():
    cadenas_prueba = ["aaabbb", "aaabb", "abc"]
    print(f"{'Cadena':<10} | {'Clasificación de Chomsky'}")
    print("-" * 55)
    
    for s in cadenas_prueba:
        resultado = clasificar_cadena(s)
        print(f"{s:<10} | {resultado}")

if __name__ == "__main__":
    ejecutar_pruebas()