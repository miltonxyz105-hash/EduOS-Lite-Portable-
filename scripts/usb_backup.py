#!/usr/bin/env python3
"""
EduOS Lite :: Portabilidad USB + Respaldo Nube
-------------------------------------------------
Módulo 4:
  - Pocket-PC & USB Backup/Restore  (Plug-and-play portable workspace)
  - Auto Cloud-USB Sync            (Background when internet available)

Dependencias: stdlib (shutil, pathlib, subprocess, json, time, hashlib)
"""

import os
import sys
import json
import shutil
import socket
import hashlib
import platform
import subprocess
from pathlib import Path
from datetime import datetime

IS_WIN = platform.system() == "Windows"

STATE_FILE = Path(os.path.expanduser("~")) / ".eduos_usb_state.json"
USB_MARKER = ".eduos_portable"

STUDENT_FOLDERS = [
    "Documents/Tareas_Alumnos",
    "Documents/Apuntes",
    "Documents/Material_Edu",
    "Documents/Clases_Virtuales",
    "Documents/Libros_Digitales",
    "Pictures",
    ".config/eduos",
]

CLOUD_NAMES = [
    "Google Drive", "OneDrive", "Dropbox",
    "Nextcloud", "ownCloud", "Mega",
]


def find_usb_drives():
    drives = []
    if IS_WIN:
        import ctypes
        bitmask = ctypes.windll.kernel32.GetLogicalDrives()
        for i in range(26):
            if bitmask & (1 << i):
                letter = chr(65 + i) + ":\\"
                if ctypes.windll.kernel32.GetDriveTypeW(letter) == 2:
                    drives.append(Path(letter))
    else:
        user = os.environ.get("USER", "")
        roots = [Path("/media") / user, Path("/run/media") / user, Path("/mnt")]
        for root in roots:
            if not root.exists():
                continue
            try:
                for entry in root.iterdir():
                    try:
                        if entry.is_mount():
                            drives.append(entry)
                    except Exception:
                        pass
            except Exception:
                pass
    return drives


def ensure_student_folders(root: Path):
    for folder in STUDENT_FOLDERS:
        (root / folder).mkdir(parents=True, exist_ok=True)
    marker = root / USB_MARKER
    marker.write_text(
        json.dumps(
            {
                "created": datetime.now().isoformat(timespec="seconds"),
                "version": "eduos-lite-2.0",
                "type": "portable-workspace",
            },
            indent=2,
        )
    )


def file_hash(p: Path):
    if not p.is_file():
        return ""
    h = hashlib.sha256()
    try:
        with p.open("rb") as fp:
            while True:
                chunk = fp.read(65536)
                if not chunk:
                    break
                h.update(chunk)
    except Exception:
        return ""
    return h.hexdigest()[:16]


def load_state():
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            return {}
    return {}


def save_state(state: dict):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2))


def sync_dir(src: Path, dst: Path, state_key: str):
    copied, bytes_copied, skipped = 0, 0, 0
    if not src.exists():
        return copied, bytes_copied, skipped
    dst.mkdir(parents=True, exist_ok=True)
    state = load_state()
    hashes = state.setdefault(state_key, {})

    for root, dirs, files in os.walk(src):
        src_root = Path(root)
        rel = src_root.relative_to(src)
        target = dst / rel
        target.mkdir(parents=True, exist_ok=True)
        for fn in files:
            sp = src_root / fn
            rel_path = (rel / fn).as_posix() if str(rel) != "." else fn
            tp = dst / rel_path
            cur_hash = file_hash(sp)
            prev = hashes.get(rel_path)
            if prev == cur_hash and tp.exists():
                skipped += 1
                continue
            try:
                shutil.copy2(sp, tp)
                copied += 1
                try:
                    bytes_copied += sp.stat().st_size
                except Exception:
                    pass
                hashes[rel_path] = cur_hash
            except Exception:
                skipped += 1
    state[state_key] = hashes
    save_state(state)
    return copied, bytes_copied, skipped


def internet_available():
    try:
        socket.setdefaulttimeout(2)
        socket.gethostbyname("dns.google")
        return True
    except OSError:
        return False


def find_cloud_folders():
    home = Path.home()
    result = []
    for cf in CLOUD_NAMES:
        p = home / cf
        if p.is_dir():
            result.append(p)
    return result


