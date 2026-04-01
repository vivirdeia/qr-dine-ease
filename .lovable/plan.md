

# Análisis: ¿Qué falta para que funcione de punta a punta?

## Bugs críticos que rompen el flujo

### 1. ProtectedRoute redirige al sitio equivocado
En `App.tsx` línea 17, `ProtectedRoute` redirige a `/dashboard` en vez de a `/register`:
```
if (!isLoggedIn) return <Navigate to="/dashboard" replace />; // ← BUCLE INFINITO
```
Debería ser `/register`. Además, `/dashboard` **no está envuelto** en `<ProtectedRoute>` (línea 39), así que cualquiera puede acceder sin login.

### 2. "Iniciar sesión" en la Landing apunta a `/dashboard` directamente
Línea 33 de Landing.tsx: `<Link to="/dashboard">Iniciar sesión</Link>`. No hay página de login independiente — el login está dentro del Dashboard. Si se protege la ruta, el usuario no podrá hacer login porque le redirige a `/register` en un bucle.

### 3. El onboarding no asigna categoría al primer plato
Línea 138: `categoryId: ""` — el plato se crea sin categoría, así que no aparece en la carta.

### 4. Tras registro, los datos mock siguen cargados
Al registrarse un usuario nuevo y completar el onboarding, los platos, categorías y vinos de "Casa Martín" siguen ahí. El usuario nuevo ve datos de otro restaurante.

## Plan de corrección

### Cambio 1: Arreglar protección de rutas + crear página de Login
- Corregir `ProtectedRoute` para redirigir a `/login`
- Crear ruta `/login` con formulario de email/password (extraer el login actual del Dashboard a su propia página)
- Envolver `/dashboard` en `<ProtectedRoute>`
- Landing: "Iniciar sesión" → `/login`

### Cambio 2: Limpiar datos al registrar usuario nuevo
- En `register()`, resetear `dishes`, `categories`, `wines`, `reservations`, `tables` a arrays vacíos (o un set mínimo según el onboarding)
- Solo cargar datos mock para el usuario `demo@carta.app`

### Cambio 3: Asignar categoría al primer plato del onboarding
- Guardar el ID de la categoría recién creada y pasarlo al `addDish`
- Cambiar el `setTimeout` por un flujo síncrono correcto

### Cambio 4: Flujo de login desde Landing
- Crear `src/pages/Login.tsx` con formulario simple + link a "Crear cuenta" (`/register`)
- Botón "¿Olvidaste tu contraseña?" (placeholder sin funcionalidad real)

### Archivos afectados
| Archivo | Cambio |
|---------|--------|
| `src/pages/Login.tsx` | **Nuevo** — página de login independiente |
| `src/App.tsx` | Arreglar ProtectedRoute, añadir ruta `/login`, proteger `/dashboard` |
| `src/pages/Landing.tsx` | "Iniciar sesión" → `/login` |
| `src/context/AppContext.tsx` | `register()` limpia datos mock, `addCategory` retorna ID |
| `src/pages/Register.tsx` | Usar ID de categoría al crear primer plato |
| `src/pages/Dashboard.tsx` | Quitar el formulario de login embebido (ya no hace falta) |

