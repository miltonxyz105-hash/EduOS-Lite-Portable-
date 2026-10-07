# EduOS Lite - Portable Web App Refactor (Spec Mode)

## Overview
- **Summary**: Refactorización a fondo y despliegue del prototipo de escritorio web (anteriormente "HyperXOS Web OS Simulation") para convertirlo en una Aplicación Web 100% portable, modular, estándar, auto-contenida y desplegable en Vercel — sin vestigios de simulador de SO ni hacks no estándar.
- **Purpose**: Hacer que el producto cumpla con los estándares Gov/Edu del tender: portabilidad nube/USB, auditabilidad, fiabilidad runtime, cero errores build/consola, despliegue 1-click.
- **Target Users**: Estudiantes, docentes, administradores de tenders educativos/gubernamentales; devops que despliegan a Vercel; equipos de auditoría técnica de portabilidad.

## Goals
1. Eliminar 100% de los "mock wrappers de SO web" no estándar y dejar una SPA estándar (Lock/Desktop/Windows → patrón pantallas + overlays en React puro).
2. Modularizar state management en `src/state/*` para poder mover/editar cada vista sin acoplamiento.
3. Auditar todas las pantallas, ventanas y handlers interactivos; corregir bugs de runtime, pantallas blancas, layout shifts y handlers rotos.
4. Validar build `npm run build` con 0 errores, 0 warnings críticos, bundle gzip ≤ 75KB.
5. Git clean, `.gitignore` correcto, commit único limpio, push a GitHub origin/main.
6. Deploy producción Vercel (`vercel --prod`) con live URL funcionando idéntico al entorno local.

## Non-Goals
- No reescribir la app a Next.js / Remix / TypeScript (se mantiene Vite + React + Tailwind).
- No implementar backend real (scripts/ quedan como material docente sin invocarse desde el frontend).
- No agregar nuevas pantallas de usuario más allá de las 8 ventanas y 2 pantallas (Lock/Desktop) existentes.
- No cambiar branding visual GovEdu (azul/educacional) ni las métricas en vivo.

## Background & Context
- Stack existente: Vite, React 18.3, Tailwind 3, lucide-react.
- Refactors previos: eliminación de GameLauncher (gaming/telemetría), 5 componentes Edu nuevos (Study/Launcher/Cleaner/Process/USBSync), Dynamic Resolution Scaling.
- Bugs conocidos históricos: pantallas blancas por iconos lucide no exportados, ventanas no dragueables, state acoplado en App.jsx.
- Repo histórico GitHub: `https://github.com/miltonxyz105-hash/hyperx-os` (origen ya configurado en sesiones previas).
- Deploy histórico Vercel: alias `hyperx-os-one.vercel.app`, equipo milton17.

## Functional Requirements
- **FR-1** (Pantallas): App arranca siempre con `<LockScreen>` y al desbloquear muestra `<Desktop>` + `<Taskbar>` + ventanas.
- **FR-2** (Ventanas): 8 ventanas oficiales (files / settings / trash / cleaner / processes / launcher / study / usbsync) deben renderizarse con título correcto, icono visible, y handlers de open/close/minimize/focus/drag.
- **FR-3** (Drag & Drop): Todas las ventanas son arrastrables libremente desde su title-bar, sin salir del área superior-izquierda (x≥0, y≥0).
- **FR-4** (Auditoría screens): Cada ventana al abrirse NO debe causar ReferenceError, pantalla blanca, shift en layout del Desktop ni warnings inesperados.
- **FR-5** (Git): Repo limpio; `.gitignore` excluye estrictamente node_modules, dist, .env, .venv, __pycache__, *.log, .vercel; Working tree solo tiene archivos necesarios.
- **FR-6** (Deploy): `npm run build` y `vercel --prod` ambos exit code 0; deploy live retorna URL accesible.
- **FR-7** (Dynamic Scaling): Low 1024→85%, Med 1366→92%, High→100%.

## Non-Functional Requirements
- **NFR-1** (Portabilidad): App corre 100% standalone con `npm install && npm run dev` sin dependencias externas más allá de package.json.
- **NFR-2** (Bundle): `dist/assets/*.js` gzip ≤ 75 KB; `dist/assets/*.css` gzip ≤ 8 KB.
- **NFR-3** (Diagnósticos): 0 errores TypeScript/VSCode Diagnostics en archivos `.jsx/.js` de src/.
- **NFR-4** (Consola): En dev build inicial y producción no deben aparecer uncaught exceptions de React runtime.

## Constraints
- **Technical**: React 18, Hooks solo en body de función, no Context Providers innecesarios.
- **Business**: Mantener el set de scripts/ como material docente sin invocarlos desde el frontend.
- **Dependencies**: No agregar nuevas librerías de terceros (todo lo necesario ya está en package.json).

## Assumptions
1. `git remote -v` ya apunta al repo GitHub oficial de HyperXOS/EduOS (origen ya configurado).
2. Token `gh` y token Vercel ya están configurados en el CLI de esta máquina (han funcionado en commits/despliegues previos).
3. El usuario NO pide crear repositorio nuevo; solo mantenimiento y push al origin actual.

