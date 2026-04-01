

# Plan: Añadir fotos a la categoría Bebidas

## Problema
Los 5 platos de la categoría "Bebidas" (d21-d25) no tienen imágenes asignadas en `dishImages.ts`, mostrando un placeholder de gradiente.

## Solución

### 1. Generar 5 imágenes de bebidas
Crear en `src/assets/dishes/`:
- `vino-tinto-copa.jpg` — Copa de vino tinto
- `cerveza-artesana.jpg` — Cerveza artesana en vaso
- `agua-mineral.jpg` — Botella de agua mineral con vaso
- `refrescos.jpg` — Refrescos variados
- `cafe-cortado.jpg` — Café cortado de especialidad

### 2. Actualizar `src/data/dishImages.ts`
Añadir imports y mapear d21-d25 a las nuevas imágenes.

### Archivos
| Archivo | Cambio |
|---------|--------|
| `src/assets/dishes/*.jpg` | 5 imágenes nuevas |
| `src/data/dishImages.ts` | Añadir d21-d25 |

