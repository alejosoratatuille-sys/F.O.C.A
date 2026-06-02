// APLICACIÓN ZUMOGO
// Sistema de pedidos, compra y retiro para Zumo&Resto

// ===== LIBRERÍA QR (QRCode.js) =====
if (!window.QRCode) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    document.head.appendChild(script);
}

// ===== CONFIGURACIÓN INICIAL =====
const app = {
    currentUser: null,
    selectedRecreation: 'basica',
    cart: [],
    paymentMethod: 'paymon',
    currentOrderId: null,
    paymonBalance: 500.00, // Saldo simulado de PayMon
    
    // Base de datos de usuarios
    users: JSON.parse(localStorage.getItem('zumogoUsers')) || [
        {
            id: 1,
            names: 'MARÍA EMILIA CARTAGENA LINCANGO',
            email: 'mcartagena@eightacademy.edu.ec',
            password: 'Zumo@2024', // Contraseña segura de ejemplo
            paymonBalance: 500.00,
            createdAt: new Date().toISOString()
        }
    ],
    
    // Menú disponible con imágenes (emojis)
    menu: [
        // Comidas
        { id: 1, name: 'Salchipapas', price: 3.50, stock: 30, category: 'comida', image: '🍟' },
        { id: 2, name: 'Arepas', price: 2.50, stock: 30, category: 'comida', image: '🥠' },
        { id: 3, name: 'Sandwich', price: 3.00, stock: 30, category: 'comida', image: '🥪' },
        { id: 4, name: 'Pan de Chocolate', price: 1.50, stock: 30, category: 'comida', image: '🍪' },
        { id: 5, name: 'Donas', price: 1.00, stock: 30, category: 'comida', image: '🍩' },
        { id: 6, name: 'Ensalada de Frutas', price: 4.00, stock: 30, category: 'comida', image: '🍎' },
        { id: 7, name: 'Pizza', price: 5.00, stock: 30, category: 'comida', image: '🍕' },
        { id: 8, name: 'Nachos con Queso', price: 4.50, stock: 30, category: 'comida', image: '🧀' },
        { id: 9, name: 'Dorilocos', price: 3.00, stock: 30, category: 'comida', image: '🌮' },
        
        // Bebidas
        { id: 10, name: 'Bubble Tea', price: 4.00, stock: 30, category: 'bebida', image: '🧋' },
        { id: 11, name: 'Frozen de Frutas', price: 3.50, stock: 30, category: 'bebida', image: '🧊' },
        { id: 12, name: 'Agua', price: 1.00, stock: 30, category: 'bebida', image: '💧' },
        { id: 13, name: 'Powerade', price: 2.00, stock: 30, category: 'bebida', image: '🥤' },
        { id: 14, name: 'Leche de Sabores', price: 2.50, stock: 30, category: 'bebida', image: '🥛' },
        { id: 15, name: 'Ponymalta', price: 2.00, stock: 30, category: 'bebida', image: '🍼' },
        { id: 16, name: 'Imperial Natura', price: 1.50, stock: 30, category: 'bebida', image: '🍹' },
        { id: 17, name: 'Snack de Papas', price: 1.00, stock: 30, category: 'bebida', image: '🥔' },
        { id: 18, name: 'Snack Chifles Sal', price: 0.75, stock: 30, category: 'bebida', image: '🌽' },
        { id: 19, name: 'Snack Chifles Dulce', price: 0.75, stock: 30, category: 'bebida', image: '🌰' }
    ]
};

// ===== VALIDACIONES =====
function validateNames(names) {
    const cleanNames = names.trim().toUpperCase();
    const regex = /^[A-ZÁÉÍÓÚÑ\s]{3,}$/;
    return regex.test(cleanNames) ? cleanNames : null;
}

function validateEmail(email) {
    const domain = '@eightacademy.edu.ec';
    const localPart = email.trim();
    // Validar que sea un email válido
    const emailRegex = /^[^\s@]+@?$/;
    if (!emailRegex.test(localPart)) return null;
    return localPart + domain;
}

