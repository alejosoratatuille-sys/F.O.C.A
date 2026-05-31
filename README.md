# ZumoGo - Aplicación de Pedidos para Zumo&Resto

## Descripción
ZumoGo es una aplicación móvil web desarrollada con HTML, CSS y JavaScript que permite a los estudiantes de Eight Academy realizar pedidos, compras y retirar comida del bar Zumo&Resto de manera rápida y segura.

## Características Principales

### 1. Capa de Registro y Autenticación
- **Sign In (Registro):**
  - Solicita nombres y apellidos en mayúsculas (validación de solo letras)
  - Correo institucional con dominio @eightacademy.edu.ec
  - Contraseña segura (mínimo 12 caracteres con mayúscula, minúscula, número y símbolo)

- **Log In (Inicio de Sesión):**
  - Validación con correo y contraseña
  - Mensaje de bienvenida personalizado

### 2. Capa de Pedido
- Menú completo con 19 productos:
  - **Comidas:** Salchipapas, Arepas, Sandwich, Pan de Chocolate, Donas, Ensalada de Frutas, Pizza, Nachos, Dorilocos
  - **Bebidas:** Bubble Tea, Frozen, Agua, Powerade, Leche, Ponymalta, Imperial, Snacks
- Stock de 30 unidades por producto
- Carrito de compra interactivo
- Selector de recreo (Básica: 9:50-10:30 | Bachillerato: 10:30-11:00)

### 3. Capa de Pago
- Métodos de pago simulados:
  - **PayMon:** Descuento desde cuenta del estudiante
  - **EightCoins:** Moneda simulada de la institución
- Resumen de pedido antes de confirmar
- Flujo de pago seguro

### 4. Capa de Retiro
- Código único de retiro
- Código QR simulado
- Instrucciones de retiro en el bar

## Usuario de Prueba
```
Correo: mcartagena@eightacademy.edu.ec
Nombre: MARÍA EMILIA CARTAGENA LINCANGO
Contraseña: 1234567890
```

## Diseño Visual
- **Colores principales:**
  - Verde (#22c55e) - Zumo
  - Rosado (#ec4899) - Go
  - Paleta neutral para mejor legibilidad

- **Responsive:** Optimizado para dispositivos móviles
- **Logo ZumoGo:** Generado y guardado al inicio en localStorage

## Almacenamiento de Datos
- Usuarios registrados se guardan en localStorage
- Logo se guarda en localStorage
- Datos persisten entre sesiones

## Seguridad
- Validación de formularios en cliente
- Contraseñas con requisitos de seguridad
- Correo institucional requerido
- Sesiones de usuario

## Archivos del Proyecto
- `index.html` - Estructura HTML de la aplicación
- `styles.css` - Estilos y diseño responsivo
- `app.js` - Lógica principal de la aplicación
- `logo-generator.js` - Generador del logo ZumoGo
- `README.md` - Este archivo

## Cómo Usar
1. Abre `index.html` en tu navegador
2. Espera a que se cargue el logo de ZumoGo
3. Regístrate o usa el usuario de prueba
4. Selecciona productos del menú
5. Revisa tu carrito
6. Selecciona método de pago
7. Confirma tu pedido
8. Retira tu código QR y código para el bar

## Desarrollo
Aplicación desarrollada siguiendo las especificaciones de Eight Academy para el bar Zumo&Resto.