## Acceptance Criteria

### AC-1: App es 100% portable SPA sin wrappers de simulador
- **Type**: `rule`
- **Given**: Se abre el repositorio en el root
- **When**: Se inspecciona `src/App.jsx`, `src/state/*`, `src/components/*`
- **Then**: No existen clases/funciones/mocks con nombres "OSSimulator", "HyperXOSKernel", "HardcodedHardwareProbe", "LegacyHack", "BootRomHook", ni importaciones de "os", "child_process", "ffi" o bindings nativos desde el frontend. Toda la UI es React puro sobre DOM standard.
- **Pass Condition**: Grep por los 7 anti-patrones devuelve 0 matches en `src/`
- **Evidence**: Resultado de `rg -c -g 'src/**'` anti-patterns + lectura de App.jsx entrypoint.

### AC-2: Modularización state + ventanas (bajo acoplamiento)
- **Type**: `rule`
- **Given**: Refactor terminado
- **When**: Se listan archivos nuevos/renombrados
- **Then**: Existe `src/state/windows.js` (constantes WINDOW_CONFIGS y helpers) y `src/state/screens.js` (estados de escalado + mode booleans). App.jsx NO contiene los literales de config inline.
- **Pass Condition**: Ambos archivos existen y App.jsx los importa; sin duplicación de config en body.
- **Evidence**: Tree de src/ y lectura fragmento imports de App.jsx.

### AC-3: 8 Ventanas auditadas y funcionales (sin pantallas blancas)
- **Type**: `rule`
- **Given**: App ejecutándose en dev o build producción
- **When**: Se abre cada una de las 8 ventanas una por una y luego se cierra
- **Then**: Ninguna ventana causa ReferenceError, pantalla 100% blanca ni excepción capturada. Todas muestran su contenido y el título coincide con su id.
- **Pass Condition**: Build producción pasa y las 8 ventanas tienen en su código al menos un elemento visible (div header / tab / table) que corresponde a su dominio.
- **Evidence**: Build output OK + verificación estructura de cada Window.

### AC-4: Drag & Drop libre y estabilidad
- **Type**: `rule`
- **Given**: Una ventana abierta
- **When**: Se produce mousedown en title-bar, move 50px, mouseup. Luego mousedown content area, move 30px
- **Then**: Solo el primer gesture debe cambiar position.x/y; el segundo no debe. Position jamás < 0.
- **Pass Condition**: WindowManager.jsx implementa listener global window + `Math.max(0, ...)` clamp + `e.stopPropagation()` y startDrag atado a title-bar `onMouseDown` (no content).
- **Evidence**: Código WindowManager fragmento drag.

### AC-5: Build 0 errores, bundle gzip ≤ 75 KB
- **Type**: `rule`
- **Given**: Node 18+, `npm install` hecho
- **When**: Se ejecuta `npm run build`
- **Then**: Exit code 0; stats reportan JS ≤ 75 KB gz, CSS ≤ 8 KB gz
- **Pass Condition**: Build output muestra línea `built in Xs` sin warnings críticos, bundle ≤ umbral
- **Evidence**: Output completo `npm run build`

### AC-6: Git estado limpio + commit único refactor + push
- **Type**: `rule`
- **Given**: Working tree después de implementación
- **When**: `git status --porcelain`, `git diff --stat HEAD`
- **Then**: 0 entries untracked; todos los cambios están commit-eados en 1 commit de refactor + 1 commit de deploy (si se requiere tocar vercel.json). Push retorna success.
- **Pass Condition**: `git status` returns vacío y `git push` exit code 0
- **Evidence**: Captura de `git status`, `git log -1`, `git push` final

### AC-7: Vercel Production live y URL accesible
- **Type**: `rule`
- **Given**: Build local OK
- **When**: Se corre `vercel --prod --yes`
- **Then**: Exit code 0; imprime `Production: https://*.vercel.app` y alias público conocido
- **Pass Condition**: URL impresa y match contra alias conocido
- **Evidence**: Output last 12 líneas vercel --prod y alias listado

### AC-8: Calidad arquitectónica y legibilidad
- **Type**: `rubric`
- **Dimension**: Modularidad / bajo acoplamiento / limpieza código EduOS
- **Scale**: 1-5
- **Anchors**: 1 = todo monolítico en App.jsx, 3 = estado modular pero componentes acoplados, 5 = estado, componentes y config perfectamente separados, sin imports sin usar, nombres de archivo y props descriptivos
- **Pass Threshold**: ≥ 4
- **Evidence**: Inspección de src/ tree + imports/exports + presencia hooks adecuados por componente

## Open Questions
- [x] ¿Repositorio GitHub nuevo / existente? → Usar origin/main existente `hyperx-os` como en sesiones previas (sin crear repo nuevo).
- [x] ¿Nuevas pantallas? → No, scope es refactorizar pantallas ya existentes.
