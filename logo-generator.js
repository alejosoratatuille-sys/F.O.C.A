// Logo Generator for ZumoGo
function generateAndSaveLogo() {
    const canvas = document.getElementById('logoCanvas');
    const ctx = canvas.getContext('2d');
    
    // Tamaño del canvas
    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 3;
    
    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // ZUMO - Color Verde
    const zumoGreenColor = '#22c55e';
    ctx.fillStyle = zumoGreenColor;
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    const zumoText = 'Zumo';
    const zumoX = centerX - 70;
    const zumoY = centerY - 20;
    ctx.fillText(zumoText, zumoX, zumoY);
    
    // GO - Color Rosado
    const goPinkColor = '#ec4899';
    ctx.fillStyle = goPinkColor;
    ctx.font = 'bold 80px Arial';
    const goText = 'Go';
    const goX = centerX - 20;
    const goY = centerY + 20;
    ctx.fillText(goText, goX, goY);
    
    // Borde decorativo con gradiente
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // Guardar logo en localStorage
    try {
        const logoData = canvas.toDataURL('image/png');
        localStorage.setItem('zumogoLogo', logoData);
        console.log('Logo guardado exitosamente');
    } catch (error) {
        console.error('Error al guardar logo:', error);
    }
    
    return canvas.toDataURL('image/png');
}

// Ejecutar generador al cargar
document.addEventListener('DOMContentLoaded', () => {
    const logoDataUrl = generateAndSaveLogo();
    const logoImg = document.getElementById('logoApp');
    if (logoImg) {
        logoImg.src = logoDataUrl;
    }
});
