document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // 2. Entrance Animations (Faster)
    const tl = gsap.timeline();

    tl.to('body', { opacity: 1, duration: 0.1 })
        .from('.reveal-text', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        })
        .from('.reveal-up', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out"
        }, "-=0.4");

    document.body.classList.remove('loading');

    // Panel Selection Logic
    const opSelector = document.getElementById('operation-selector');
    const panels = document.querySelectorAll('.op-panel');

    opSelector.addEventListener('change', (e) => {
        const selectedId = e.target.value;
        panels.forEach(panel => {
            if (panel.id === selectedId) {
                panel.style.display = 'block';
                // Trigger a small animation
                gsap.from(panel, { opacity: 0, y: 10, duration: 0.3 });
            } else {
                panel.style.display = 'none';
            }
        });

        // Clear results when switching views
        const resultsGrid = document.getElementById('results-grid');
        const labelConteo = document.getElementById('label-conteo');
        if (resultsGrid) resultsGrid.innerHTML = '<div class="empty-state"><p>Los resultados se mostrarán aquí</p></div>';
        if (labelConteo) labelConteo.textContent = 'Cadenas: 0';
    });

    // 3. Generator Logic
    const btn = document.getElementById('btn-generar');
    const resultsGrid = document.getElementById('results-grid');
    const labelConteo = document.getElementById('label-conteo');
    let lastLanguage = [];

    // Problem 2 UI Elements
    const btnPertenece = document.getElementById('btn-pertenece');
    const cadenaTest = document.getElementById('cadena_test');
    const perteneceResult = document.getElementById('pertenece-result');

    // Problem 3 & 4 UI Elements
    const btnUnion = document.getElementById('btn-union');
    const btnConcat = document.getElementById('btn-concat');
    const l1Input = document.getElementById('l1_input');
    const l2Input = document.getElementById('l2_input');

    // Problem 5 & 6 UI Elements
    const btnKleene = document.getElementById('btn-kleene');
    const btnKleenePlus = document.getElementById('btn-kleene-plus');
    const lStarInput = document.getElementById('l_star_input');
    const starMaxIter = document.getElementById('star_max_iter');

    // Problem 7 UI Elements
    const btnCrecimiento = document.getElementById('btn-crecimiento');
    const lCrecimientoInput = document.getElementById('l_crecimiento_input');

    btn.addEventListener('click', async () => {
        const alfabeto = document.getElementById('alfabeto').value;
        const max_len = document.getElementById('max_len').value;

        // UI Feedback
        btn.disabled = true;
        btn.querySelector('.btn-text').textContent = 'Procesando...';

        try {
            const response = await fetch('/problema1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alfabeto, max_len })
            });

            const data = await response.json();
            lastLanguage = data.resultado; // Store the generated language

            // Render Results
            resultsGrid.innerHTML = '';
            labelConteo.textContent = `Cadenas: ${data.conteo}`;

            if (data.resultado.length === 0) {
                resultsGrid.innerHTML = '<div class="empty-state">No se generaron cadenas.</div>';
            } else {
                data.resultado.forEach(str => {
                    const div = document.createElement('div');
                    div.className = 'token';

                    if (str === "") {
                        div.innerHTML = '&lambda;';
                        div.title = 'Cadena Vacía';
                    } else {
                        div.textContent = str;
                    }
                    resultsGrid.appendChild(div);
                });

                // Fast Reveal
                gsap.from('.token', {
                    opacity: 0,
                    y: 10,
                    duration: 0.3,
                    stagger: {
                        each: 0.02,
                        grid: "auto"
                    },
                    ease: "power1.out"
                });
            }

        } catch (error) {
            console.error('Error:', error);
            resultsGrid.innerHTML = '<div class="empty-state" style="color: #ef4444;">ERROR</div>';
        } finally {
            btn.disabled = false;
            btn.querySelector('.btn-text').textContent = 'Generar Cadenas';
        }
    });

    btnPertenece.addEventListener('click', async () => {
        const cadena = cadenaTest.value;

        if (lastLanguage.length === 0) {
            perteneceResult.innerHTML = '<span style="color: #ef4444;">Primero debes generar un lenguaje (P.1)</span>';
            return;
        }

        btnPertenece.disabled = true;
        btnPertenece.querySelector('.btn-text').textContent = '...';

        try {
            const response = await fetch('/problema2', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cadena, lenguaje: lastLanguage })
            });

            const data = await response.json();

            if (data.pertenece) {
                perteneceResult.innerHTML = `<span style="color: #10b981;">✅ La cadena '${cadena === "" ? "λ" : cadena}' <b>PERTENECE</b> al lenguaje generado.</span>`;
            } else {
                perteneceResult.innerHTML = `<span style="color: #ef4444;">❌ La cadena '${cadena === "" ? "λ" : cadena}' <b>NO PERTENECE</b>.</span>`;
            }

        } catch (error) {
            console.error('Error in Problem 2:', error);
            perteneceResult.innerHTML = '<span style="color: #ef4444;">ERROR de conexión</span>';
        } finally {
            btnPertenece.disabled = false;
            btnPertenece.querySelector('.btn-text').textContent = 'Verificar';
        }
    });

    // Problem 3 Logic
    btnUnion.addEventListener('click', async () => {
        const l1 = l1Input.value;
        const l2 = l2Input.value;

        btnUnion.disabled = true;
        btnUnion.querySelector('.btn-text').textContent = 'Procesando...';

        try {
            const response = await fetch('/problema3', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ l1, l2 })
            });

            const data = await response.json();

            // Re-render Results in the main grid for visual consistency
            resultsGrid.innerHTML = '';
            labelConteo.textContent = `Elementos en la Unión: ${data.conteo}`;

            if (data.resultado.length === 0) {
                resultsGrid.innerHTML = '<div class="empty-state">La unión está vacía.</div>';
            } else {
                data.resultado.forEach(str => {
                    const div = document.createElement('div');
                    div.className = 'token';

                    if (str === "") {
                        div.innerHTML = '&lambda;';
                        div.title = 'Cadena Vacía';
                    } else {
                        div.textContent = str;
                    }
                    resultsGrid.appendChild(div);
                });

                // Fast Reveal
                gsap.from('.token', {
                    opacity: 0,
                    y: 10,
                    duration: 0.3,
                    stagger: {
                        each: 0.02,
                        grid: "auto"
                    },
                    ease: "power1.out"
                });
            }

        } catch (error) {
            console.error('Error in Problem 3:', error);
            resultsGrid.innerHTML = '<div class="empty-state" style="color: #ef4444;">ERROR</div>';
        } finally {
            btnUnion.disabled = false;
            btnUnion.querySelector('.btn-text').textContent = 'Unir L1 ∪ L2';
        }
    });

    // Problem 4 Logic
    btnConcat.addEventListener('click', async () => {
        const l1 = l1Input.value;
        const l2 = l2Input.value;

        btnConcat.disabled = true;
        btnConcat.querySelector('.btn-text').textContent = 'Procesando...';

        try {
            const response = await fetch('/problema4', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ l1, l2 })
            });

            const data = await response.json();

            // Re-render Results in the main grid
            resultsGrid.innerHTML = '';
            labelConteo.textContent = `Elementos en la Concatenación: ${data.conteo}`;

            if (data.resultado.length === 0) {
                resultsGrid.innerHTML = '<div class="empty-state">El resultado está vacío.</div>';
            } else {
                data.resultado.forEach(str => {
                    const div = document.createElement('div');
                    div.className = 'token';

                    if (str === "") {
                        div.innerHTML = '&lambda;';
                        div.title = 'Cadena Vacía';
                    } else {
                        div.textContent = str;
                    }
                    resultsGrid.appendChild(div);
                });

                // Fast Reveal
                gsap.from('.token', {
                    opacity: 0,
                    y: 10,
                    duration: 0.3,
                    stagger: {
                        each: 0.02,
                        grid: "auto"
                    },
                    ease: "power1.out"
                });
            }

        } catch (error) {
            console.error('Error in Problem 4:', error);
            resultsGrid.innerHTML = '<div class="empty-state" style="color: #ef4444;">ERROR</div>';
        } finally {
            btnConcat.disabled = false;
            btnConcat.querySelector('.btn-text').textContent = 'Concatenar L1 • L2';
        }
    });

    // Problem 5 Logic
    btnKleene.addEventListener('click', async () => {
        const lenguaje = lStarInput.value;
        const max_iter = starMaxIter.value;

        btnKleene.disabled = true;
        btnKleene.querySelector('.btn-text').textContent = 'Procesando...';

        try {
            const response = await fetch('/problema5', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lenguaje, max_iter })
            });

            const data = await response.json();

            // Re-render Results in the main grid
            resultsGrid.innerHTML = '';
            labelConteo.textContent = `Elementos en L*: ${data.conteo}`;

            if (data.resultado.length === 0) {
                resultsGrid.innerHTML = '<div class="empty-state">El resultado está vacío.</div>';
            } else {
                data.resultado.forEach(str => {
                    const div = document.createElement('div');
                    div.className = 'token';

                    if (str === "") {
                        div.innerHTML = '&lambda;';
                        div.title = 'Cadena Vacía';
                    } else {
                        div.textContent = str;
                    }
                    resultsGrid.appendChild(div);
                });

                // Fast Reveal
                gsap.from('.token', {
                    opacity: 0,
                    y: 10,
                    duration: 0.3,
                    stagger: {
                        each: 0.02,
                        grid: "auto"
                    },
                    ease: "power1.out"
                });
            }

        } catch (error) {
            console.error('Error in Problem 5:', error);
            resultsGrid.innerHTML = '<div class="empty-state" style="color: #ef4444;">ERROR</div>';
        } finally {
            btnKleene.disabled = false;
            btnKleene.querySelector('.btn-text').textContent = 'Generar L* (Con λ)';
        }
    });

    // Problem 6 Logic
    btnKleenePlus.addEventListener('click', async () => {
        const lenguaje = lStarInput.value;
        const max_iter = starMaxIter.value;

        btnKleenePlus.disabled = true;
        btnKleenePlus.querySelector('.btn-text').textContent = 'Procesando...';

        try {
            const response = await fetch('/problema6', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lenguaje, max_iter })
            });

            const data = await response.json();

            // Re-render Results in the main grid
            resultsGrid.innerHTML = '';
            labelConteo.textContent = `Elementos en L⁺: ${data.conteo}`;

            if (data.resultado.length === 0) {
                resultsGrid.innerHTML = '<div class="empty-state">El resultado está vacío.</div>';
            } else {
                data.resultado.forEach(str => {
                    const div = document.createElement('div');
                    div.className = 'token';

                    if (str === "") {
                        div.innerHTML = '&lambda;';
                        div.title = 'Cadena Vacía';
                    } else {
                        div.textContent = str;
                    }
                    resultsGrid.appendChild(div);
                });

                // Fast Reveal
                gsap.from('.token', {
                    opacity: 0,
                    y: 10,
                    duration: 0.3,
                    stagger: {
                        each: 0.02,
                        grid: "auto"
                    },
                    ease: "power1.out"
                });
            }

        } catch (error) {
            console.error('Error in Problem 6:', error);
            resultsGrid.innerHTML = '<div class="empty-state" style="color: #ef4444;">ERROR</div>';
        } finally {
            btnKleenePlus.disabled = false;
            btnKleenePlus.querySelector('.btn-text').textContent = 'Generar L⁺ (Sin λ)';
        }
    });

    // Problem 7 Logic
    if (btnCrecimiento) {
        btnCrecimiento.addEventListener('click', async () => {
            const lenguaje = lCrecimientoInput.value;

            btnCrecimiento.disabled = true;
            btnCrecimiento.querySelector('.btn-text').textContent = 'Procesando...';

            try {
                const response = await fetch('/problema7', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lenguaje })
                });

                const data = await response.json();

                // Re-render Results in the main grid
                resultsGrid.innerHTML = '';
                labelConteo.textContent = `Reporte de Crecimiento:`;

                data.resultado.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'token';
                    // Inline styles for this specific result format
                    div.style.flexDirection = 'column';
                    div.style.alignItems = 'flex-start';
                    div.style.textAlign = 'left';
                    div.style.gap = '5px';

                    div.innerHTML = `
                        <div style="font-weight: 800; color: var(--primary);">Iteración ${item.iteracion}</div>
                        <div style="color: var(--text-white); font-size: 1.1rem;">${item.cantidad} cadenas</div>
                    `;
                    resultsGrid.appendChild(div);
                });

                // Fast Reveal
                gsap.from('.token', {
                    opacity: 0,
                    y: 10,
                    duration: 0.3,
                    stagger: {
                        each: 0.05,
                        grid: "auto"
                    },
                    ease: "power1.out"
                });

            } catch (error) {
                console.error('Error in Problem 7:', error);
                resultsGrid.innerHTML = '<div class="empty-state" style="color: #ef4444;">ERROR</div>';
            } finally {
                btnCrecimiento.disabled = false;
                btnCrecimiento.querySelector('.btn-text').textContent = 'Analizar Crecimiento';
            }
        });
    }

    // Spotlight effect simplification
    document.addEventListener('mousemove', (e) => {
        document.querySelectorAll('.card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
});
