/**
 * ZumoGo - Mock Data
 * Simulated data for menu, user, coins, and orders
 */

const ZUMOGO_DATA = {
    // Mock user data
    user: {
        id: 'USER_001',
        name: 'Juan Estudiante',
        studentId: '9A-2026-001',
        email: 'juan@eightacademy.edu',
        coinsBalance: 150,
        totalOrders: 3,
        joinedDate: '2026-01-15'
    },

    // Mock menu items
    menu: [
        {
            id: 'ITEM_001',
            name: 'Combo Clásico',
            description: 'Sándwich + papas + bebida',
            category: 'combo',
            price: 8500,
            emoji: '🥪',
            available: true,
            stock: 25
        },
        {
            id: 'ITEM_002',
            name: 'Combo Premium',
            description: 'Sándwich premium + papas + bebida + postre',
            category: 'combo',
            price: 12000,
            emoji: '🍽️',
            available: true,
            stock: 15
        },
        {
            id: 'ITEM_003',
            name: 'Ensalada Verde',
            description: 'Ensalada fresca con pollo y aderezo',
            category: 'vegetarian',
            price: 7000,
            emoji: '🥗',
            available: true,
            stock: 20
        },
        {
            id: 'ITEM_004',
            name: 'Bowl Vegetariano',
            description: 'Granos, verduras y proteína vegetal',
            category: 'vegetarian',
            price: 7500,
            emoji: '🌿',
            available: true,
            stock: 12
        },
        {
            id: 'ITEM_005',
            name: 'Jugo Natural',
            description: 'Jugo fresco de naranja o fresa',
            category: 'beverage',
            price: 3000,
            emoji: '🧃',
            available: true,
            stock: 40
        },
        {
            id: 'ITEM_006',
            name: 'Agua Embotellada',
            description: 'Agua purificada 500ml',
            category: 'beverage',
            price: 2000,
            emoji: '💧',
            available: true,
            stock: 50
        },
        {
            id: 'ITEM_007',
            name: 'Sándwich Especial',
            description: 'Con jamón, queso y tomate',
            category: 'combo',
            price: 6500,
            emoji: '🥓',
            available: true,
            stock: 18
        },
        {
            id: 'ITEM_008',
            name: 'Papas Grandes',
            description: 'Porción grande de papas fritas',
            category: 'combo',
            price: 4000,
            emoji: '🍟',
            available: true,
            stock: 30
        }
    ],

    // Pickup time slots
    pickupTimes: [
        { time: '12:00', label: '12:00 PM' },
        { time: '12:15', label: '12:15 PM' },
        { time: '12:30', label: '12:30 PM' },
        { time: '12:45', label: '12:45 PM' },
        { time: '13:00', label: '1:00 PM' }
    ],

    // Order history (mock)
    orderHistory: [
        {
            id: 'ORDER_001',
            date: '2026-05-28',
            items: ['ITEM_001'],
            total: 8500,
            status: 'completed',
            pickupTime: '12:30'
        },
        {
            id: 'ORDER_002',
            date: '2026-05-25',
            items: ['ITEM_003', 'ITEM_005'],
            total: 10000,
            status: 'completed',
            pickupTime: '12:15'
        }
    ]
};

/**
 * Local Storage Manager
 */
class StorageManager {
    constructor() {
        this.prefix = 'zumogo_';
    }

    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(this.prefix + key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('Storage error:', e);
            return defaultValue;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }

    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }
}

/**
 * Shopping Cart Manager
 */
class CartManager {
    constructor(storage) {
        this.storage = storage;
        this.items = this.storage.get('cart', []);
    }

    addItem(item, quantity = 1) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...item,
                quantity
            });
        }
        this.save();
        return this.items;
    }

    removeItem(itemId) {
        this.items = this.items.filter(i => i.id !== itemId);
        this.save();
        return this.items;
    }

    updateQuantity(itemId, quantity) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.save();
        }
        return this.items;
    }

    getItems() {
        return this.items;
    }

    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getSubtotal() {
        return this.getTotal();
    }

    getTax() {
        return Math.round(this.getSubtotal() * 0.08);
    }

    getTotalWithTax() {
        return this.getSubtotal() + this.getTax();
    }

    clear() {
        this.items = [];
        this.save();
        return this.items;
    }

    save() {
        this.storage.set('cart', this.items);
    }
}

/**
 * Order Manager
 */
class OrderManager {
    constructor(storage) {
        this.storage = storage;
    }

    createOrder(cartItems, pickupTime, paymentMethod, totalAmount) {
        const orderId = this.generateOrderId();
        
        const order = {
            id: orderId,
            orderCode: `ZUMOGO-${String(Math.random() * 10000 | 0).padStart(4, '0')}`,
            items: cartItems,
            pickupTime,
            paymentMethod,
            amount: totalAmount,
            timestamp: new Date().toISOString(),
            status: 'confirmed',
            qrCode: this.generateQRCode(orderId)
        };

        // Save order to history
        const history = this.storage.get('order_history', []);
        history.unshift(order);
        this.storage.set('order_history', history);

        // Save current order for display
        this.storage.set('current_order', order);

        return order;
    }

    generateOrderId() {
        return 'ORD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateQRCode(orderId) {
        // In a real app, this would generate an actual QR code
        // For now, we'll return a placeholder that we can show
        return {
            data: orderId,
            format: 'text'
        };
    }

    getOrderHistory() {
        return this.storage.get('order_history', []);
    }

    getCurrentOrder() {
        return this.storage.get('current_order', null);
    }

    getOrderById(orderId) {
        const history = this.getOrderHistory();
        return history.find(order => order.id === orderId);
    }
}

/**
 * User Manager
 */
class UserManager {
    constructor(storage) {
        this.storage = storage;
        this.user = this.storage.get('user', ZUMOGO_DATA.user);
    }

    getUser() {
        return this.user;
    }

    getCoinsBalance() {
        return this.user.coinsBalance;
    }

    addCoins(amount) {
        this.user.coinsBalance += amount;
        this.storage.set('user', this.user);
        return this.user.coinsBalance;
    }

    spendCoins(amount) {
        if (amount > this.user.coinsBalance) {
            return false;
        }
        this.user.coinsBalance -= amount;
        this.storage.set('user', this.user);
        return true;
    }

    incrementOrders() {
        this.user.totalOrders += 1;
        this.storage.set('user', this.user);
    }

    updateUser(userData) {
        this.user = { ...this.user, ...userData };
        this.storage.set('user', this.user);
        return this.user;
    }
}

// Initialize managers
const storage = new StorageManager();
const cart = new CartManager(storage);
const orders = new OrderManager(storage);
const user = new UserManager(storage);

// Initialize data if first time
if (!storage.get('initialized')) {
    storage.set('user', ZUMOGO_DATA.user);
    storage.set('initialized', true);
}
