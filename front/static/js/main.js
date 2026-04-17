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

    // 3. Generator Logic
    const btn = document.getElementById('btn-generar');
    const resultsGrid = document.getElementById('results-grid');
    const labelConteo = document.getElementById('label-conteo');

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
