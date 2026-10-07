# EduOS Lite Portable Refactor - Implementation Tasks (Spec Mode)

---

## Task 1: Grep anti-patterns simulador OS + validación de portabilidad
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Recorrer `src/` para detectar 7 anti-patrones no portables: nombres OSSimulator/HyperXOSKernel/HardcodedHardwareProbe/LegacyHack/BootRomHook o imports de módulos Node `os`, `child_process`, `ffi`.
  - Si hay coincidencias, refactorizar/eliminar.
  - Validar que index.html cargue React desde /src/main.jsx y no via CDN ni mock OS-loader.
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `rule` TR-1.1: `rg` por los 7 tokens + 3 módulos Node en `src/**` retorna 0 matches.
  - `rule` TR-1.2: `index.html` referencia solo scripts estándar Vite (`/src/main.jsx` como entry module).
- **Notes**: Se permite mantener constantes de branding "EduOS Lite" y "HyperX OS" como strings de UI.

---

## Task 2: Extraer state modules a `src/state/*` (windows + screens)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - Crear `src/state/windows.js`:
    - Exportar `WINDOW_CONFIGS` (id, title, icon, color, Component, default position/size).
    - Exportar helpers puros: `makeWindow(config, offsetIndex)`, `closeWindow(state, id)`, `toggleMinimize(state, id)`, `moveWindow(state, id, position)`.
  - Crear `src/state/screens.js`:
    - Exportar `LOW_RES_BREAKPOINTS` LOW/MED/HIGH.
    - Exportar `getUiScale(innerWidth)` helper puro.
  - Actualizar App.jsx: importar desde los nuevos state modules; borrar constantes literales del cuerpo; preservar comportamiento idéntico.
- **Acceptance Criteria Addressed**: AC-2, AC-7 (estabilidad dynamic scaling)
- **Test Requirements**:
  - `rule` TR-2.1: Archivos `src/state/windows.js` y `src/state/screens.js` existen y exportan las entidades listadas.
  - `rule` TR-2.2: App.jsx ya no declara `WINDOW_CONFIGS` ni `LOW_RES_BREAKPOINTS` inline.
  - `rubric` TR-2.3: Arquitectura state modules; escala 1-5; 1=sin separación, 3=separado pero helpers acoplados, 5=totalmente desacoplado, reutilizable y sin dependencias de React; pass ≥ 4.

---

## Task 3: Audit 8 ventanas + fixes pantallas blancas / handlers / layout shift
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - Para cada ventana (FileExplorer, Settings, Trash, SystemCleaner, ProcessViewer, Launcher, StudyMode, USBSync) y las 2 pantallas (LockScreen, Desktop):
    1. Revisar imports lucide-react (cada icono usado está importado).
    2. No llamar hooks condicionalmente; no definir constantes arrays/objetos grandes dentro del return.
    3. Props callback esperados por WindowManager (onClose/onMinimize/onFocus/onDrag zIndex) se pasan correctamente.
    4. Verificar className strings: evitar concatenaciones que pudieran devolver `undefined` (fallback siempre a string vacío o default clase).
    5. Tablas/grids con `w-full` y contenedor con `overflow-auto` para evitar shifts.
  - Fixes específicos si se detectan:
    - Si algún archivo tiene `<Archive>` reemplazar por iconos estables.
    - Si alguna tabla no tiene `border-collapse`, agregar.
    - Si algún state tiene setter sin uso (ej. `[x, setX]` sin usar), convertir a variable local.
- **Acceptance Criteria Addressed**: AC-3, AC-4
- **Test Requirements**:
  - `rule` TR-3.1: Cada uno de los 10 componentes (2 pantallas + 8 ventanas) tiene al menos un `export default function` válido y retorna JSX con 1 className raíz no vacío.
  - `rule` TR-3.2: Grep `import { [^}]+ } from 'lucide-react'` en cada componente; para cada `<Xxx` en el body existe `Xxx` en la lista de imports (excepción: HTML built-ins).
  - `rubric` TR-3.3: Consistencia visual de las ventanas; escala 1-5; 1=inconsistente, 3=medianamente consistente, 5=mismo patrón header/tabla/botonera en todas; pass ≥ 4.

---

## Task 4: Hardening WindowManager drag (independiente)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 3
- **Description**:
  - En `WindowManager.jsx` confirmar:
    - startDrag en `<div title-bar>` `onMouseDown` (NO en div padre contenedor).
    - UseRef `dragState` con startX/Y + origX/Y.
    - useEffect que agrega `window.mousemove/mouseup` (escapa la ventana sin perder).
    - Clamp `Math.max(0, orig+dx)` para x e y.
    - `e.button !== 0` early return (solo botón izquierdo).
    - onClose/onMinimize button tienen `e.stopPropagation()` para no disparar focus + drag.
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `rule` TR-4.1: Encontrar todas las 7 condiciones listadas en la descripción; todas presentes.
  - `rule` TR-4.2: onDrag de App.jsx actualiza la ventana indicada sin afectar otras.

---

## Task 5: Build clean + diagnostics 0 errores
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 1-4
- **Description**:
  - Ejecutar `npm run build` y anotar output.
  - Si hay warnings, resolverlos (ej. imports sin usar).
  - Correr `GetDiagnostics` para VSCode JS/JSX; corregir cualquier error/diagnóstico de severidad ≥ 8.
  - Repetir hasta 0 errores, 0 warnings importantes y bundle ≤ 75KB gz.
- **Acceptance Criteria Addressed**: AC-5, NFR-1, NFR-2, NFR-3, NFR-4
- **Test Requirements**:
  - `rule` TR-5.1: `npm run build` exit code 0.
  - `rule` TR-5.2: JS gzip ≤ 75 KB; CSS gzip ≤ 8 KB (se calcula como ~3.6x el raw tamaño reportado por Vite si no hay gzip numérico directo, o ver linea `gzip` si existe).
  - `rule` TR-5.3: `GetDiagnostics` vacío o solo severidades ≤ hints.

---

## Task 6: Git clean + commit refactor único + push origin/main
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 5
- **Description**:
  - Asegurar `.gitignore` incluye `node_modules/`, `dist/`, `.env*`, `.venv/`, `__pycache__/`, `*.log`, `.vercel/`.
  - Eliminar cualquier untracked temporal.
  - Commit: `refactor(portable): EduOS Lite SPA standalone - state modules, audit 10 screens, WM hardening, 0 build errors`
  - Push a `origin main`.
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `rule` TR-6.1: `.gitignore` contiene las 7 entradas clave.
  - `rule` TR-6.2: `git status --porcelain` después del push es vacío.
  - `rule` TR-6.3: `git push origin main` exit code 0.

---

## Task 7: Vercel deploy producción + validar alias live
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 6
- **Description**:
  - Confirmar `vercel.json` sigue presente con preset Vite, rewrites SPA, cache headers.
  - Ejecutar `vercel --prod --yes`.
  - Capturar alias producción y URL build final.
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `rule` TR-7.1: `vercel --prod` exit code 0.
  - `rule` TR-7.2: Output contiene línea `Production: https://*.vercel.app` y coincide con alias público conocido.
  - `rubric` TR-7.3: Eficiencia despliegue (tiempo, zero configuración manual); escala 1-5; 1=lento o manual, 3=auto con warnings, 5=auto rápido sin warning idéntico a entorno local; pass ≥ 4.

---

## (Review-Only) Tasks: Revisión Independiente
Ninguna tarea de implementación aquí. Ver `review.md` cuando las 7 tareas anteriores estén completadas.
