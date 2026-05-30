# Multi-tenant + roles con localStorage

Mantenemos todo en `localStorage`, pero reestructuramos los datos para soportar **varios restaurantes (tenants) y varios usuarios con roles**.

## Modelo de datos nuevo

Hoy hay una clave por entidad (`carta_dishes`, `carta_restaurant`, etc.) compartida. La cambiamos a un único árbol indexado por `tenantId`:

```text
carta_db = {
  users: [
    { id, email, passwordHash, name, role: "superadmin" | "owner" | "staff", tenantId | null }
  ],
  tenants: [
    { id, slug, plan: "free"|"pro"|"business", createdAt, ownerId }
  ],
  data: {
    [tenantId]: {
      restaurant, categories[], dishes[], wines[],
      tables[], reservations[], dailyMenu,
      notifications, appNotifications[]
    }
  },
  session: { userId } | null
}
```

Clave única en localStorage: `carta_db`. Todo lo demás se deriva.

## Roles

| Rol | Qué puede hacer |
|-----|----------------|
| **superadmin** | Ver panel global: lista de todos los tenants, usuarios, métricas agregadas, cambiar planes, suspender cuentas, impersonar |
| **owner** | Dueño del restaurante. CRUD completo de su tenant, invitar staff, gestionar plan |
| **staff** | Empleado. Ver carta, gestionar reservas del día, marcar platos no disponibles. No puede borrar, no ve facturación, no invita |

Helpers: `hasRole(role)`, `canEdit()`, `isSuperadmin()`.

## Cambios concretos

### `src/context/AppContext.tsx` — refactor mayor
- Una sola clave `carta_db` con el árbol completo
- `currentUser` y `currentTenant` derivados de `session.userId`
- Todos los CRUD escriben en `data[currentTenant.id]`
- `login` busca en `users[]` (hash simple tipo btoa, no es seguridad real pero evita texto plano)
- `register` crea `user` + `tenant` + `data[tenantId]` vacío y asigna `role: "owner"`
- Hook `useAuth()` expone `user`, `tenant`, `role`, `can(action)`

### `src/pages/SuperAdmin.tsx` — nuevo
- Lista de tenants con plan, nº de platos, nº de reservas, fecha de alta
- Lista de usuarios con su rol y tenant
- Acciones: cambiar plan, suspender tenant, impersonar (login como ese owner para depurar), borrar
- Métricas globales: MRR simulado, total restaurantes, total reservas

### `src/pages/Dashboard.tsx`
- Sección "Equipo" nueva (solo owner): invitar staff por email, ver miembros, cambiar rol, eliminar
- Ocultar/deshabilitar acciones según rol (staff no ve "Ajustes" ni "Eliminar restaurante")
- Mostrar badge del rol en header

### `src/App.tsx`
- `ProtectedRoute` acepta `requiredRole`
- Ruta nueva `/admin` protegida con `requiredRole="superadmin"`
- Redirección post-login: superadmin → `/admin`, resto → `/dashboard`

### `src/pages/PublicRestaurant.tsx`
- En vez de leer del tenant actual, lee `data[tenantId]` resolviendo por `slug`
- Así diferentes URLs `/r/casa-martin` y `/r/la-tasca` muestran datos distintos del mismo localStorage

### `src/pages/Login.tsx` + `Register.tsx`
- Login funciona contra `users[]` global
- Register crea owner+tenant en una transacción

## Cuenta superadmin

Sembrada al primer arranque si no existe:
```text
email: admin@carta.app
password: admin1234
role: superadmin
tenantId: null
```

Visible solo como nota en `/login` cuando estés en modo dev (no en la UI pública).

## Migración de datos existentes

Al cargar la app, si encuentra las claves viejas (`carta_dishes`, etc.) y no existe `carta_db`, las migra automáticamente: crea un tenant "demo" con el usuario actual como owner y mueve todo dentro. Luego borra las claves viejas.

## Limitaciones que asumimos (al seguir con localStorage)

- Cada navegador tiene su propio "universo" — no se comparte entre dispositivos
- "Multi-tenant" significa que **en un mismo navegador** puede haber varios restaurantes y usuarios, útil para demo/superadmin
- Staff invitado solo puede entrar desde el mismo navegador donde fue creado (o reintroduciendo sus credenciales manualmente)
- No hay seguridad real: cualquiera con devtools ve todo. Es un prototipo funcional, no producción

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `src/context/AppContext.tsx` | Refactor completo al modelo `carta_db` + roles + multi-tenant |
| `src/pages/SuperAdmin.tsx` | **Nuevo** panel global |
| `src/pages/Dashboard.tsx` | Sección Equipo, guards por rol, badge rol |
| `src/pages/Login.tsx` | Login contra `users[]` |
| `src/pages/Register.tsx` | Crear tenant + owner |
| `src/pages/PublicRestaurant.tsx` | Resolver tenant por slug |
| `src/App.tsx` | Ruta `/admin`, `requiredRole`, redirect por rol |
| `src/data/mockData.ts` | Tipos `User`, `Tenant`, `Role` |

¿Procedo?
