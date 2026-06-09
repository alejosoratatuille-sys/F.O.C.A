/**
 * ZumoGo - Main Application Logic
 */

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('ZumoGo initializing...');
    
    // Set today's date
    document.getElementById('today-date').textContent = getTodayFormatted();
    
    // Render menu
    renderMenu();
    
    // Render pickup times
    renderPickupTimes();
    
    // Update UI
    updateCartDisplay();
    updateCoinsDisplay();
    updateProfileDisplay();
    updateHistoryDisplay();
}

/**
 * Render menu items
 */
function renderMenu(category = 'all') {
    const menuContainer = document.getElementById('menu-items');
    const items = filterMenuByCategory(category);
    
    if (items.length === 0) {
        menuContainer.innerHTML = '<p class="empty-state">No hay items disponibles</p>';
        return;
    }
    
    menuContainer.innerHTML = items.map(item => `
        <div class="menu-item">
            <div class="item-header">
                <span class="item-emoji">${item.emoji}</span>
                <span class="item-stock">${item.stock} disponibles</span>
            </div>
            <h3 class="item-name">${item.name}</h3>
            <p class="item-description">${item.description}</p>
            <div class="item-footer">
                <span class="item-price">${formatCurrency(item.price)}</span>
                <button class="btn btn-sm" onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                    Agregar +
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Render pickup times
 */
function renderPickupTimes() {
    const timeContainer = document.getElementById('pickup-times');
    timeContainer.innerHTML = ZUMOGO_DATA.pickupTimes.map(time => `
        <button class="time-btn" onclick="selectPickupTime('${time.time}')">
            🕐 ${time.label}
        </button>
    `).join('');
}

/**
 * Add item to cart
 */
function addToCart(item) {
    cart.addItem(item, 1);
    updateCartDisplay();
    showNotification(`${item.name} agregado al carrito`, 'success');
}

/**
 * Update cart display
 */
function updateCartDisplay() {
    const items = cart.getItems();
    const count = cart.getItemCount();
    const cartContainer = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartSummary = document.getElementById('cart-summary');
    
    // Update cart badge
    document.getElementById('cart-count').textContent = count;
    
    if (items.length === 0) {
        cartContainer.innerHTML = '<p class="empty-state">Tu carrito está vacío</p>';
        checkoutBtn.style.display = 'none';
        cartSummary.style.display = 'none';
        return;
    }
    
    // Render cart items
    cartContainer.innerHTML = items.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <span class="item-name">${item.emoji} ${item.name}</span>
                <span class="item-price">${formatCurrency(item.price)}</span>
            </div>
            <div class="item-controls">
                <button onclick="decreaseQuantity('${item.id}')" class="qty-btn">−</button>
                <span class="qty-display">${item.quantity}</span>
                <button onclick="increaseQuantity('${item.id}')" class="qty-btn">+</button>
                <button onclick="removeFromCart('${item.id}')" class="btn-remove">✕</button>
            </div>
            <div class="item-total">${formatCurrency(item.price * item.quantity)}</div>
        </div>
    `).join('');
    
    // Update summary
    const subtotal = cart.getSubtotal();
    const tax = cart.getTax();
    const total = cart.getTotalWithTax();
    
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('total').textContent = formatCurrency(total);
    
    checkoutBtn.style.display = 'block';
    cartSummary.style.display = 'block';
}

/**
 * Increase quantity
 */
function increaseQuantity(itemId) {
    const item = cart.getItems().find(i => i.id === itemId);
    if (item) {
        cart.updateQuantity(itemId, item.quantity + 1);
        updateCartDisplay();
    }
}

/**
 * Decrease quantity
 */
function decreaseQuantity(itemId) {
    const item = cart.getItems().find(i => i.id === itemId);
    if (item && item.quantity > 1) {
        cart.updateQuantity(itemId, item.quantity - 1);
        updateCartDisplay();
    }
}

/**
 * Remove from cart
 */
function removeFromCart(itemId) {
    cart.removeItem(itemId);
    updateCartDisplay();
    showNotification('Artículo removido', 'success');
}

/**
 * Filter menu by category
 */
function filterByCategory(category) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Render filtered menu
    renderMenu(category);
}

/**
 * Select pickup time
 */
function selectPickupTime(time) {
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Store selected time
    storage.set('selected_pickup_time', time);
}

/**
 * Update coins display
 */
function updateCoinsDisplay() {
    const balance = user.getCoinsBalance();
    document.getElementById('coins-display').textContent = `🪙 ${balance}`;
    document.getElementById('coins-available').textContent = `Disponibles: ${balance}`;
}

/**
 * Process payment
 */
