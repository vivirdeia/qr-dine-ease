# Enriquecer la landing

Mantengo el estilo actual (warm/serif, ya existente). Foco: rellenar bloques vacíos, añadir secciones que faltan y meter animaciones de entrada al hacer scroll.

## 1. Arreglar bloques vacíos detectados

**a) Sección "Escanea y prueba"** (captura 1)  
Hoy es un cuadro con un icono `QrCode` gigante centrado. Lo convierto en algo real y útil:

- QR real generado en cliente con `qrcode` (apuntando a `/r/casa-martin`).
- A la derecha (desktop), mockup de móvil mostrando preview de la carta cargando.
- Mini badges: "Sin app", "<2s en cargar", "Funciona en cualquier móvil".
- Botón "Explorar la demo" se mantiene.

**b) Mockup dashboard vacío** (captura 2)  
El bloque del Hero del "panel de admin" son cajas grises sin contenido. Lo relleno con un mockup más creíble:

- Sidebar con items reconocibles (Carta, Reservas, Mesas, Métricas, Ajustes) con iconitos.
- Header con avatar + nombre del restaurante.
- Grid de "platos" con miniaturas (usando `dishImages` ya existentes) y precios.
- Una tarjeta de "reserva entrante" animada (pulse sutil).

## 2. Nuevas secciones que aportan valor

**c) Métricas / Trust bar** justo bajo el Hero  
Banda con 4 cifras grandes: "+800 restaurantes", "1.2M comensales/año", "35% menos no-shows", "0€ comisiones". Tipografía grande, separadores verticales.

**f) Sección "Integraciones"** después de Features  
Grid pequeño de logos: Stripe (pagos futuros), Google Maps, WhatsApp, TheFork export, Mailchimp, Instagram. Comunica ecosistema.

**g) Bloque "Migración fácil"** antes del CTA final  
"¿Ya tienes carta en PDF / TheFork / Glovo? La importamos por ti gratis." Con tres pasos visuales: Envíanos tu carta → la digitalizamos → la revisas.

## 3. Animaciones

Instalo `framer-motion` (si no está) y añado un componente `FadeIn` reutilizable:

- Fade + translateY de 16px a 0, `duration 0.5`, trigger al entrar en viewport (`whileInView` con `once: true`).
- Aplicado a títulos de sección y a cada item de grid con `staggerChildren` de 0.08s.
- Hero: animación de entrada secuenciada (badge → título → subtítulo → CTAs → mockups).
- QR de la sección demo: animación de "dibujado" suave (scale + opacity).
- Tarjeta de reserva entrante en el mockup del Hero: pulse infinito muy sutil.
- Carrusel de logos de prensa: marquee CSS continuo.

Sin rebotes ni rotaciones decorativas, respetando lo que pediste de mantener el estilo actual.

## Detalles técnicos

- Nueva dependencia: `framer-motion` y `qrcode` (+ `@types/qrcode`).
- Nuevo componente `src/components/landing/FadeIn.tsx` para animar al hacer scroll.
- Refactor de `Landing.tsx`: separo secciones nuevas en `src/components/landing/` (TrustBar, ProductInAction, PressLogos, Integrations, MigrationHelp) para no inflar el archivo.
- Reescribo `InteractiveDemo` y el mockup del dashboard del Hero.
- Sin tocar pricing, FAQ, testimonios, comparativa, footer (ya están bien).
- Sin cambios de routing ni de datos.

## Qué NO entra

- Cambiar la identidad visual (sigue siendo warm/serif, como pediste).
- Tocar Dashboard, PublicRestaurant, ni el resto del producto.
- Vídeos reales: serán mockups animados, no archivos `.mp4`.

¿Le doy?