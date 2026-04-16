document.getElementById('btn-generar').addEventListener('click', async () => {
    const alfabeto = document.getElementById('alfabeto').value;
    const max_len = document.getElementById('max_len').value;
    const btn = document.getElementById('btn-generar');
    const resultsGrid = document.getElementById('results-grid');
    const labelConteo = document.getElementById('label-conteo');

    // Estado de carga
    btn.disabled = true;
    btn.textContent = 'Procesando...';
    resultsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center;">Generando...</div>';

    try {
        const response = await fetch('/problema1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                alfabeto: alfabeto,
                max_len: max_len
            })
        });

        const data = await response.json();
        
        // Limpiar
        resultsGrid.innerHTML = '';
        labelConteo.textContent = `Cadenas generadas: ${data.conteo}`;

        data.resultado.forEach(str => {
            const div = document.createElement('div');
            div.className = 'token';
            if (str === "") {
                div.innerHTML = '&lambda;';
                div.classList.add('empty');
            } else {
                div.textContent = str;
            }
            resultsGrid.appendChild(div);
        });

    } catch (error) {
        console.error('Error:', error);
        resultsGrid.innerHTML = '<div style="grid-column: 1 / -1; color: #ef4444;">Error al conectar con el servidor</div>';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Generar Cadenas';
    }
});
