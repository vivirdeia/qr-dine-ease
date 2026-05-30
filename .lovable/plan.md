# Branding personalizable + mapa en la carta pública

## Contexto

Hoy `Dashboard.tsx` ya tiene un panel "Personalización de marca" donde el dueño puede elegir 3 colores (primary, accent, background) y se guardan en `restaurant.brandColors`. **Pero esos colores no se aplican en `/r/:slug`** (la carta pública), por lo que el usuario no ve ningún cambio. Además, la ficha del restaurante muestra la dirección como enlace a Google Maps pero no hay un mapa embebido.

## Cambios

### 1. Aplicar branding en la carta pública (`src/pages/PublicRestaurant.tsx`)

- Leer `restaurant.brandColors` y, si existe, inyectar variables CSS scoped al contenedor raíz de la página:
  - `--brand-primary`, `--brand-accent`, `--brand-bg` convertidas a HSL.
- Sustituir en los puntos clave de la carta (no en toda la app) el uso de `text-primary` / `bg-primary` por clases que usen estas variables: header del restaurante, badges activos de categorías, botón flotante "Reservar", precios destacados, fondo general de la página.
- Si no hay `brandColors`, se mantiene exactamente el diseño actual.
- Añadir un pequeño helper `hexToHsl()` en `src/lib/utils.ts`.

### 2. Mejorar el panel de branding en el Dashboard

- Añadir un botón **"Restaurar por defecto"** que limpia `brandColors`.
- Añadir **preview en vivo** (mini-mockup de la carta) usando los 3 colores antes de guardar.
- Mantener los 3 inputs de color actuales (no se cambia la UX existente).

### 3. Nueva sección "Cómo llegar" con Google Maps en la carta pública

- Nuevo componente `src/components/public/LocationMap.tsx`.
- Insertado en `PublicRestaurant.tsx` justo después del bloque de información del restaurante / antes del footer.
- Implementación: `<iframe>` de Google Maps embed sin API key, usando la URL pública:
  ```
  https://www.google.com/maps?q={lat},{lng}&hl=es&z=16&output=embed
  ```
- Estilo según el design system:
  - Contenedor `rounded-2xl overflow-hidden border border-border`
  - Aspect ratio 16/9 en desktop, 4/3 en móvil
  - Título "Cómo llegar" + dirección + botones "Abrir en Google Maps" y "Cómo llegar" (deeplink a `https://www.google.com/maps/dir/?api=1&destination=...`)
- Lazy load (`loading="lazy"`) para no afectar al rendimiento.

> Nota: usamos el embed público de Google Maps (no requiere conectar Google Maps Platform). Si más adelante quieres el mapa interactivo con marker custom y estilo monocromo, podemos cambiar a la JS API conectando el conector de Google Maps.

## Lo que NO se toca

- Lógica de reservas, datos, rutas, auth, dashboard salvo el panel de branding.
- Landing page.
- Estilo global del dashboard ni del resto de la app.

## Pregunta abierta

¿El branding debe afectar **solo** a la carta pública (`/r/:slug`) o también al panel del dueño? Por defecto lo aplico solo a la carta pública, que es lo que ven los comensales.
