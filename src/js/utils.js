/**
 * ZumoGo - Utility Functions
 */

/**
 * Format currency to local format (COP - Colombian Pesos)
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-CO', options);
}

/**
 * Get today's date formatted
 */
function getTodayFormatted() {
    const today = new Date();
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const dayName = days[today.getDay()];
    const date = today.getDate();
    const month = months[today.getMonth()];
    
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${date} de ${month}`;
}

/**
 * Generate a simple QR code using a third-party API
 */
function generateQRCode(text, size = 200) {
    const encoded = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
}

/**
 * Screen navigation helper
 */
function switchScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.querySelector(`[data-screen="${screenName}"]`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        // Scroll to top
        document.querySelector('.main-content').scrollTop = 0;
    }
}

/**
 * Toggle sidebar menu
 */
function toggleMenu(show) {
    const sidebar = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('menu-overlay');
    
    if (show === undefined) {
        show = !sidebar.classList.contains('open');
    }

    if (show) {
        sidebar.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

/**
 * Validate email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Show notification/toast
 */
function showNotification(message, type = 'success', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#38ADA9' : '#D32F2F'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * Add animation styles to document
 */
function injectAnimations() {
    if (!document.getElementById('toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Validate cart has items
 */
function isCartValid() {
    const cartItems = cart.getItems();
    return cartItems.length > 0 && cartItems.every(item => item.quantity > 0);
}

/**
 * Get menu item by ID
 */
function getMenuItem(itemId) {
    return ZUMOGO_DATA.menu.find(item => item.id === itemId);
}

/**
 * Filter menu items by category
 */
function filterMenuByCategory(category) {
    if (category === 'all') {
        return ZUMOGO_DATA.menu;
    }
    return ZUMOGO_DATA.menu.filter(item => item.category === category);
}

/**
 * Format order summary for display
 */
function formatOrderSummary(items) {
    return items.map(item => {
        const menuItem = getMenuItem(item.id);
        return `${item.quantity}x ${menuItem?.name || 'Artículo'} - ${formatCurrency(item.price * item.quantity)}`;
    });
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copiado al portapapeles', 'success', 2000);
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Copiado al portapapeles', 'success', 2000);
    }
}

/**
 * Check if device is mobile
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Simulate payment processing
 */
async function simulatePayment(amount, method = 'coins') {
    return new Promise((resolve) => {
        // Simulate 2-3 second processing time
        const delay = 2000 + Math.random() * 1000;
        setTimeout(() => {
            resolve({
                success: true,
                transactionId: 'TXN_' + Date.now(),
                method,
                amount,
                timestamp: new Date().toISOString(),
                message: 'Pago procesado exitosamente'
            });
        }, delay);
    });
}

/**
 * Initialize utilities on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    injectAnimations();
});
