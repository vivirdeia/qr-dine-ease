# Guía de contribución

> Este proyecto es público y remixable desde Lovable. Cualquiera puede crear su propia copia con un clic y adaptarla a su restaurante. Las contribuciones al repositorio original se centran en mejoras generales de la plantilla.

Gracias por contribuir a CARTA. Esta guía resume las convenciones y el flujo de trabajo del repositorio.

## Convenciones de código

- TypeScript estricto: evitar `any`, tipar props e hijos de componentes.
- Componentes en PascalCase, hooks en camelCase con prefijo `use`.
- Preferir composición sobre herencia y funciones puras.
- Estilos exclusivamente con Tailwind y tokens definidos en `src/index.css`. No hardcodear colores.
- Usar los componentes de `components/ui` (shadcn/ui) antes de crear uno nuevo.
- Los iconos vienen de `lucide-react` con `strokeWidth={1.5}`.
- Ejecutar `npm run lint` antes de abrir un PR y corregir cualquier warning nuevo.

## Estructura de commits

Se recomienda commits pequeños y con mensaje descriptivo. Formato sugerido:

```text
tipo(alcance): descripción breve

Cuerpo opcional con más contexto.
```

Tipos habituales: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`.

## Tests unitarios (Vitest)

Los tests viven junto al archivo bajo prueba o en `src/test/`. Configuración en `vitest.config.ts` y setup en `src/test/setup.ts` (jsdom + Testing Library).

```bash
npm run test          # Ejecuta la suite una vez
npm run test:watch    # Modo watch durante el desarrollo
```

Pautas:

- Usar `@testing-library/react` para renderizar componentes.
- Aserciones con `@testing-library/jest-dom`.
- Nombrar archivos `*.test.ts` o `*.test.tsx`.

## Tests end to end (Playwright)

La configuración está en `playwright.config.ts`. Los tests E2E cubren flujos completos sobre la app en ejecución.

```bash
npx playwright install    # Solo la primera vez
npx playwright test       # Ejecuta todos los tests
npx playwright test --ui  # Modo interactivo
```

Se recomienda tener el servidor de desarrollo activo (`npm run dev`) o configurar `webServer` en la config si aún no está.

## Flujo de ramas y PRs

1. Crear una rama desde `main` con nombre descriptivo: `feat/reservas-zonas`, `fix/modal-plato`, etc.
2. Hacer commits pequeños con mensajes claros.
3. Antes de abrir el PR:
   - `npm run lint`
   - `npm run test`
   - `npm run build`
4. Abrir el Pull Request contra `main` en GitHub.
5. Rellenar la descripción con: motivación, cambios principales, capturas si afectan a UI y pasos para probar.
6. Esperar revisión. Aplicar los cambios pedidos con nuevos commits (no reescribir la rama tras el review).
7. Squash & merge al aprobar.

## Sincronización con Lovable

El repositorio está vinculado al editor de Lovable. Los cambios hechos en Lovable se pushan automáticamente y los cambios hechos en GitHub se reflejan en Lovable. Evitar reescribir la historia (force push, rebase de ramas ya pusheadas) para no romper la sincronización.

## Reporte de bugs y feature requests

Abrir un issue en GitHub con:

- Descripción clara.
- Pasos para reproducir (en caso de bug).
- Captura o vídeo si aplica.
- Entorno (navegador, sistema).
