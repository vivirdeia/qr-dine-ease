## 1. Ocultar botón "Reservar" cuando se entra desde un QR

**Cómo distinguir el origen:** la carta pública añade un parámetro a la URL cuando se genera desde el panel.

- Sección **QR** del Dashboard: añadir un segundo QR llamado **"QR de mesa / en sala"** que apunta a `/r/{slug}?src=qr` (el QR general sigue apuntando a `/r/{slug}` limpio). Botón para descargar PNG/SVG e imprimir, igual que el actual.
- En la sección **Ajustes → Módulos** añadir un toggle:
  *"Ocultar el botón Reservar cuando el cliente entra escaneando un QR"* (por defecto **desactivado**, es decir, siempre se muestra).
- En `PublicRestaurant.tsx`, leer `?src=qr` con `useSearchParams`. El botón flotante se oculta solo si:
  `restaurant.reservationsEnabled !== false` AND NOT (`hideReserveOnQr === true` AND `src === "qr"`).
- Persistimos `src=qr` en `sessionStorage` para que se mantenga aunque el usuario navegue dentro de la carta.

> Así el dueño decide: si nunca pone el QR de mesa, todo el mundo ve "Reservar". Si imprime el QR de mesa, los comensales que ya están sentados no lo ven, pero quien comparta el enlace o entre desde Google/Instagram sí.

## 2. Banner de cookies en la home (y en toda la app)

Componente nuevo `src/components/CookieBanner.tsx`, montado a nivel `App.tsx` para que aparezca en cualquier ruta pública (Landing, /r/:slug, info, legal).

- Aparece abajo, ancho completo en móvil, tarjeta centrada en desktop. Estilo minimal acorde al design system (border, rounded-lg, bg-card).
- Texto breve: *"Usamos cookies propias y de terceros para analítica y mejorar tu experiencia."* + enlace a `/cookies`.
- Botones **Aceptar** / **Rechazar** + cierre con X (equivale a rechazar).
- Guarda la elección en `localStorage` (`cookieConsent: "accepted" | "rejected"` + fecha). No vuelve a aparecer.
- **Integración con tracking existente** (`restaurant.tracking` ya inyecta GA/Meta Pixel en `PublicRestaurant.tsx`): los scripts solo se inyectan si el consentimiento es `accepted`. Si se rechaza, se omiten.
- Nuevo hook `useCookieConsent()` que expone `{ consent, accept, reject, reset }` por si más adelante quieren un botón "gestionar cookies" en el footer (lo añadimos en el footer de Landing).

## 3. Modal de plato + tracking de "más vistos"

### Modal en la carta pública
- Al hacer click en cualquier plato de la lista en `PublicRestaurant.tsx`, abrir un nuevo componente `DishModal.tsx`:
  - Foto grande (16/9) arriba — placeholder si no hay imagen.
  - Nombre, precio, badges (destacado, nuevo, agotado).
  - Descripción completa.
  - Lista de alérgenos con iconos (los datos ya están en `dish.allergens`).
  - Etiquetas dietéticas (vegetariano/vegano/sin gluten…).
  - Variantes/precios si existen.
  - Botón "Cerrar".
- Mobile: bottom-sheet `Drawer` de shadcn. Desktop: `Dialog`.

### Tracking de vistas
- Nuevo estado en `AppContext`: `dishViews: Record<string, number>` (clave = `dishId`) por tenant, persistido en localStorage.
- Nueva acción `trackDishView(dishId)` que incrementa el contador. Se llama al abrir el modal.
- Para evitar inflar números, debounce: una vista por sesión y plato (`sessionStorage` flag).
- Se exponen los datos en **Métricas**:
  - Reemplazar el array hardcoded `metricsData.topDishes` por un cálculo real: `dishes.map(d => ({ name: d.name, views: dishViews[d.id] ?? 0 })).sort(...)` y mostrar los 10 primeros.
  - Mantener el mock como fallback si no hay datos reales todavía (para que la demo no se vea vacía).

### Bonus (gratis, mismo cambio)
- Mostrar también un pequeño indicador "👁 N" al lado del nombre del plato en el **Dashboard → Carta** para que el dueño vea de un vistazo qué platos llaman más la atención.

---

## Archivos que se tocan

- `src/data/mockData.ts` — añadir campo `hideReserveOnQr?: boolean` a `Restaurant`.
- `src/context/AppContext.tsx` — `dishViews`, `trackDishView`, persistencia, consentimiento de cookies.
- `src/pages/PublicRestaurant.tsx` — lectura de `?src=qr`, lógica del botón Reservar, abrir `DishModal` al click, gate de scripts de tracking por consentimiento.
- `src/pages/Dashboard.tsx` — sección QR con dos QRs (general + mesa), toggle nuevo en Ajustes → Módulos, contador 👁 en la carta, top platos reales en Métricas.
- `src/components/DishModal.tsx` — nuevo.
- `src/components/CookieBanner.tsx` + `src/hooks/useCookieConsent.ts` — nuevos.
- `src/App.tsx` — montar `<CookieBanner />` global.

## Lo que NO se toca

- Backend / base de datos (todo sigue en estado local + localStorage).
- Auth, planes, pricing, landing fuera de añadir el banner.
- Estructura del menú lateral del dashboard.

## Pregunta abierta

¿El conteo de vistas debe resetearse mensualmente o ser acumulado desde siempre? Por defecto lo dejo acumulado y, si quieres, en una segunda iteración añadimos selector "últimos 7 / 30 días".