# 🏪 ComercioPro — Sistema POS, Control de Fiados e Inventario en la Nube

<div align="center">
  <img src="logo.png" alt="ComercioPro Logo" width="120" style="border-radius: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); margin-bottom: 12px;" />
  <br />

  [![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-10.13-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![PWA](https://img.shields.io/badge/PWA-Offline--First-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  <p align="center">
    <strong>SaaS de Punto de Venta (POS), Control de Fiados en USD, Inventario Multirubro y Arqueo Diario Multimoneda.</strong>
    <br />
    Diseñado especialmente para bodegas, abastos, ferreterías, repuestos, papelerías y comercios de mostrador en Latinoamérica.
  </p>

  <p align="center">
    🌐 <strong>Aplicación en Producción:</strong> <a href="https://comerciopro-app.web.app" target="_blank"><strong>comerciopro-app.web.app</strong></a>
  </p>
</div>

---

## 🎯 ¿Qué es ComercioPro?

En las economías bimonetarias (como Venezuela), los comerciantes enfrentan desafíos diarios que los puntos de venta tradicionales no resuelven:
1. **Cobros Fraccionados Multimoneda:** Un cliente paga parte en efectivo $, parte en Pago Móvil, parte en punto de venta y el resto lo deja fiado.
2. **Devaluación de Deudas:** Si fías en bolívares, cuando te pagan ya el dinero no alcanza para reponer la mercancía.
3. **Cierre de Caja Enredado:** Cuadrar al final de la tarde la gaveta de efectivo en dólares, la de bolívares y las cuentas bancarias es un dolor de cabeza.
4. **Dependencia del Internet:** Si se cae la luz o falla la conexión, el negocio no puede detenerse.
5. **Cero Hardware Costoso:** Sin necesidad de comprar computadoras industriales ni impresoras fiscales costosas; funciona en cualquier teléfono, tablet o PC y emite recibos por WhatsApp.

**ComercioPro** soluciona todo esto en una interfaz rápida, táctil e intuitiva donde **cada venta se procesa en menos de 10 segundos**.

---

## 🚀 Módulos y Funcionalidades Destacadas

### ⚡ 1. Punto de Venta (Caja Rápida)
* **Buscador Predictivo:** Búsqueda instantánea por nombre de producto o código de barras (lector USB o cámara).
* **Desglose de Pago Mixto:** Divide un mismo ticket entre **Efectivo USD ($)**, **Efectivo Bolívares (Bs)**, **Pago Móvil**, **Punto de Venta** y **Fiado ($)**.
* **Atajos de 1 Toque:** Botones rápidos como *"Exacto en USD"*, *"Exacto en Bs"*, *"Exacto Pago Móvil"* o *"Todo Fiado"*.
* **Ajuste de Precios al Vuelo:** Permite aplicar rebajas, redondeos o precios especiales al momento sin alterar el catálogo maestro.
* **Vueltos Inteligentes:** Opción de entregar el vuelto en físico o **abonarlo como Saldo a Favor (Crédito Positivo)** en la cuenta del cliente para futuras compras.
* **Tickets por WhatsApp:** Envío de comprobante de compra preformateado directo al WhatsApp del comprador sin gastar papel.

---

### 👥 2. Gestión de Cajeros y Permisos por Roles (Dueño vs. Cajero)
* **Acceso Seguro vía Google Auth:** El dueño autoriza cajeros ingresando su correo Gmail desde la configuración. El cajero entra con su cuenta de Google sin contraseñas locales que olvidar ni riesgos.
* **Revocación Inmediata:** Si un empleado deja el negocio, el dueño revoca su acceso con un clic y pierde entrada al instante.
* **Permisos Segregados para Cajeros:**
  * ✅ **Punto de Venta (Caja):** Facturar, cobrar y emitir tickets.
  * ✅ **Clientes & Fiados:** Consultar cuánto debe un cliente, revisar su historial y **procesar abonos** (que ingresan automáticamente al cuadre de su turno).
  * ✅ **Cierre del Día:** Ver el arqueo del día en curso para entregar su turno cuadrado.
  * ❌ **Oculto y Bloqueado:** No pueden ver métricas semanales/mensuales, ni ganancias del negocio, ni editar precios, ni alterar inventario, ni borrar clientes ni eliminar ventas.

---

### 🔄 3. Devoluciones Inteligentes y Corrección de Ventas
* **Anulación Individual con Retorno de Stock:** El dueño puede anular un ticket específico con un clic. El sistema:
  * Devuelve automáticamente las unidades vendidas al stock del inventario.
  * Si la venta fue a crédito, anula el fiado en la cuenta del cliente.
  * Descuenta el monto cobrado de la gaveta del día y recalcula todos los reportes de inmediato sin tocar el resto de las ventas.
* **Botón "Corregir en Caja":** Anula el ticket erróneo devolviendo el stock y **carga los mismos productos de inmediato al carrito de la caja**, permitiendo cambiar el método de pago, cantidades o artículos en 3 segundos.

---

### 📒 4. Micro-Ledger de Clientes y Fiados Protegidos en USD
* **Regla de Oro Antidevaluación:** Toda deuda por fiado se fija y consolida estrictamente en **USD**, mostrándole al cliente su equivalente en bolívares a la tasa del día.
* **Historial Inmutable:** Cada cargo y abono queda grabado con fecha, hora, monto y nombre del cajero que lo recibió.
* **Tope de Crédito Configurable:** Límite máximo de crédito por cliente que previene automáticamente ventas a morosos.
* **Cobranza por WhatsApp:** Botón rápido para enviar al cliente su estado de cuenta actualizado con su saldo pendiente con un toque.

---

### 📦 5. Inventario Multirubro, Despiece de Bultos y Mermas
* **Doble Anclaje de Precios:** Configuración de productos con precio base en USD (ej. víveres importados) o en Bs (ej. menudeo local).
* **Venta a Granel y Fracciones:** Soporte nativo para decimales (ej. `0.250 kg` de queso, `1.5 m` de cable, etc.).
* **Despiece de Bultos a Detal:** Convierte compras en bultos o cajas (ej. bulto de harina de 20 unidades) en unidades sueltas, recalculando el costo unitario al instante.
* **Control de Mermas:** Registro de salidas por consumo personal/familiar, averías o vencimientos para mantener el inventario siempre cuadrado.

---

### 📊 6. Cierre de Caja y Arqueo Multimoneda
* **Arqueo de Gaveta en Tiempo Real:** Desglose exacto de cuánto dinero debe haber en:
  * Efectivo Dólares ($)
  * Efectivo Bolívares (Bs)
  * Pago Móvil (Bs)
  * Punto de Venta / Bancos (Bs)
  * Fiados emitidos y abonos cobrados en el turno.
* **Cálculo de Ganancia Real:** Rentabilidad bruta y neta basada en el costo de reposición snapshot de cada producto al momento de venderlo.
* **Métricas Semanales y Mensuales:** Gráficos de tendencias, rotación de mercancía y productos estrella para la toma de decisiones del dueño.

---

### 📶 7. Arquitectura Offline-First (Funciona sin Internet)
* **Persistencia Local Dual:** Toda la base de datos opera localmente mediante IndexedDB y caché estructurada. Si el comercio se queda sin internet o sin luz, puede seguir cobrando y vendiendo.
* **Sincronización Automática:** En cuanto el dispositivo recupera conexión, los tickets, abonos y movimientos se sincronizan en la nube de Firebase Firestore en segundo plano.
* **PWA Instalable:** Se instala como aplicación nativa en Windows, Mac, Linux, Android e iOS a pantalla completa.

---

## 🛠️ Stack Tecnológico

| Capa | Herramienta | Utilidad |
|---|---|---|
| **Frontend** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) | SPA reactiva de alta velocidad y compilación ultra optimizada |
| **Lenguaje** | [TypeScript 5.6](https://www.typescriptlang.org/) | Tipado estático estricto para proteger cálculos contables y transacciones |
| **Estilizado** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Diseño moderno, ergonómico y adaptable a pantallas táctiles y escritorio |
| **Iconos** | [Lucide React](https://lucide.dev/) | Iconografía limpia, consistente y ligera |
| **PWA & Offline** | [Vite Plugin PWA](https://vite-pwa-org.netlify.app/) + Workbox | Service Worker, instalación en pantalla de inicio y persistencia local |
| **Backend & Cloud** | [Firebase 10](https://firebase.google.com/) | Firebase Authentication, Cloud Firestore y Hosting CDN |
| **Moneda & Tasas** | [DolarAPI](https://dolarapi.com/) | Consulta automática de tasas BCV, Euro y USDT con override manual |

---

## 📂 Estructura del Código

```text
ComercioPro/
├── firestore.rules             # Reglas de seguridad multitenant y acceso para cajeros
├── firestore.indexes.json      # Índices compuestos de Firestore
├── public/                     # Manifiesto PWA, iconos y assets públicos
├── src/
│   ├── components/
│   │   ├── auth/               # Login por Google, Registro y Modo Demo
│   │   ├── common/             # Header con tasa, Sidebar, BottomNav móvil y modales
│   │   ├── customers/          # Directorio de fiados, modal de abonos y estados de cuenta
│   │   ├── expenses/           # Salidas de caja y gastos operativos del día
│   │   ├── inventory/          # Catálogo, precios, despiece de bultos y mermas
│   │   ├── pos/                # Punto de venta, cobro mixto y carrito
│   │   ├── reports/            # Arqueo diario, métricas, anulación y corrección de ventas
│   │   ├── settings/           # Configuración del negocio y gestión de cajeros
│   │   └── superadmin/         # Panel de control del sistema
│   ├── context/
│   │   ├── AuthContext.tsx     # Autenticación, tenants, roles (Dueño/Cajero)
│   │   ├── CartContext.tsx     # Gestión de carrito y carga de tickets a corregir
│   │   ├── CurrencyContext.tsx # Tasa de cambio BCV y modo override manual
│   │   ├── CustomersContext.tsx# Ledger inmutable de fiados y reversión de cargos
│   │   ├── ExpensesContext.tsx # Flujo de gastos operativos
│   │   ├── InventoryContext.tsx# Stock, despiece, costos y doble anclaje
│   │   └── ReportsContext.tsx  # Ventas, arqueo reactivo y anulación de tickets
│   ├── services/
│   │   ├── firebase.ts         # Inicialización de Firebase SDK
│   │   ├── localDatabase.ts    # Motor de base de datos local (Offline-First)
│   │   └── whatsapp.ts         # Generador de recibos y reportes para WhatsApp
│   ├── types/                  # Definiciones de TypeScript e interfaces
│   ├── App.tsx                 # Enrutador principal y control de navegación por roles
│   └── main.tsx                # Entrada de la app y registro del Service Worker
└── vite.config.ts              # Configuración de empaquetado y PWA
```

---

## 💻 Puesta en Marcha y Desarrollo Local

1. **Clonar el proyecto:**
   ```bash
   git clone https://github.com/omanvasquez/ComercioPro.git
   cd ComercioPro
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

5. **Desplegar a Firebase:**
   ```bash
   firebase deploy
   ```

---

## 👨‍💻 Autor y Contacto

<div align="center">
  <h3><strong>Oman Vásquez</strong></h3>
  <p><em>Desarrollador de Software & Creador de Soluciones Digitales</em></p>
  <p>Especializado en arquitecturas web modernas, aplicaciones SaaS y herramientas que impulsan el comercio latinoamericano.</p>

  <p>
    <a href="https://oman-vasquez.web.app" target="_blank"><img src="https://img.shields.io/badge/Sitio_Web-oman--vasquez.web.app-4F46E5?style=for-the-badge&logo=google-chrome&logoColor=white" /></a>
    <a href="https://wa.me/584124169949" target="_blank"><img src="https://img.shields.io/badge/WhatsApp-+58_412--4169949-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" /></a>
    <a href="https://github.com/omanvasquez" target="_blank"><img src="https://img.shields.io/badge/GitHub-omanvasquez-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
    <a href="https://www.linkedin.com/in/omanvasquez/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-omanvasquez-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
    <a href="https://omanvasquez.substack.com/" target="_blank"><img src="https://img.shields.io/badge/Substack-Mi_Blog-FF6719?style=for-the-badge&logo=substack&logoColor=white" /></a>
    <a href="https://x.com/omanvasquez_" target="_blank"><img src="https://img.shields.io/badge/X-@omanvasquez__-000000?style=for-the-badge&logo=x&logoColor=white" /></a>
    <a href="https://www.instagram.com/omanvasquez_/" target="_blank"><img src="https://img.shields.io/badge/Instagram-@omanvasquez__-E4405F?style=for-the-badge&logo=instagram&logoColor=white" /></a>
  </p>
</div>

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más información.
