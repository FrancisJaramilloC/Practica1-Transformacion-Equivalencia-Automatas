package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

const (
	q0     = 0 //estado inicial
	q25    = 1 //25 centavos
	q50    = 2 //50 centavos
	qError = 3 //estado de error
)

func nombreEstado(estado int) string {
	switch estado {
	case q0:
		return "q0"
	case q25:
		return "q25"
	case q50:
		return "q50"
	case qError:
		return "qError"
	default:
		return "?"
	}
}

//transicion(estado, simbolo) → nuevo estado
func transicion(estado int, simbolo rune) int {
	switch estado {
	case q0:
		if simbolo == 'Q' {
			return q25
		}
		if simbolo == 'C' {
			return q50
		}
		return qError
	case q25:
		if simbolo == 'Q' || simbolo == 'C' {
			return q50
		}
		return qError
	case q50:
		return q0
	case qError:
		return qError
	default:
		return qError
	}
}

//procesa la cadena simbolo x simbolo
func procesarCadena(cadena string) {
	estado := q0
	dispensados := 0

	fmt.Printf("\nCadena: \"%s\"\n", cadena)
	fmt.Printf("Estado inicial: %s\n", nombreEstado(estado))
//bucle que recorre la cadena
	for i, s := range cadena { 
		anterior := estado 
		estado = transicion(estado, s) 
		fmt.Printf("Paso %d: δ(%s, %c) → %s\n", i+1, nombreEstado(anterior), s, nombreEstado(estado))

		if estado == q50 {
			fmt.Println("Producto dispensado (Se regresa el saldo a 0)")
			dispensados++
			estado = q0
		}
	}

	fmt.Printf("Estado final: %s\n", nombreEstado(estado))
	if dispensados > 0 {
		fmt.Printf("Aceptada (Total de productos dispensados: %d)\n", dispensados)
	} else if estado == qError {
		fmt.Println("Rechazada (error)")
	} else {
		fmt.Println("Rechazada (dinero insuficiente)")
	}
}

func main() {
	fmt.Println("Máquina Expendedora")

	//casos de prueba
//	casos := []string{"QQ", "QC", "Q", "C", "QQQQ", "QCQQ", "CQ", "", "QX"}
//	for _, c := range casos {
//		procesarCadena(c)
//	}

	//modo interactivo
	fmt.Println("\n Modo interactivo (escribe 'salir' para terminar) ")
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Print(">> ")
		scanner.Scan()
		entrada := strings.TrimSpace(scanner.Text())
		if strings.ToLower(entrada) == "salir" {
			break
		}
		procesarCadena(strings.ToUpper(entrada))
	}
}