def cmd_backup(usb: Path = None):
    home = Path.home()
    if usb is None:
        usb_candidates = find_usb_drives()
        if not usb_candidates:
            print(" [!] No se detectaron unidades USB.")
            sys.exit(2)
        usb = usb_candidates[0]
        print(f" [i] USB detectado: {usb}")

    usb_root = usb / "EduOS_Portable"
    ensure_student_folders(usb_root)
    total_copied, total_bytes = 0, 0
    for folder in STUDENT_FOLDERS:
        src = home / folder
        state_key = f"usb:{usb}/{folder}"
        target_folder = Path(folder).name if "/" in folder else folder
        c, b, s = sync_dir(src, usb_root / folder, state_key)
        total_copied += c
        total_bytes += b
    mb = total_bytes / (1024 ** 2)
    print(f" [OK] Respaldo USB completado.")
    print(f"      Archivos nuevos/actualizados: {total_copied}  (~{mb:.1f} MB)")
    return 0


def cmd_restore(usb: Path = None):
    home = Path.home()
    if usb is None:
        usb_candidates = find_usb_drives()
        if not usb_candidates:
            print(" [!] No se detectaron unidades USB para restaurar.")
            sys.exit(2)
        usb = usb_candidates[0]
    usb_root = usb / "EduOS_Portable"
    if not usb_root.exists():
        print(f" [!] No se encontro estructura EduOS_Portable en {usb}")
        sys.exit(3)
    total_copied, total_bytes = 0, 0
    for folder in STUDENT_FOLDERS:
        src = usb_root / folder
        state_key = f"restore:{usb}/{folder}"
        dst = home / folder
        c, b, s = sync_dir(src, dst, state_key)
        total_copied += c
        total_bytes += b
    mb = total_bytes / (1024 ** 2)
    print(f" [OK] Restauracion completada desde USB.")
    print(f"      Restaurados: {total_copied} archivos  (~{mb:.1f} MB)")
    return 0


def cmd_cloud_sync():
    if not internet_available():
        print(" [i] Sin internet. Sync en segundo plano (se reintentara luego).")
        return 1
    usb_list = find_usb_drives()
    cloud_list = find_cloud_folders()
    print(f" [i] USB detectado: {len(usb_list)}   Carpetas nube: {len(cloud_list)}")
    if not usb_list or not cloud_list:
        return 2
    usb = usb_list[0]
    usb_root = usb / "EduOS_Portable"
    ensure_student_folders(usb_root)
    total_copied, total_bytes = 0, 0
    for cloud in cloud_list:
        target = cloud / "EduOS_Backup"
        target.mkdir(parents=True, exist_ok=True)
        state_key = f"cloud:{cloud}"
        c, b, s = sync_dir(usb_root, target, state_key)
        total_copied += c
        total_bytes += b
    mb = total_bytes / (1024 ** 2)
    print(f" [OK] Sync USB <-> Nube completado.")
    print(f"      Carpetas nube: {len(cloud_list)}")
    print(f"      Archivos sincronizados: {total_copied}  (~{mb:.1f} MB)")
    return 0


def cmd_status():
    print("==============================================================")
    print(" EduOS Lite :: Portabilidad USB y Nube - Estado")
    print("==============================================================")
    usbs = find_usb_drives()
    print(f" USB detectadas    : {len(usbs)}")
    for u in usbs:
        portable = (u / "EduOS_Portable").exists()
        print(f"   · {u}   {'Workspace Portable' if portable else '(sin workspace)'}")
    clouds = find_cloud_folders()
    print(f" Carpetas en nube  : {len(clouds)}")
    for c in clouds:
        size_mb = 0
        try:
            total = sum(f.stat().st_size for f in c.rglob("*") if f.is_file())
            size_mb = total / (1024 ** 2)
        except Exception:
            pass
        print(f"   · {c}  (~{size_mb:.0f} MB)")
    net = "SI" if internet_available() else "NO (cola de reintento)"
    print(f" Internet          : {net}")
    st = load_state()
    print(f" Registros sync    : {len(st)} carpetas trackeadas")
    print("==============================================================")
    return 0


HELP = """Uso: python usb_backup.py [COMANDO]
  backup    - Hacer respaldo incremental al USB detectado.
  restore   - Restaurar desde USB al equipo local.
  sync      - Sincronizar USB con carpetas nube.
  status    - Mostrar estado de USBs, nube e internet.
  init      - Inicializar workspace portable en USB.
"""


def main():
    if len(sys.argv) < 2:
        print(HELP)
        cmd_status()
        sys.exit(0)
    c = sys.argv[1].lower()
    if c == "backup":
        sys.exit(cmd_backup())
    if c == "restore":
        sys.exit(cmd_restore())
    if c == "sync":
        sys.exit(cmd_cloud_sync())
    if c == "status":
        sys.exit(cmd_status())
    if c == "init":
        usbs = find_usb_drives()
        if not usbs:
            print(" [!] USB no detectado")
            sys.exit(2)
        ensure_student_folders(usbs[0] / "EduOS_Portable")
        print(f" [OK] Workspace portable creado en {usbs[0]}")
        sys.exit(0)
    print(HELP)
    sys.exit(1)


if __name__ == "__main__":
    main()
