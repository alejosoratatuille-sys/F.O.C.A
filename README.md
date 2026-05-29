# ZumoGo 🥪⚡

> \\\*\\\*Pide, paga y retira tu almuerzo sin perder el recreo.\\\*\\\*

Aplicación de pedido y retiro anticipado de comida para la comunidad de **Eight Academy**, en alianza con el bar **Zumo \& Resto** y el ecosistema de **Eight Coins**.

Proyecto impulsado por **FOCA — Focus Open Crypto Alliance**.

\---

## 📋 Tabla de contenido

* [El problema](#-el-problema)
* [La solución](#-la-solución)
* [Vinculación con los ODS](#-vinculación-con-los-ods)
* [Stack tecnológico](#️-stack-tecnológico)
* [Estado del proyecto](#-estado-del-proyecto)
* [Equipo](#-equipo)

\---

## 🎯 El problema

En Eight Academy, el recreo dura aproximadamente **40 minutos**, pero cientos de estudiantes acuden al mismo tiempo al bar Zumo \& Resto a comprar su almuerzo. El resultado es una fila única en la que ordenar, pagar y recibir la comida puede tomar más de la mitad del recreo. El estudiante pierde su tiempo de descanso, no alcanza a comer con calma y, en muchos casos, llega tarde a su siguiente clase. Para el bar, la congestión también es un problema: el servicio se vuelve estresante y se desperdician alimentos preparados sin saber cuántos clientes vendrán.

No existe hoy una alternativa que combine ahorro de tiempo, apoyo al bar y un sistema de recompensas. Traer comida desde casa resuelve el problema individual pero deja al bar sin clientes. Las apps de delivery externas no entran al campus y sus tiempos no calzan con un recreo corto. La fila tradicional sigue siendo la única opción, y con ella, la pérdida diaria de recreo de cientos de estudiantes. **ZumoGo nace para resolver justamente esa brecha.**

\---

## 💡 La solución

ZumoGo es una aplicación web (PWA) que permite al estudiante **ordenar su almuerzo con anticipación desde su teléfono**, pagarlo y retirarlo en una fila exclusiva mostrando un código QR, sin hacer fila ni esperar.

### El recorrido del usuario (las 3 acciones clave)

|Paso|Acción|Qué hace el estudiante|
|:-:|-|-|
|**1**|🛒 **Pedir**|Elige del menú del día y selecciona una hora de retiro|
|**2**|💳 **Pagar**|Confirma con PayMon o con sus Eight Coins|
|**3**|✅ **Retirar**|Muestra el QR en la fila express del bar, sin esperar|

### Sobre el pago: Escenario mínimo viable

PayMon es el ecosistema FinTech que el bar **ya utiliza**, pero es **cerrado**: no ofrece pasarela abierta para integraciones de terceros. Por eso, para el prototipo del hackathon adoptamos el **Escenario C**:

* ✅ El pago se **simula** dentro del prototipo (pantalla "procesando pago" → "pago aprobado").
* ✅ La app está **diseñada y arquitectada** para conectarse con PayMon cuando esa integración sea posible.
* ✅ En el pitch se comunica con honestidad: *"demostramos el flujo con un pago simulado; la app está lista para conectarse con PayMon"*.

> 💬 \\\*\\\*¿Por qué esto suma en lugar de restar?\\\*\\\* Es honesto, es realista para un equipo de 9no, y muestra visión de futuro sin prometer lo imposible.

### Eight Coins

Las **Eight Coins** son la criptomoneda educativa simulada que los estudiantes ganarán por buenos hábitos (asistencia, rendimiento, participación). En ZumoGo se pueden **canjear por productos del menú**, funcionando como un sistema de recompensas gamificado que motiva el uso de la app.

\---

## 🌍 Vinculación con los ODS

ZumoGo aporta directamente a tres Objetivos de Desarrollo Sostenible:

### 🏭 ODS 9 — Industria, Innovación e Infraestructura

* Digitaliza un servicio escolar que hoy es 100% manual (la fila del bar).
* Introduce innovación financiera al ecosistema educativo con pagos digitales y Eight Coins.
* Genera datos de demanda que permiten al bar operar de forma más eficiente.

### 🍽️ ODS 2 — Hambre Cero

* Reduce el desperdicio de alimentos: el bar produce según pedidos confirmados, no por estimación.
* Permite priorizar opciones nutritivas con incentivos en Eight Coins.
* Habilita un mecanismo de redistribución de combos sobrantes a estudiantes con necesidad.

### 🤝 ODS 17 — Alianzas para Lograr los Objetivos

* El proyecto **es** una alianza: FOCA + Eight Academy + Zumo \& Resto + PayMon.
* Conecta actores que normalmente no colaboran en torno a un mismo objetivo.
* Es un modelo replicable que otras instituciones podrían adoptar.

\---

## 🛠️ Stack tecnológico

|Capa|Herramienta|Para qué sirve|
|-|-|-|
|**Generación de la app**|🤖 **Replit (con IA)**|Genera la app funcional describiendo lo que se quiere en lenguaje natural|
|**Diseño visual / UI**|🎨 **Figma**|Diseñar y pulir las pantallas y el prototipo navegable|
|**Tipo de aplicación**|📱 Web App / PWA|App web que se abre en el celular como si fuera nativa|
|**Datos del prototipo**|💾 Datos simulados|Menú, stock, usuario y saldo de Eight Coins como datos de ejemplo|
|**Pago**|🧪 Simulado|Pantalla de pago que imita PayMon, sin procesar dinero real|
|**Eight Coins**|🪙 Saldo de puntos simulado|Contador interno; se ganan y canjean dentro del prototipo (sin blockchain)|
|**Presentación / pitch**|📊 **Gamma** o **Canva**|Armar las láminas del pitch vendible para el jurado|

### Principios técnicos del MVP

* ⚡ **Velocidad sobre complejidad:** todo lo que pueda generar Replit, lo genera Replit.
* 🎯 **Foco en el "happy path":** las 3 acciones clave (Pedir → Pagar → Retirar) son la prioridad.
* 🔍 **Honestidad técnica:** el pago se simula y se explica como tal.
* 🌱 **Arquitectura lista para escalar:** la app está pensada para conectarse con PayMon real más adelante.

\---

## 📌 Estado del proyecto

**Versión actual:** `v0.1` — Prototipo en desarrollo
**Duración del hackathon:** 4 semanas
**Entregables esperados:** prototipo navegable + app generada con Replit + pitch vendible

### Documentos del proyecto

* 📄 Whitepaper inicial
* 📊 Investigación de mercado (competidores, buyer personas, TAM-SAM-SOM)
* 🗺️ Canvas del proyecto
* 🎨 Diseño UI para Figma (3 pantallas clave)
* ⚙️ Stack tecnológico

\---

## 👥 Equipo

**FOCA — Focus Open Crypto Alliance**
5 estudiantes de 9no año · Eight Academy

|Rol|Responsabilidad|
|-|-|

|Líder de producto y pitch: Alejandro Córdova|Arma la presentación y la narrativa|<br /><br />Diseñador de experiencia: Emilia Cartagena|Define cómo se ve y se navega la app|
|-|-|-|-|

|Investigador de mercado y ODS: Diego Laya|Sustenta datos y conexión con los ODS|
|-|-|
|Orador: Isac Esis|Diseña la lógica del sistema de recompensas|
|Constructor del prototipo: Jeremías Vega|Materializa el diseño en Replit|

\---

> \\\*"Recupera tu recreo. Pide, paga y retira con ZumoGo."\\\*

**© 2026 · FOCA — Focus Open Crypto Alliance · Eight Academy**