function validatePassword(password) {
    // Mínimo 8 caracteres, mayuscula, numero y simbolo
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

function getPasswordValidationStatus(password) {
    return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[@$!%*?&]/.test(password)
    };
}

// ===== VALIDACIÓN EN TIEMPO REAL DE CONTRASEÑA =====
document.getElementById('signInPassword')?.addEventListener('input', (e) => {
    const password = e.target.value;
    const status = getPasswordValidationStatus(password);
    
    document.getElementById('req-length').style.color = status.length ? '#22c55e' : '#6b7280';
    document.getElementById('req-upper').style.color = status.uppercase ? '#22c55e' : '#6b7280';
    document.getElementById('req-number').style.color = status.number ? '#22c55e' : '#6b7280';
    document.getElementById('req-special').style.color = status.special ? '#22c55e' : '#6b7280';
    
    document.getElementById('req-length').textContent = status.length ? '✓ Mínimo 8 caracteres' : '📄 Mínimo 8 caracteres';
    document.getElementById('req-upper').textContent = status.uppercase ? '✓ Al menos una mayúscula (A-Z)' : '📄 Al menos una mayúscula (A-Z)';
    document.getElementById('req-number').textContent = status.number ? '✓ Al menos un número (0-9)' : '📄 Al menos un número (0-9)';
    document.getElementById('req-special').textContent = status.special ? '✓ Al menos un carácter especial (@$!%*?&)' : '📄 Al menos un carácter especial (@$!%*?&)';
});

// ===== CONVERSIÓN AUTOMÁTICA A MAYÚSCULAS =====
document.getElementById('signInNames')?.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
});

// ===== AUTENTICACIÓN =====
function toggleAuthForms() {
    const signInForm = document.getElementById('signInForm');
    const logInForm = document.getElementById('logInForm');
    signInForm.classList.toggle('hidden');
    logInForm.classList.toggle('hidden');
}

document.getElementById('toLoginLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAuthForms();
});

document.getElementById('toSignupLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAuthForms();
});

// SIGN UP
document.getElementById('signUpBtn')?.addEventListener('click', () => {
    const names = document.getElementById('signInNames').value.trim();
    const email = document.getElementById('signInEmail').value.trim();
    const password = document.getElementById('signInPassword').value;
    const messageDiv = document.getElementById('authMessage');
    
    // Validar nombre
    const validatedNames = validateNames(names);
    if (!validatedNames) {
        showMessage(messageDiv, 'El nombre debe contener solo letras y tener al menos 3 caracteres', 'error');
        return;
    }
    
    // Validar email
    const validatedEmail = validateEmail(email);
    if (!validatedEmail) {
        showMessage(messageDiv, 'Por favor ingresa un correo válido (sin @)', 'error');
        return;
    }
    
    // Validar contraseña
    if (!validatePassword(password)) {
        showMessage(messageDiv, 'La contraseña no cumple todos los requisitos de seguridad', 'error');
        return;
    }
    
    // Verificar si el usuario ya existe
    if (app.users.some(u => u.email === validatedEmail)) {
        showMessage(messageDiv, 'Este correo ya está registrado', 'error');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: app.users.length + 1,
        names: validatedNames,
        email: validatedEmail,
        password: password,
        paymonBalance: 500.00, // Saldo inicial simulado
        createdAt: new Date().toISOString()
    };
    
    app.users.push(newUser);
    localStorage.setItem('zumogoUsers', JSON.stringify(app.users));
    
    // Generar JSON para backend (oculto al usuario)
    const registrationData = {
        status: 'ready_to_register',
        user_data: {
            name: validatedNames,
            email: validatedEmail,
            password_plain: password
        },
        timestamp: new Date().toISOString()
    };
    console.log('%cREGISTRO COMPLETADO - Backend:', 'color: green; font-weight: bold;', JSON.stringify(registrationData, null, 2));
    
    showMessage(messageDiv, '¡Registro exitoso! Tu cuenta ha sido creada. Inicia sesión ahora.', 'success');
    
    // Limpiar formulario
    document.getElementById('signInNames').value = '';
    document.getElementById('signInEmail').value = '';
    document.getElementById('signInPassword').value = '';
    messageDiv.classList.remove('hidden');
    
    setTimeout(() => {
        toggleAuthForms();
        messageDiv.classList.add('hidden');
    }, 3000);
});

