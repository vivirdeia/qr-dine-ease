

# Plan: Flujo completo simulado de registro y suscripción

## Resumen
Crear el flujo completo: **Landing → Registro → Selección de plan → Checkout simulado → Onboarding wizard → Dashboard**, todo con localStorage (sin backend).

## Flujo del usuario

```text
Landing (/) 
  └─ CTA "Crear mi carta gratis" o "Comenzar" en un plan
       └─ Registro (/register) — nombre, email, password
            └─ Selección de plan (/register?step=plan) — Free / Pro / Business
                 └─ Si plan de pago → Checkout simulado (/register?step=checkout)
                      └─ Formulario fake de tarjeta (4242...) → confirmación
                 └─ Si Free → salta checkout
                      └─ Onboarding wizard (/register?step=onboarding)
                           └─ 3 pasos: datos básicos, horarios, primera categoría/plato
                                └─ Dashboard (/dashboard) con datos del wizard
```

## Cambios por archivo

### 1. `src/pages/Register.tsx` (NUEVO)
- Página multi-step con estado `step: "signup" | "plan" | "checkout" | "onboarding"`
- **Step 1 — Registro**: nombre del restaurante, email, contraseña. Guarda en localStorage como usuario registrado.
- **Step 2 — Plan**: muestra los 3 planes con features. El plan se selecciona y guarda. Si viene desde un CTA de plan específico, se preselecciona.
- **Step 3 — Checkout** (solo si Pro/Business): formulario simulado de tarjeta (número, fecha, CVV). Botón "Pagar €29/mes". Simula un delay de 2s con spinner → confirmación con confetti/toast.
- **Step 4 — Onboarding wizard** (3 sub-pasos):
  - Paso 1: Nombre restaurante, dirección, teléfono, tipo de cocina
  - Paso 2: Horarios (mañana/noche, días de la semana)
  - Paso 3: Crear primera categoría + primer plato (nombre, precio, descripción)
- Al finalizar: guarda todo en localStorage via AppContext y redirige a `/dashboard`

### 2. `src/pages/Landing.tsx`
- Los CTAs de "Crear mi carta gratis" apuntan a `/register`
- Los botones "Comenzar" de cada plan apuntan a `/register?plan=free|pro|business`
- "Iniciar sesión" sigue apuntando a `/dashboard`

### 3. `src/context/AppContext.tsx`
- Añadir campo `userPlan: "free" | "pro" | "business"` al estado
- Añadir campo `userEmail: string` y `userName: string`
- Nuevo método `register(email, password, name)` que crea la sesión
- Actualizar `login` para verificar contra el usuario registrado en localStorage

### 4. `src/pages/Dashboard.tsx`
- La sección de Facturación lee `userPlan` del contexto en vez del texto estático "PRO"
- "Gestionar suscripción" abre un modal donde se puede cambiar de plan (simulado)
- Si el usuario está en plan Free, mostrar un banner sutil "Upgrade a Pro" con las features que se desbloquean

### 5. `src/App.tsx`
- Añadir ruta `/register` → `Register.tsx`

## Detalles técnicos

- Sin backend: todo es localStorage. El "pago" es simulado (delay + toast de éxito)
- El checkout acepta cualquier número de tarjeta (es una demo)
- El onboarding sobreescribe los datos mock con los datos reales del usuario
- Progress bar visual en la parte superior del registro (4 pasos)
- Mobile-first: diseñado para 390px primero, responsive para desktop
- Credenciales dinámicas: tras registrarse, el login funciona con el email/password elegidos (ya no solo demo@carta.app)

