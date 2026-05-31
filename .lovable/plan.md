# Plan

## 1. Modal de plato: eliminar botón "Cerrar" duplicado

En `src/components/public/DishModal.tsx` el `DialogContent` ya muestra una "X" en la esquina superior derecha (viene por defecto del componente `dialog.tsx`). Además hay un botón "Cerrar" al final del contenido. Son redundantes.

- Eliminar el bloque `<div className="pt-2"><Button variant="outline" ...>Cerrar</Button></div>` y el import de `Button` si queda sin uso.
- Mantener la "X" del Dialog como único cierre, más limpio y consistente con el resto de la app.

## 2. Carta con/sin foto

Confirmación: el comportamiento actual ya es correcto — los platos con foto la muestran y los que no, muestran el placeholder 🍽️. No requiere cambios. Lo dejo anotado por si más adelante quieres ocultar totalmente la zona de imagen cuando no haya foto (se puede hacer en una iteración futura).

## 3. Zonas de reserva configurables por el dueño

Hoy las zonas que ve el comensal en el formulario de reserva están hardcodeadas: `Interior`, `Terraza`, `Sin preferencia` (en `PublicRestaurant.tsx`). El dueño no puede editarlas.

### Cambios

**Modelo (`src/data/mockData.ts`)**
- Añadir campo opcional `reservationZones?: string[]` en el tipo `Restaurant`.
- Inicializar el restaurante mock con `["Interior", "Terraza"]` (la opción "Sin preferencia" se añade siempre por defecto, no se gestiona).

**Dashboard → Ajustes (`src/pages/Dashboard.tsx`)**
- Añadir un bloque "Zonas para reservas" dentro de la sección de ajustes (cerca del toggle de reservas).
- UI: lista de chips editables con botón "x" para eliminar + input + botón "Añadir" para crear nuevas zonas.
- Guardar vía `updateRestaurant({ reservationZones: [...] })`.
- Validaciones simples: no permitir vacíos ni duplicados, mínimo 0 zonas (si está vacío, en el form público solo aparecerá "Sin preferencia").

**Dashboard → Mesas**
- Las zonas internas de mesas (`Interior | Terraza | Barra | Privado`) se mantienen tal cual, son operativas y no afectan al comensal. No las tocamos para no romper el tipado existente.

**Formulario público (`src/pages/PublicRestaurant.tsx`)**
- Reemplazar el array hardcodeado de zonas por `restaurant.reservationZones ?? []`, añadiendo siempre "Sin preferencia" al final.
- Si la zona seleccionada en `resData.zone` ya no existe en la config actual, recaer en "Sin preferencia".

## Archivos a modificar

- `src/components/public/DishModal.tsx`
- `src/data/mockData.ts`
- `src/pages/Dashboard.tsx`
- `src/pages/PublicRestaurant.tsx`

## Lo que NO se toca

- Tipado de zonas de mesas operativas (`TableType["zone"]`).
- Traducciones (las zonas configuradas por el dueño se mostrarán tal cual las escriba, sin i18n por ahora).
- Backend, datos persistidos (sigue todo en localStorage como el resto).
