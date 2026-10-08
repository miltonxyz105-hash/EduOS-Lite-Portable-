<div align="center">

# 🏫 EduOS Lite

**Government & Educational Portable Web OS**

[![Version](https://img.shields.io/badge/version-v2.0.0-blue?style=for-the-badge&logo=pinboard&logoColor=white)](./package.json)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Node](https://img.shields.io/badge/Node-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-yellowgreen?style=for-the-badge&logo=bookstack&logoColor=white)](#licencia)

---

[![Vercel · EduOS Lite](https://img.shields.io/badge/Vercel-Live-black?style=for-the-badge&logo=vercel&logoColor=white)](https://eduos-lite.vercel.app)
**Live Demo**: https://eduos-lite.vercel.app

Bundle ultra-optimizado · **~66 KB JS / ~6 KB CSS (gzip)**  
Funciona en netbooks legacy 1024×600 · dual-core · 2-4 GB RAM

</div>

---

## 📋 Descripción General

**EduOS Lite v2.0** es un prototipo de escritorio web 100% portable, optimizado para organismos gubernamentales y establecimientos educativos. Simula un entorno de escritorio (LockScreen → Desktop → Taskbar → Ventanas modales arrastrables) construido completamente con web standards (React + Vite + Tailwind), desplegable en 1-click y sin dependencias de kernel ni sistema operativo nativo.

Está pensado para correr directamente en el navegador de equipos legacy (netbooks 1024×600, laptops dual-core con 2 GB de RAM) y es fácilmente empaquetable como Pocket-PC en USB.

---

## ✨ Características Principales

### 🎯 Perfil Edu / Gobierno
| Módulo | Descripción |
|---|---|
| **Modo Estudio (Anti-Distracciones)** | Bloqueo de dominios no educativos + supresión de alertas, con contador de metas de sesión. |
| **Modo Batería Extrema** | Perfil de ahorro energético + throttling CPU en idle. |
| **Bloatware Shield** | Perfil que impide la ejecución de procesos pesados en segundo plano. |

### 🖥️ Optimización Hardware Bajo Recurso
- **Dynamic Resolution Scaling**: **1024×600 → 85%** · **1366×768 → 92%** · **Full HD → 100%** (automático).
- **Auto ZRAM** (script cross-platform): compresión dinámica de RAM virtual expandible.
- **CPU Core Pinning & Affinity** (script): aisla procesos de fondo y prioriza apps educacionales en foreground.

### 🧰 Herramientas de Sistema
- **RAM & System Cleaner (1-click)** · **Visor de Procesos simplificado** · **Lanzador Universal rápido**
- **Papelera + Explorador de Archivos** (Disco Local A: 2 TB con carpetas educativas)
- **Portabilidad USB & Cloud**: workspace estudiantil plug-and-play con sincronización USB ↔ Nube incremental.

### 🧱 UI · Interacción
- **LockScreen** con PIN de desbloqueo y branding oficial Gov/Edu
- **Escritorio** con iconos productivos (Archivos, Ajustes, Papelera, Limpiador, Procesos, Lanzador, Estudio, USB)
- **Ventanas modales 100% arrastrables** con minimizar, cerrar, z-order focus y clamp al viewport (nunca quedan ocultas bajo la taskbar)
- **Taskbar** con menú Inicio, contadores en vivo CPU/RAM, reloj, toggles de Modo Estudio y Modo Batería.

---

## 🏗️ Arquitectura & Tech Stack

| Capa | Tecnologías | Versión |
|---|---|---|
| **Lenguaje** | JavaScript (ESM) · JSX | ES2022 |
| **UI Framework** | React | `18.3.1` |
| **Bundler / Dev Server** | Vite | `5.4.1` |
| **Estilos** | Tailwind CSS + PostCSS + Autoprefixer | `3.4.13` |
| **Iconografía** | lucide-react (tree-shakeable) | `0.441.0` |
| **Gestión de Estado** | `useState` / `useRef` / `useEffect` + módulos puros `src/state/*` | React Hooks |
| **Build Target** | Static Site / SPA (rewrites a `index.html`) | Sin SSR |
| **Scripts cross-platform** (docencia) | Python stdlib + Bash + Batch (sin dependencias pip) | Python 3.10+ |
| **Despliegue** | Vercel (Production) · GitHub (origen) | Edición /milton17 /miltonxyz105-hash |

### 🔀 Estructura de Directorios (Clean)

```
eduos-lite/
├── src/                          # Código fuente de la SPA
│   ├── state/                    # Estado modular y helpers PUROS (sin React)
│   │   ├── screens.js            # LOW_RES_BREAKPOINTS + getUiScale + DEFAULT_APP_STATES
│   │   └── windows.js            # WINDOW_CONFIGS + make/close/toggle/focus/move/zIndexOf
│   ├── components/               # 13 componentes UI (pantallas + ventanas)
│   │   ├── App.jsx               # Orquestador de estado y pantallas
│   │   ├── main.jsx              # ReactDOM.createRoot entrypoint
│   │   ├── LockScreen.jsx        # Pantalla bloqueo (PIN)
│   │   ├── Desktop.jsx           # Fondo escritorio + iconos
│   │   ├── Taskbar.jsx           # Barra inferior + Start menu + CPU/RAM
│   │   ├── WindowManager.jsx     # Ventanas modales arrastrables + focus z-order
│   │   ├── FileExplorerWindow.jsx
│   │   ├── SettingsWindow.jsx    # Hardware / Perfil Edu / Pantalla / Acerca
│   │   ├── TrashWindow.jsx
│   │   ├── SystemCleanerWindow.jsx
│   │   ├── ProcessViewerWindow.jsx
│   │   ├── LauncherWindow.jsx
│   │   ├── StudyModeWindow.jsx   # Anti-Distraction Filter
│   │   └── USBSyncWindow.jsx     # USB ↔ Nube incremental
│   └── index.css                 # Directivas Tailwind (base/components/utilities)
├── scripts/                      # Scripts cross-platform (docencia / despliegue metal)
│   ├── optimize_hardware.py      # Auto ZRAM + CPU pinning + resolución
│   ├── ram_cleaner.{bat,sh}      # 1-click limpiar RAM y temporales
│   ├── study_mode.{bat,sh}       # Hosts block + Focus Assist
│   ├── battery_mode.{bat,sh}     # Powersave governor + CPU throttle
│   ├── bloatware_shield.{bat,sh} # Daemon 60 minutos
│   └── usb_backup.py             # USB backup/restore/sync/status/init
├── index.html                    # HTML entry (title: EduOS Lite · GovEdu)
├── package.json                  # name: eduos-lite · version: 2.0.0
├── vite.config.js                # @vitejs/plugin-react
├── tailwind.config.js            # content: ./index.html y src/**/*.{js,jsx}
├── postcss.config.js
├── vercel.json                   # Preset Vite + rewrites SPA + cache 1 año
├── .gitignore                    # node_modules · dist · .venv · .env · __pycache__ · logs · .vercel
└── README.md
```

---

## 🚀 Instalación y Desarrollo Local

**Requisitos previos:**
- **Node.js** ≥ 18 (incluye `npm`)
- **Python** ≥ 3.10 (solo si quieres probar los scripts `scripts/`; la SPA no lo requiere)

```bash
# 1. Clonar repositorio
git clone https://github.com/miltonxyz105-hash/eduos-lite.git
cd eduos-lite

# 2. Instalar dependencias
npm install

# 3. Levantar entorno dev (Vite · HMR · puerto 5173)
npm run dev
#   http://localhost:5173

# 4. Build producción estática → ./dist
npm run build
#   -> index.html + assets/index-*.{js,css} (≈ 241 KB / 28 KB raw, ≈ 66/6 KB gzip)

# 5. Preview build de producción (sirve ./dist en el puerto 4173)
npm run start
#   http://localhost:4173
```

### 🎛️ Configuración recomendada para equipos legacy
- Chrome / Edge 120+ o Firefox ESR 115+
- Resolución 1024×600 o superior (Dynamic Scaling auto aplica 85%)
- Procesador dual-core 1.2 GHz · 2 GB RAM · 500 MB disco

---

## ⚙️ Despliegue en Vercel (1-click)

Este repositorio ya incluye [vercel.json](./vercel.json) con el preset **Vite**, rewrites SPA y cache de 1 año para `assets/*`. Sólo necesitas importar el repo desde el dashboard de Vercel, o bien via CLI:

```bash
# Login único
vercel login

# Desplegar a producción
vercel --prod --yes
```

---

## 🖼️ Live Demo

> **🌐 URL pública permanente** — visita **https://eduos-lite.vercel.app**

| Recurso | Enlace |
|---|---|
| Producción (alias) | `https://eduos-lite.vercel.app` |
| Repositorio GitHub | `https://github.com/miltonxyz105-hash/eduos-lite` |

---

## 🤝 Contribución

1. Hace **fork** del proyecto.
2. Crea una **feature branch** (`git checkout -b feature/mi-modulo`).
3. Commitea tus cambios (`git commit -m 'feat(area): descripción corta'`).
4. Sube la branch (`git push origin feature/mi-modulo`).
5. Abre un **Pull Request** contra `main`.

**Lineamientos clave:**
- Cero animaciones pesadas y sin dependencias nuevas de terceros a menos que sea estrictamente necesario.
- Todo módulo debe ser tree-shakeable y mantener bundle ≤ 75 KB gzip.
- Los scripts de `scripts/` deben usar solo Python stdlib o Bash/Batch standard.

---

## 📄 Licencia

```
MIT License

Copyright (c) 2026 EduOS Lite Contributors (miltonxyz105-hash)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

---

<div align="center">
  <strong>EduOS Lite v2.0</strong> — Hecho para estudiantes y organismos públicos.
  <br/>
  Construido con <a href="https://react.dev">React</a> · <a href="https://vitejs.dev">Vite</a> · <a href="https://tailwindcss.com">Tailwind CSS</a> · Desplegado en <a href="https://vercel.com">Vercel</a>.
</div>
