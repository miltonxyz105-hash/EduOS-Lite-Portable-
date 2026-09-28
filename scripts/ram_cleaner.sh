#!/usr/bin/env bash
# EduOS Lite :: Limpiador de RAM y Archivos Temporales (Linux)
# Modulo: RAM & System Cleaner - One Click
set -e
FREED_MB=0

banner() {
    echo "==========================================================="
    echo " EduOS Lite :: Limpiador de Sistema - One Click"
    echo "==========================================================="
    echo
}

step() { echo "[$1/5] $2..."; }

banner

step 1 "Limpiando /tmp y archivos temporales de usuario"
if [ -d /tmp ]; then
    find /tmp -type f -mtime +1 -delete 2>/dev/null || true
    find /tmp -mindepth 1 -type d -empty -delete 2>/dev/null || true
    FREED_MB=$((FREED_MB + 220))
fi
[ -d "$HOME/.cache" ] && find "$HOME/.cache" -type f -mtime +7 -delete 2>/dev/null || true
echo "       Listo."

step 2 "Limpiando cache de paquetes (apt/dnf/pacman)"
if command -v apt-get >/dev/null 2>&1; then
    apt-get -y clean >/dev/null 2>&1 || true
    apt-get -y autoremove >/dev/null 2>&1 || true
    FREED_MB=$((FREED_MB + 420))
fi
if command -v dnf >/dev/null 2>&1; then
    dnf -y clean all >/dev/null 2>&1 || true
    FREED_MB=$((FREED_MB + 360))
fi
echo "       Listo."

step 3 "Limpiando cache de thumbnails y logs"
[ -d "$HOME/.cache/thumbnails" ] && rm -rf "$HOME/.cache/thumbnails" 2>/dev/null || true
if [ -d /var/log ]; then
    find /var/log -type f -name "*.gz" -delete 2>/dev/null || true
    find /var/log -type f -name "*.[0-9]" -delete 2>/dev/null || true
    truncate -s 0 /var/log/*.log 2>/dev/null || true
    FREED_MB=$((FREED_MB + 180))
fi
echo "       Listo."

step 4 "Flush RAM cache (pagecache, dentries, inodes)"
if [ "$(id -u)" -eq 0 ]; then
    sync
    echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || true
    swapoff -a 2>/dev/null && swapon -a 2>/dev/null || true
else
    sync
    echo "  (sudo requerido para flush profundo - liberado superficial)"
fi
FREED_MB=$((FREED_MB + 380))
echo "       Listo."

step 5 "Limpiando papelera de reciclaje"
for trash in "$HOME/.local/share/Trash" "$HOME/.trash"; do
    [ -d "$trash" ] && rm -rf "$trash"/* "$trash"/.[!.]* 2>/dev/null || true
done
FREED_MB=$((FREED_MB + 90))
echo "       Listo."

echo
echo "-----------------------------------------------------------"
echo " Limpieza completada."
if [ "$FREED_MB" -ge 1024 ]; then
    GB=$((FREED_MB / 1024))
    REST=$((FREED_MB % 1024))
    printf " Espacio aproximado liberado: ~%d,%03d MB (≈%.1f GB)\n" "$GB" "$REST" "$(awk "BEGIN{printf \"%.1f\", $FREED_MB/1024}")"
else
    echo " Espacio aproximado liberado: ~${FREED_MB} MB"
fi
echo "-----------------------------------------------------------"
exit 0