async function processPayment() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const pickupTime = storage.get('selected_pickup_time');
    const cartItems = cart.getItems();
    const total = cart.getTotalWithTax();
    
    // Validation
    if (!pickupTime) {
        showNotification('Por favor selecciona una hora de retiro', 'error');
        return;
    }
    
    if (!isCartValid()) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    // Check coins balance if paying with coins
    if (paymentMethod === 'coins') {
        if (user.getCoinsBalance() < total) {
            showNotification('No tienes suficientes coins', 'error');
            return;
        }
    }
    
    // Show processing state
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Procesando...';
    
    try {
        // Simulate payment
        const payment = await simulatePayment(total, paymentMethod);
        
        if (payment.success) {
            // Deduct coins if applicable
            if (paymentMethod === 'coins') {
                user.spendCoins(total);
            }
            
            // Create order
            const order = orders.createOrder(cartItems, pickupTime, paymentMethod, total);
            
            // Update UI
            user.incrementOrders();
            updateCoinsDisplay();
            updateProfileDisplay();
            
            // Show confirmation
            showOrderConfirmation(order);
            
            // Clear cart
            cart.clear();
            updateCartDisplay();
        } else {
            showNotification('El pago falló. Intenta de nuevo', 'error');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Error al procesar el pago', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Confirmar pago';
    }
}

/**
 * Show order confirmation
 */
function showOrderConfirmation(order) {
    // Populate confirmation details
    document.getElementById('order-code').textContent = order.orderCode;
    document.getElementById('order-time').textContent = order.pickupTime;
    document.getElementById('order-amount').textContent = formatCurrency(order.amount);
    
    // Generate and display QR code
    const qrUrl = generateQRCode(order.orderCode, 250);
    document.getElementById('qr-code').src = qrUrl;
    
    // Show PayMon balance (simulated)
    const paymonBalance = 50000 + Math.floor(Math.random() * 100000);
    document.getElementById('order-paymon-balance').textContent = formatCurrency(paymonBalance);
    document.getElementById('balance-details').textContent = `Transacción: ${order.id} | Método: ${order.paymentMethod}`;
    
    // Show PayMon balance in payment screen too
    document.getElementById('paymon-balance').textContent = formatCurrency(paymonBalance);
    
    // Switch to confirmation screen
    switchScreen('confirmation');
}

/**
 * Copy QR code
 */
function copyQRCode() {
    const code = document.getElementById('order-code').textContent;
    copyToClipboard(code);
}

/**
 * Make new order
 */
function makeNewOrder() {
    switchScreen('menu');
    storage.set('selected_pickup_time', null);
}

/**
 * Update profile display
 */
function updateProfileDisplay() {
    const userObj = user.getUser();
    const balance = user.getCoinsBalance();
    const totalOrders = userObj.totalOrders;
    
    document.getElementById('profile-info').innerHTML = `
        <div class="info-row">
            <span class="label">Nombre:</span>
            <span class="value">${userObj.name}</span>
        </div>
        <div class="info-row">
            <span class="label">ID Estudiante:</span>
            <span class="value">${userObj.studentId}</span>
        </div>
        <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">${userObj.email}</span>
        </div>
        <div class="info-row">
            <span class="label">Miembro desde:</span>
            <span class="value">${formatDate(userObj.joinedDate)}</span>
        </div>
    `;
    
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('available-balance').textContent = `${balance} 🪙`;
}

/**
 * Update history display
 */
function updateHistoryDisplay() {
    const orderHistory = orders.getOrderHistory();
    const historyContainer = document.getElementById('history-items');
    
    if (orderHistory.length === 0) {
        historyContainer.innerHTML = '<p class="empty-state">Sin pedidos anteriores</p>';
        return;
    }
    
    historyContainer.innerHTML = orderHistory.map(order => `
        <div class="history-item">
            <div class="history-header">
                <span class="order-code">${order.orderCode}</span>
                <span class="order-date">${new Date(order.timestamp).toLocaleDateString('es-CO')}</span>
            </div>
            <div class="history-details">
                <span>Hora: ${order.pickupTime}</span>
                <span class="order-total">${formatCurrency(order.amount)}</span>
                <span class="order-status">${order.status}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Clear all data
 */
function clearAllData() {
    if (confirm('¿Estás seguro? Esto eliminará todo tu historial y datos.')) {
        storage.clear();
        location.reload();
    }
}

/**
 * Update PayMon balance display on payment screen
 */
function updatePayMonBalance() {
    const balance = 50000 + Math.floor(Math.random() * 100000);
    const status = balance > 30000 ? 'Disponible' : balance > 10000 ? 'Bajo' : 'Crítico';
    document.getElementById('paymon-balance').textContent = formatCurrency(balance);
    document.getElementById('balance-status').textContent = status;
}

// Initialize PayMon balance when payment screen is shown
document.addEventListener('click', (e) => {
    if (e.target.onclick && e.target.onclick.toString().includes('payment')) {
        updatePayMonBalance();
    }
});