// LOGIN
document.getElementById('loginBtn')?.addEventListener('click', () => {
    const email = document.getElementById('logInEmail').value.trim();
    const password = document.getElementById('logInPassword').value;
    const messageDiv = document.getElementById('authMessage');
    
    const validatedEmail = validateEmail(email);
    if (!validatedEmail) {
        showMessage(messageDiv, 'Email inválido', 'error');
        return;
    }
    
    const user = app.users.find(u => u.email === validatedEmail && u.password === password);
    if (!user) {
        showMessage(messageDiv, 'Correo o contraseña incorrectos', 'error');
        return;
    }
    
    // Login exitoso
    app.currentUser = user;
    app.paymonBalance = user.paymonBalance || 500.00;
    showMessage(messageDiv, `¡Hola ${user.names}!`, 'success');
    
    setTimeout(() => {
        goToOrderLayer();
        messageDiv.classList.add('hidden');
    }, 1500);
});

// LOGOUT
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    app.currentUser = null;
    app.cart = [];
    goToAuthLayer();
});

// ===== NAVEGACIÓN DE CAPAS =====
function hideAllLayers() {
    document.querySelectorAll('.layer').forEach(layer => layer.classList.add('hidden'));
}

function goToAuthLayer() {
    hideAllLayers();
    document.getElementById('authLayer').classList.remove('hidden');
    document.getElementById('logInForm').classList.add('hidden');
    document.getElementById('signInForm').classList.remove('hidden');
}

function goToOrderLayer() {
    hideAllLayers();
    document.getElementById('orderLayer').classList.remove('hidden');
    document.getElementById('welcomeMsg').textContent = `Hola ${app.currentUser.names}`;
    renderMenu();
    updateCart();
}

function goToPaymentLayer() {
    hideAllLayers();
    document.getElementById('paymentLayer').classList.remove('hidden');
    renderPaymentSummary();
    updatePaymentMethod();
}

function goToPickupLayer() {
    hideAllLayers();
    document.getElementById('pickupLayer').classList.remove('hidden');
    const orderId = generateOrderData();
    displayPickupInfo(orderId);
}

// ===== CAPA DE PEDIDO =====
function renderMenu() {
    const container = document.getElementById('menuContainer');
    container.innerHTML = '';
    
    app.menu.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <div class="item-image">${item.image}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-price">\$${item.price.toFixed(2)}</div>
            <div class="item-stock">Stock: ${item.stock}</div>
            <div class="item-quantity-section">
                <input type="number" id="qty-${item.id}" value="1" min="1" max="${item.stock}" class="qty-input">
                <button class="btn-add-cart" onclick="addToCart(${item.id})">+</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function addToCart(itemId) {
    const qtyInput = document.getElementById(`qty-${itemId}`);
    const quantity = parseInt(qtyInput.value) || 1;
    const item = app.menu.find(i => i.id === itemId);
    
    if (!item) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    if (quantity <= 0) {
        showNotification('La cantidad debe ser mayor a 0', 'error');
        return;
    }
    
    if (quantity > item.stock) {
        showNotification(`Stock disponible: ${item.stock}`, 'error');
        return;
    }
    
    const existingCartItem = app.cart.find(c => c.id === itemId);
    
    if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + quantity;
        if (newQuantity > item.stock) {
            showNotification(`No hay suficiente stock. Máximo: ${item.stock}`, 'error');
            return;
        }
        existingCartItem.quantity = newQuantity;
    } else {
        app.cart.push({ ...item, quantity });
    }
    
    qtyInput.value = '1';
    updateCart();
    showNotification(`${item.name} agregado al carrito ✓`, 'success');
}

function removeFromCart(itemId) {
    const item = app.cart.find(c => c.id === itemId);
    app.cart = app.cart.filter(item => item.id !== itemId);
    showNotification(`${item.name} removido del carrito`, 'info');
    updateCart();
}

