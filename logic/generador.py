def generar_cadenas(alfabeto, max_len):
    """
    ALGORITMO GenerarCadenas(alfabeto, max_len)
    Genera todas las cadenas sobre el alfabeto hasta longitud n.
    """
    resultado = [""]
    
    for i in range(1, max_len + 1):
        nuevas = []
        for cadena in resultado:
            for simbolo in alfabeto:
                nueva_cadena = cadena + simbolo
                nuevas.append(nueva_cadena)
        
        # CONCATENAR resultado CON nuevas
        resultado.extend(nuevas)
        
    # eliminar duplicados
    final = []
    for elemento in resultado:
        if elemento not in final:
            final.append(elemento)
            
    return final
