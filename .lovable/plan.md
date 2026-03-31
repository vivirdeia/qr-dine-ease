

# Plan: Hacer Carta funcional sin base de datos (con localStorage)

## Resumen

Actualmente la app es una maqueta estática: todos los datos vienen de `mockData.ts` como constantes y ningún botón (guardar, añadir, editar, eliminar, confirmar reserva) hace nada real. El plan convierte la app en una demo 100% funcional usando **React state + localStorage** para persistencia.

## Qué falta exactamente

1. **Sin gestión de estado**: los datos mock son constantes importadas, no estado reactivo
2. **Botones decorativos**: Guardar, Añadir plato, Editar, Duplicar, Eliminar, Confirmar/Cancelar reserva — ninguno funciona
3. **Formularios sin lógica**: el modal de plato no guarda, el formulario de restaurante no es editable
4. **Reserva pública no persiste**: el flujo de reserva del comensal muestra "confirmada" pero no añade nada
5. **Toggles estáticos**: servicios, notificaciones, disponibilidad de platos, menú del día — no cambian
6. **Sin login simulado**: `/dashboard` accesible sin autenticación
7. **Sin persistencia**: al recargar se pierde todo

## Plan de implementación

### 1. Crear capa de estado con localStorage (~nuevo archivo)
- **`src/hooks/useLocalStorage.ts`** — hook genérico `useLocalStorage<T>(key, initialValue)` que sincroniza estado React con localStorage
- **`src/context/AppContext.tsx`** — Context provider con todo el estado mutable:
  - `dishes`, `categories`, `wines`, `dailyMenu`, `tables`, `reservations`, `restaurant`
  - Funciones CRUD: `addDish`, `updateDish`, `deleteDish`, `duplicateDish`, `toggleDishAvailability`, `addReservation`, `updateReservationStatus`, `updateRestaurant`, `addTable`, `updateTable`, `deleteTable`, `updateDailyMenu`, `addCategory`, etc.
  - Inicializado desde mockData, persistido en localStorage

### 2. Dashboard — Carta funcional
- Modal de plato: formulario controlado con todos los campos (nombre, descripción, precio, alérgenos, dietéticos, nota del chef, disponible, nuevo) → `addDish` / `updateDish`
- Botón "Eliminar" con confirmación → `deleteDish`
- Botón "Duplicar" → `duplicateDish`
- Toggle "Disponible/Agotado" directo en la tarjeta
- "Añadir categoría" con modal simple
- "Actualizar menú del día" con formulario editable
- Drag-and-drop de reordenación (posición en el array)

### 3. Dashboard — Restaurante editable
- Convertir campos de solo lectura a inputs editables
- Horarios editables con toggles abierto/cerrado
- Toggles de servicios funcionales
- Botón "Guardar cambios" que persiste

### 4. Dashboard — Reservas funcionales
- "Nueva reserva" con modal completo (nombre, teléfono, personas, fecha, hora, mesa, notas)
- Botones "Confirmar" / "Cancelar" / "No-show" / "Completar" que cambian estado
- Filtros por estado y fecha en la tabla

### 5. Dashboard — Mesas funcionales
- "Añadir mesa" con modal (número, capacidad, zona, combinable)
- Editar mesa al hacer clic
- Cambiar estado (libre/reservada/ocupada/fuera de servicio)
- Eliminar mesa

### 6. Dashboard — Configuración funcional
- Toggles de notificaciones que cambian y persisten
- Configuración de reservas editable (confirmación auto/manual, antelación, etc.)

### 7. Página pública — Reserva real
- Al completar el flujo de reserva en `/r/:slug`, añadir la reserva al estado global
- La reserva aparece automáticamente en el dashboard de reservas
- Toast de confirmación

### 8. Login simulado
- Pantalla de login simple en `/dashboard` si no hay sesión
- Email + contraseña hardcoded (demo@carta.app / demo1234)
- Sesión en localStorage
- Botón de logout en el avatar del dashboard

### 9. Toasts y feedback
- Toast en cada acción: "Plato añadido", "Reserva confirmada", "Mesa eliminada", etc.
- Confirmación antes de eliminar (dialog)

## Archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| `src/hooks/useLocalStorage.ts` | Crear |
| `src/context/AppContext.tsx` | Crear |
| `src/App.tsx` | Envolver con AppProvider |
| `src/pages/Dashboard.tsx` | Refactorizar completamente para usar contexto y hacer todo interactivo |
| `src/pages/PublicRestaurant.tsx` | Conectar flujo de reserva al contexto |

## Detalles técnicos

- React Context + `useReducer` para gestión de estado predecible
- `localStorage` con serialización JSON, inicializado desde mockData en la primera carga
- Los datos mock originales se mantienen como "seed" inicial
- Sin librerías adicionales necesarias (ya tenemos sonner para toasts)