function updateCart() {
    const cartContainer = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    const proceedBtn = document.getElementById('proceedPaymentBtn');
    
    cartContainer.innerHTML = '';
    let total = 0;
    
    if (app.cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #6b7280;">Tu carrito está vacío</p>';
    } else {
        app.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span class="cart-item-image">${item.image}</span>
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-qty">x${item.quantity}</span>
                </div>
                <span class="cart-item-price">\$${itemTotal.toFixed(2)}</span>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Eliminar">✕</button>
            `;
            cartContainer.appendChild(div);
        });
    }
    
    totalPrice.textContent = total.toFixed(2);
    proceedBtn.disabled = app.cart.length === 0;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = '#22c55e';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#3b82f6';
        notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Seleccionar recreo
document.getElementById('recreoBasica')?.addEventListener('click', function() {
    app.selectedRecreation = 'basica';
    document.querySelectorAll('.btn-recreo').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
});

document.getElementById('recreoBachillerato')?.addEventListener('click', function() {
    app.selectedRecreation = 'bachillerato';
    document.querySelectorAll('.btn-recreo').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
});

document.getElementById('proceedPaymentBtn')?.addEventListener('click', () => {
    if (app.cart.length > 0) {
        goToPaymentLayer();
    }
});

// ===== CAPA DE PAGO =====
function getCartTotal() {
    return app.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function renderPaymentSummary() {
    const summaryDiv = document.getElementById('paymentSummary');
    summaryDiv.innerHTML = '';
    
    let total = 0;
    app.cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const div = document.createElement('div');
        div.className = 'payment-summary-item';
        div.innerHTML = `
            <span>${item.image} ${item.name} x${item.quantity}</span>
            <span>\$${itemTotal.toFixed(2)}</span>
        `;
        summaryDiv.appendChild(div);
    });
    
    const totalDiv = document.createElement('div');
    totalDiv.className = 'payment-summary-item';
    totalDiv.innerHTML = `<span>Total</span><span>\$${total.toFixed(2)}</span>`;
    summaryDiv.appendChild(totalDiv);
}

function updatePaymentMethod() {
    const total = getCartTotal();
    
    // PayMon
    const paymonDiv = document.getElementById('paymonInfo');
    paymonDiv.innerHTML = `
        <div class="paymon-account">
            <p><strong>Cuenta:</strong> ${app.currentUser.email}</p>
            <p><strong>Saldo Disponible:</strong> <span class="paymon-balance">\$${app.paymonBalance.toFixed(2)}</span></p>
            <p><strong>Monto a Pagar:</strong> <span class="paymon-amount">\$${total.toFixed(2)}</span></p>
            <p id="paymonStatus" class="paymon-status"></p>
        </div>
    `;
    
    // Validar saldo
    if (app.paymonBalance >= total) {
        document.getElementById('paymonStatus').innerHTML = '<span style="color: #22c55e; font-weight: 600;">✓ Saldo suficiente</span>';
        document.getElementById('confirmPaymentBtn').disabled = false;
    } else {
        document.getElementById('paymonStatus').innerHTML = `<span style="color: #ef4444; font-weight: 600;">✗ Saldo insuficiente. Necesitas $${(total - app.paymonBalance).toFixed(2)} más</span>`;
        document.getElementById('confirmPaymentBtn').disabled = true;
    }
}

// Seleccionar método de pago
document.getElementById('paymentPayMon')?.addEventListener('click', function() {
    app.paymentMethod = 'paymon';
    document.querySelectorAll('.btn-method').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('paymonDetails').classList.remove('hidden');
    document.getElementById('eightcoinsDetails').classList.add('hidden');
    updatePaymentMethod();
});

document.getElementById('paymentEightCoins')?.addEventListener('click', function() {
    app.paymentMethod = 'eightcoins';
    document.querySelectorAll('.btn-method').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('eightcoinsDetails').classList.remove('hidden');
    document.getElementById('paymonDetails').classList.add('hidden');
    document.getElementById('confirmPaymentBtn').disabled = false;
});

// Confirmar pago
document.getElementById('confirmPaymentBtn')?.addEventListener('click', () => {
    const messageDiv = document.getElementById('paymentMessage');
    const total = getCartTotal();
    const method = app.paymentMethod === 'paymon' ? 'PayMon' : 'EightCoins';
    
    // Validar saldo en PayMon
    if (app.paymentMethod === 'paymon' && app.paymonBalance < total) {
        showMessage(messageDiv, `Saldo insuficiente en PayMon. Necesitas $${(total - app.paymonBalance).toFixed(2)} más`, 'error');
        return;
    }
    
    showMessage(messageDiv, `Procesando pago por ${method}...`, 'success');
    
    // Simular procesamiento
    setTimeout(() => {
        // Descontar saldo si es PayMon
        if (app.paymentMethod === 'paymon') {
            app.paymonBalance -= total;
            app.currentUser.paymonBalance = app.paymonBalance;
            localStorage.setItem('zumogoUsers', JSON.stringify(app.users));
        }
        
        showMessage(messageDiv, `¡Pago de $${total.toFixed(2)} confirmado por ${method}! Dirígete al retiro`, 'success');
        setTimeout(() => {
            goToPickupLayer();
            messageDiv.classList.add('hidden');
        }, 1500);
    }, 2000);
});

document.getElementById('cancelPaymentBtn')?.addEventListener('click', () => {
    goToOrderLayer();
});

// ===== GENERADOR DE ÓRDENES Y QR =====
function generateOrderData() {
    const orderId = 'ZGO' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = new Date().toISOString();
    const recreation = app.selectedRecreation === 'basica' ? 'Básica (9:50-10:30)' : 'Bachillerato (10:30-11:00)';
    
    const orderData = {
        id: orderId,
        user: app.currentUser.names,
        email: app.currentUser.email,
        recreation: recreation,
        timestamp: timestamp,
        items: app.cart.map(item => `${item.name}(x${item.quantity})`).join(', '),
        total: app.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentMethod: app.paymentMethod
    };
    
    const orders = JSON.parse(localStorage.getItem('zumogoOrders')) || [];
    orders.push(orderData);
    localStorage.setItem('zumogoOrders', JSON.stringify(orders));
    
    app.currentOrderId = orderId;
    return orderId;
}

function generateQRCode(orderId) {
    const qrContainer = document.getElementById('qrCode');
    qrContainer.innerHTML = '';
    
    const qrData = `Pedido: ${orderId}
Estudiante: ${app.currentUser.names}
Correo: ${app.currentUser.email}
Recreo: ${app.selectedRecreation === 'basica' ? 'Básica' : 'Bachillerato'}
Total: $${app.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;
    
    try {
        new QRCode(qrContainer, {
            text: qrData,
            width: 200,
            height: 200,
            colorDark: '#22c55e',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (error) {
        console.error('Error generando QR:', error);
        qrContainer.innerHTML = `<div style="font-size: 48px;">📱</div><div style="font-size: 14px; margin-top: 10px; font-weight: 700;">${orderId}</div>`;
    }
}

// ===== CAPA DE RETIRO =====
function displayPickupInfo(orderId) {
    document.getElementById('pickupCode').textContent = orderId;
    
    setTimeout(() => {
        generateQRCode(orderId);
    }, 100);
}

document.getElementById('newOrderBtn')?.addEventListener('click', () => {
    app.cart = [];
    app.currentOrderId = null;
    goToOrderLayer();
});

document.getElementById('homeBtn')?.addEventListener('click', () => {
    app.currentUser = null;
    app.cart = [];
    app.currentOrderId = null;
    goToAuthLayer();
});

// ===== UTILIDADES =====
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.classList.remove('hidden');
}

// ===== SPLASH SCREEN =====
window.addEventListener('load', () => {
    const splash = document.getElementById('splash');
    setTimeout(() => {
        splash.classList.add('hidden');
        goToAuthLayer();
    }, 3000);
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem('zumogoUsers', JSON.stringify(app.users));
});

console.log('ZumoGo App Initialized');
console.log('Test User: mcartagena@eightacademy.edu.ec / Zumo@2024');
