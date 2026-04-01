

# Plan: Mejorar el header de la carta pública

## Problema
El header actual tiene problemas de legibilidad: el nombre "Casa Martín" y el subtítulo se superponen sobre la imagen hero sin suficiente contraste. El gradiente es demasiado sutil y los controles (idioma, compartir) se pierden visualmente.

## Solución

### Cambios en `src/pages/PublicRestaurant.tsx` (líneas 56-74)

1. **Aumentar altura de la imagen hero**: de `h-48` a `h-56` para dar más espacio
2. **Mejorar gradiente de overlay**: hacer el degradado más oscuro y alto (`h-32` con `from-black/70`) para que el texto sea legible sobre cualquier imagen
3. **Texto en blanco sobre el overlay**: nombre, subtítulo y badge en blanco/semitransparente para máximo contraste
4. **Botones con fondo semitransparente oscuro**: `bg-black/30 backdrop-blur` para los controles de idioma y compartir
5. **Mover todo el contenido de texto dentro del overlay** (posición absoluta sobre la imagen) en vez del truco actual de `margin-top negativo` que causa el solapamiento feo

### Resultado visual
- Imagen hero grande con gradiente oscuro en la parte inferior
- Nombre del restaurante en blanco/bold sobre el gradiente
- Subtítulo en blanco/70% opacidad
- Badge "Abierto" con fondo semitransparente
- Controles con backdrop-blur

### Archivos
| Archivo | Cambio |
|---------|--------|
| `src/pages/PublicRestaurant.tsx` | Refactorizar header (líneas 56-74) |

