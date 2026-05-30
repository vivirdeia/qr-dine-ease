# Qué voy a implementar ahora

Bloque 1 del plan, **omitiendo la subida de imágenes**. Todo sigue en `localStorage`.

## 1. Enlace público y QR visibles en el Dashboard
- Tarjeta destacada en el Dashboard del owner con:
  - URL pública del restaurante (`/r/{slug}`) con botón "Copiar".
  - QR generado en cliente (librería `qrcode`) descargable como PNG.
  - Botón "Abrir página pública" en nueva pestaña.
  - Botón "Compartir por WhatsApp" con texto prellenado.
- Validación de slug único entre tenants al registrarse y al editarlo desde Ajustes, con sugerencia automática si choca.

## 2. Carta más rica (sin imágenes)
- **Alérgenos** por plato: selector múltiple con los 14 oficiales UE (gluten, lácteos, frutos secos, etc.) mostrados como iconos/badges en la página pública.
- **Etiquetas**: vegano, vegetariano, sin gluten, picante, novedad, destacado. Filtrables en la pública.
- **Variantes** con precio propio: ej. "media ración / ración", "pequeña / mediana / grande". El precio principal sigue funcionando si no hay variantes.
- **Marcar destacado / novedad** y mostrarlos con badge en la pública.

## 3. Página pública mejorada
- Filtros por categoría (chips), búsqueda por nombre y filtro por alérgenos ("ocultar platos con gluten…").
- Mostrar badges de etiquetas y alérgenos en cada plato.
- Mostrar variantes con sus precios.

## Detalles técnicos

- Nueva dependencia: `qrcode` (genera QR en canvas/SVG, sin red).
- Modelo `Dish` extendido con `allergens: string[]`, `labels: string[]`, `variants: { name: string; price: number }[]`, `featured: boolean`, `isNew: boolean`. Migración suave: si faltan campos, se asumen vacíos/false.
- Helper `getPublicUrl(slug)` que arma la URL absoluta con `window.location.origin`.
- Validación de slug: comprobar contra todos los tenants en `carta_db`.
- Sin cambios en autenticación ni en el modelo de tenants/roles.

## Qué NO entra en este bloque (queda para después)
- Subida de imágenes de platos/logo/portada (omitido a petición tuya).
- Reservas con estados y vista calendario.
- Menú del día, equipo, export/import, superadmin avanzado.

¿Le doy?
