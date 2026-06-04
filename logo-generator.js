// Logo Generator for ZumoGo — v1.2
// Usa ZumoGo_LOGO.png (logo real) y ZumoGo_ICON.png (ícono cuadrado).
// Emite 'zumoLogoReady' cuando el logo está listo en el DOM.

(function () {
    const LOGO_SRC  = 'ZumoGo_LOGO.png';   // Logo completo (splash)
    const ICON_SRC  = 'ZumoGo_ICON.png';   // Ícono cuadrado (navbar / auth)

    function applyLogo() {
        // Splash: reemplaza el canvas por la imagen real
        const splash = document.getElementById('splash');
        if (splash) {
            const canvas = document.getElementById('logoCanvas');
            if (canvas) {
                const splashImg = document.createElement('img');
                splashImg.src = LOGO_SRC;
                splashImg.alt = 'ZumoGo — Escuela Bar App';
                splashImg.style.cssText = `
                    width: 280px;
                    max-width: 90vw;
                    margin-bottom: 20px;
                    border-radius: 12px;
                    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
                `;
                splashImg.onload = () => {
                    window.dispatchEvent(new Event('zumoLogoReady'));
                };
                splashImg.onerror = () => {
                    // Fallback: dibujar en canvas si la imagen no carga
                    _fallbackCanvas(canvas);
                    window.dispatchEvent(new Event('zumoLogoReady'));
                };
                canvas.replaceWith(splashImg);
            }
        }

        // Auth layer: ícono cuadrado junto al formulario
        const logoApp = document.getElementById('logoApp');
        if (logoApp) {
            logoApp.src = ICON_SRC;
            logoApp.alt = 'ZumoGo';
            logoApp.onerror = () => { logoApp.src = LOGO_SRC; };
        }
    }

    // Fallback canvas (solo si el PNG no carga)
    function _fallbackCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        const s = canvas.width, cx = s / 2, cy = s / 2;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, s, s);
        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Zumo', cx, cy - 24);
        ctx.fillStyle = '#7dc738';
        ctx.fillText('Go', cx, cy + 36);
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, s / 2.8, 0, Math.PI * 2);
        ctx.stroke();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLogo);
    } else {
        applyLogo();
    }
})();
