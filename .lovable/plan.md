

# Plan: Paleta de colores personalizable, tracking/píxeles, y CRUD completo de categorías y fotos de platos

## 1. Paleta de colores personalizable

**Problema:** Todos los restaurantes ven la misma paleta (naranja/terracota). Cada restaurante necesita adaptar colores a su marca.

**Solución:**
- Añadir a `Restaurant` un campo `brandColors: { primary: string; accent: string; background: string }` con valores por defecto
- Nueva sección en **Settings > Personalización** con 3 color pickers (color primario, color acento, color fondo)
- Al guardar, aplicar los colores como CSS custom properties (`--primary`, `--gold`, `--background`) en el `<style>` del documento
- Los colores se persisten en localStorage junto con el resto de datos del restaurante
- En la **carta pública** (`PublicRestaurant.tsx`), aplicar los colores del restaurante al montar el componente con `document.documentElement.style.setProperty()`
- El dashboard siempre usa la paleta por defecto (los colores personalizados solo afectan la carta pública)

**Archivos:**
| Archivo | Cambio |
|---------|--------|
| `src/data/mockData.ts` | Añadir `brandColors` a `Restaurant` |
| `src/pages/Dashboard.tsx` | Nueva subsección "Personalización" en Settings con color pickers |
| `src/pages/PublicRestaurant.tsx` | Aplicar `brandColors` al montar |
| `src/context/AppContext.tsx` | Ya cubierto por `updateRestaurant` |

## 2. Tracking: Meta Pixel, Google Analytics, etc.

**Problema:** No hay forma de insertar códigos de seguimiento.

**Solución:**
- Añadir a `Restaurant` un campo `tracking: { googleAnalyticsId?: string; metaPixelId?: string; customHeadScript?: string }`
- Nueva subsección en **Settings > Tracking** con inputs para GA ID, Meta Pixel ID y un textarea para scripts personalizados
- En `PublicRestaurant.tsx`, al montar: inyectar dinámicamente los scripts de GA y Meta Pixel en el `<head>` según los IDs configurados
- Usar `useEffect` con cleanup para eliminar los scripts al desmontar

**Archivos:**
| Archivo | Cambio |
|---------|--------|
| `src/data/mockData.ts` | Añadir `tracking` a `Restaurant` |
| `src/pages/Dashboard.tsx` | Inputs de tracking en Settings |
| `src/pages/PublicRestaurant.tsx` | Inyectar scripts GA/Meta al montar |

## 3. CRUD completo de categorías (editar + eliminar)

**Problema:** Solo se pueden crear categorías. No se pueden editar ni eliminar.

**Solución:**
- Añadir `updateCategory(id, data)` y `deleteCategory(id)` al AppContext
- `deleteCategory` mueve los platos de esa categoría a "Sin categoría" o los elimina (con confirmación)
- En la sidebar de categorías del dashboard, añadir botones de editar (lápiz) y eliminar (papelera) por categoría
- Modal de edición reutilizando el modal de nueva categoría con los datos precargados
- Confirmación antes de eliminar con aviso de cuántos platos tiene

**Archivos:**
| Archivo | Cambio |
|---------|--------|
| `src/context/AppContext.tsx` | `updateCategory`, `deleteCategory` |
| `src/pages/Dashboard.tsx` | Botones editar/eliminar en categorías, modal edición |

## 4. Cambiar fotos de platos

**Problema:** Las fotos son estáticas del mapa `dishImages`. No se pueden cambiar desde el dashboard.

**Solución:**
- En el modal de editar/crear plato, añadir un campo de **URL de imagen** (input de texto) y un botón de **subir foto** que use `FileReader` para convertir a base64 y guardar en localStorage
- Añadir `photoUrl` al `Dish` (ya existe en la interfaz pero no se usa)
- Prioridad de imagen: `dish.photoUrl` > `dishImages[dish.id]` > gradiente placeholder
- Actualizar tanto Dashboard como PublicRestaurant para usar esta prioridad
- Límite: imágenes se guardan como base64 en localStorage (funcional sin backend, con advertencia de límite ~5MB)

**Archivos:**
| Archivo | Cambio |
|---------|--------|
| `src/pages/Dashboard.tsx` | Input URL + botón subir en modal de plato |
| `src/pages/PublicRestaurant.tsx` | Prioridad `photoUrl` > `dishImages` > placeholder |

## Detalles técnicos

- Color pickers: inputs nativos `<input type="color">` (sin dependencias extra)
- Conversión HSL: los colores del picker (hex) se convierten a HSL para las CSS custom properties
- Scripts de tracking: se inyectan solo en la carta pública, nunca en el dashboard
- Fotos base64: se comprimen/redimensionan con canvas antes de guardar (max 800px, quality 0.7) para no saturar localStorage
- Las categorías protegidas (las 6 originales) pueden editarse pero no eliminarse

