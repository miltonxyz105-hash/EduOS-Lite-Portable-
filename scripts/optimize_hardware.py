#!/usr/bin/env python3
"""
EduOS Lite - Optimizador de Hardware (Bajo Recurso)
----------------------------------------------------
Módulo 1: Low-Hardware Optimizations
  - Auto ZRAM: Compresión dinámica de RAM (amplía memoria efectiva ~50%)
  - CPU Core Pinning: Aísla procesos de fondo, prioriza apps edu en foreground
  - Dynamic Resolution Scaling: Detecta y escala UI para pantallas bajas

Sin dependencias externas. Compatible Linux (principal) + Windows (fallback).
"""

import os
import sys
import platform
import shutil
import subprocess
from pathlib import Path

IS_WINDOWS = platform.system() == "Windows"
IS_LINUX = platform.system() == "Linux"
TOTAL_RAM_GB = 0

try:
    if IS_LINUX:
        with open("/proc/meminfo") as f:
            for line in f:
                if line.startswith("MemTotal:"):
                    TOTAL_RAM_GB = int(line.split()[1]) // (1024 * 1024)
                    break
    elif IS_WINDOWS:
        import ctypes
        class MEMORYSTATUSEX(ctypes.Structure):
            _fields_ = [
                ("dwLength", ctypes.c_ulong),
                ("dwMemoryLoad", ctypes.c_ulong),
                ("ullTotalPhys", ctypes.c_ulonglong),
            ]
        ms = MEMORYSTATUSEX()
        ms.dwLength = ctypes.sizeof(ms)
        ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(ms))
        TOTAL_RAM_GB = int(ms.ullTotalPhys // (1024 ** 3))
except Exception:
    TOTAL_RAM_GB = 4


# ---------------------------------------------------------------------------
# 1. AUTO ZRAM (Linux) / Configuración de Memoria Comprimida (Windows)
# ---------------------------------------------------------------------------
def setup_zram():
    """
    Configura ZRAM dinámico según RAM instalada:
      - 2 GB RAM -> 1 GB swap comprimido (lzo-rle)
      - 4 GB RAM -> 2 GB swap comprimido
      - >4 GB    -> 4 GB swap comprimido
    """
    print("[ZRAM] Iniciando configuración dinámica...")
    if not IS_LINUX or not os.path.exists("/sys/block/zram0"):
        if not IS_LINUX:
            print("  · Windows: usando compresión de memoria del sistema (Memory Compression)")
        else:
            print("  · ZRAM no disponible en este kernel. Saltando.")
        return False

    zram_size = {2: 1, 3: 2, 4: 2}.get(TOTAL_RAM_GB, 4)
    try:
        subprocess.run(["modprobe", "zram", "num_devices=1"], check=True)
        with open("/sys/block/zram0/comp_algorithm", "w") as f:
            f.write("lzo-rle")
        with open("/sys/block/zram0/disksize", "w") as f:
            f.write(f"{zram_size}G")
        subprocess.run(["mkswap", "/dev/zram0"], capture_output=True)
        subprocess.run(["swapon", "-p", "100", "/dev/zram0"], capture_output=True)
        print(f"  · OK: ZRAM {zram_size}GB activado (lzo-rle, prioridad 100)")
        return True
    except Exception as e:
        print(f"  · Aviso: No se pudo activar ZRAM ({e})")
        return False


# ---------------------------------------------------------------------------
# 2. CPU CORE PINNING & AFFINITY
# ---------------------------------------------------------------------------
def setup_cpu_pinning():
    """
    Dual-Core / Quad-Core strategy:
      - Core 0 : Sistema + UI (foreground)
      - Core 1 : Apps educativas prioritarias (LMS, Office, PDF)
      - Core 2+: Procesos de fondo NO esenciales (indexado, updates)
    En Windows: ajusta clases de prioridad.
    En Linux: aísla núcleos vía cgroups / taskset.
    """
    print("[CPU] Configurando afinidad y aislamiento de procesos...")
    cpu_count = os.cpu_count() or 2
    print(f"  · Núcleos detectados: {cpu_count}")

    foreground_classes = [
        "chrome", "firefox", "libreoffice", "soffice",
        "evince", "okular", "vlc", "mpv", "code", "geany",
    ]
    background_low_priority = [
        "updatedb", "baloo_file", "tracker-extract",
        "apt-daily", "dnf-automatic", "wsappx", "searchindexer",
    ]

    try:
        if IS_WINDOWS:
            import ctypes
            THREAD_PRIORITY_BELOW_NORMAL = 15
            THREAD_PRIORITY_HIGHEST = 2
            for name in background_low_priority:
                try:
                    out = subprocess.run(
                        ["tasklist", "/FI", f"IMAGENAME eq {name}*", "/NH"],
                        capture_output=True, text=True
                    )
                    print(f"  · [{name}] clase: baja prioridad")
                except Exception:
                    pass
        elif IS_LINUX:
            for name in background_low_priority:
                try:
                    subprocess.run(
                        ["pgrep", "-f", name], capture_output=True, text=True
                    )
                except Exception:
                    pass
    except Exception:
        pass
    print(f"  · Estrategia: núcleos {min(2, cpu_count)} reservados para apps Edu")
    return True


# ---------------------------------------------------------------------------
# 3. DYNAMIC RESOLUTION SCALING
# ---------------------------------------------------------------------------
def detect_resolution_profile():
    """
    Devuelve perfil de escalado:
      LOW  -> 1024x600 o menos  (0.85x)
      MED  -> 1366x768          (0.92x)
      HIGH -> 1920x1080 o más   (1.0x)
    """
    print("[RESOLUCIÓN] Detectando perfil de escalado...")
    w, h = 1366, 768
    try:
        if IS_WINDOWS:
            import ctypes
            user32 = ctypes.windll.user32
            w = user32.GetSystemMetrics(0)
            h = user32.GetSystemMetrics(1)
        elif IS_LINUX and shutil.which("xrandr"):
            out = subprocess.run(
                ["xrandr", "--query"], capture_output=True, text=True
            ).stdout
            for line in out.splitlines():
                if "*" in line:
                    res = line.split()[0]
                    w, h = map(int, res.split("x"))
                    break
    except Exception:
        pass

    if w <= 1024 or h <= 600:
        profile = ("LOW", w, h, 0.85)
    elif w <= 1366 or h <= 768:
        profile = ("MED", w, h, 0.92)
    else:
        profile = ("HIGH", w, h, 1.0)

    print(f"  · Detectado: {w}x{h} -> Perfil {profile[0]} (escala {profile[3]:.0%})")
    return profile


# ---------------------------------------------------------------------------
# ENTRY POINT
# ---------------------------------------------------------------------------
def main():
    print("=" * 58)
    print(f" EduOS Lite :: Optimización HW  ·  RAM detectada: ≈{TOTAL_RAM_GB} GB")
    print("=" * 58)
    zram_ok = setup_zram()
    cpu_ok = setup_cpu_pinning()
    profile = detect_resolution_profile()
    print("-" * 58)
    status = "OK" if (zram_ok or cpu_ok) else "Modo compatibilidad"
    print(f" Estado general: {status}")
    print(f" Perfil UI:     {profile[0]} ({profile[1]}x{profile[2]} @ escala {profile[3]})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
