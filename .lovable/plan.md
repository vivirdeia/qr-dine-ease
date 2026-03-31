

# Plan: Añadir fotos a la carta de vinos

## Problema
Los vinos muestran un pequeño bloque de gradiente (`w-8 h-12`) en vez de una imagen real. La interfaz `Wine` no tiene campo `photoUrl`.

## Solución

### 1. Generar imágenes de botellas de vino
Crear 8 imágenes placeholder de botellas de vino en `src/assets/wines/`:
- `tinto-rioja.jpg` — Botella de Rioja tinto
- `tinto-ribera.jpg` — Botella de Ribera del Duero
- `tinto-priorat.jpg` — Botella de Priorat
- `blanco-albarino.jpg` — Botella de Albariño
- `blanco-verdejo.jpg` — Botella de Verdejo
- `rosado-navarra.jpg` — Botella de rosado
- `espumoso-cava.jpg` — Botella de cava
- `dulce-moscatel.jpg` — Botella de moscatel

### 2. Actualizar modelo Wine (`src/data/mockData.ts`)
- Añadir `photoUrl?: string` a la interfaz `Wine`
- Asignar la imagen correspondiente a cada vino en los datos mock

### 3. Actualizar vistas
- **`src/pages/PublicRestaurant.tsx`**: Reemplazar el bloque gradiente por `<img src={wine.photoUrl}>` con fallback
- **`src/pages/Dashboard.tsx`**: Igual en la sección de vinos del panel

### Archivos
| Archivo | Cambio |
|---------|--------|
| `src/assets/wines/*.jpg` | 8 imágenes nuevas |
| `src/data/mockData.ts` | Añadir `photoUrl` a `Wine` y asignar imágenes |
| `src/pages/PublicRestaurant.tsx` | Mostrar foto del vino |
| `src/pages/Dashboard.tsx` | Mostrar foto del vino |

