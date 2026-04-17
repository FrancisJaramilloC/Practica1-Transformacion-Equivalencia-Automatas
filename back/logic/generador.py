def generar_cadenas(alfabeto, max_len):
    #cadena para inicar el bucle
    resultado = [""]
    
    for i in range(1, max_len + 1):
        nuevas = []
        for cadena in resultado:
            for simbolo in alfabeto:
                nueva_cadena = cadena + simbolo
                nuevas.append(nueva_cadena)
        # une las cadenas nuevas con las anteriores
        resultado.extend(nuevas)
        
    # eliminar duplicados
    final = []

    for elemento in resultado:
        if elemento not in final:
            final.append(elemento)      
    return final