#!/usr/bin/env bash
# EduOS Lite :: Bloatware Shield - Daemon (Linux)
# Módulo 2: Automatic Bloatware Shield
set -e
LOG_FILE="/tmp/eduos_bloatware.log"
BLOCKED_NICE=19

HEAVY_PROCS=(
  "steam" "steamwebhelper" "epic" "legendary" "heroic" "lutris"
  "roblox" "minecraft" "prismlauncher" "tlauncher"
  "capcut" "shotcut" "kdenlive" "obs" "obs-studio"
  "blender" "gimp" "inkscape"
  "discord" "slack" "teams" "zoom"
  "spotify"
)

BLOAT_APPS=(
  "candy" "facebook" "netflix" "disney" "amazon-music" "plex"
  "utorrent" "qbittorrent" "transmission"
  "dropbox" "megasync"
)

INSTALL_AS_SERVICE=0
SCAN_NOW=1
case "${1:-}" in
  --install) INSTALL_AS_SERVICE=1 ;;
  --scan)    SCAN_NOW=1 ;;
esac

install_service() {
    echo "[+] Instalando Bloatware Shield (systemd timer cada 60min + en login)"
    SVC_DIR="$HOME/.config/systemd/user"
    SVC_UNIT="$SVC_DIR/eduos-bloatshield.service"
    TIMER_UNIT="$SVC_DIR/eduos-bloatshield.timer"
    SCRIPT_FILE="$SVC_DIR/eduos-bloatshield.sh"
    mkdir -p "$SVC_DIR"
    cat > "$SVC_UNIT" <<'EOF'
[Unit]
Description=EduOS Bloatware Shield
[Service]
Type=oneshot
ExecStart=%h/.config/systemd/user/eduos-bloatshield.sh --scan
[Install]
WantedBy=default.target
EOF
    cp "$0" "$SCRIPT_FILE" 2>/dev/null || true
    chmod +x "$SCRIPT_FILE" 2>/dev/null || true
    cat > "$TIMER_UNIT" <<'EOF'
[Unit]
Description=Run Bloatware Shield hourly
[Timer]
OnBootSec=5min
OnUnitActiveSec=60min
Persistent=true
[Install]
WantedBy=timers.target
EOF
    if command -v systemctl >/dev/null 2>&1; then
        systemctl --user daemon-reload 2>/dev/null || true
        systemctl --user enable --now eduos-bloatshield.timer 2>/dev/null || true
    fi
    echo "[OK] Instalado. Proximo escaneo cada 60min y post-arranque."
    exit 0
}

run_scan() {
    echo "============================================================"
    echo " EduOS Lite :: Bloatware Shield - Escaneo"
    echo "============================================================"
    DATE="$(date '+%Y-%m-%d %H:%M:%S')"
    echo "Hora: $DATE"
    {
        echo ""
        echo "=== Escaneo $DATE"
    } >> "$LOG_FILE" 2>/dev/null || true
    echo
    BLOCKED=0
    WARNED=0

    echo "[Procesos pesados / Gaming / Entretenimiento]:"
    for p in "${HEAVY_PROCS[@]}"; do
        PIDS="$(pgrep -fi "$p" 2>/dev/null || true)"
        if [ -n "$PIDS" ]; then
            for pid in $PIDS; do
                if renice "$BLOCKED_NICE" -p "$pid" >/dev/null 2>&1; then
                    BLOCKED=$((BLOCKED+1))
                fi
            done
            echo "  ! degradado a NICE=$BLOCKED_NICE: $p (PIDs: $PIDS)"
            echo "  degradado: $p" >> "$LOG_FILE" 2>/dev/null || true
        fi
    done
    echo "  Total degradados: $BLOCKED"
    echo

    echo "[Bloatware / No autorizado - detencion temporal]:"
    for p in "${BLOAT_APPS[@]}"; do
        PIDS="$(pgrep -fi "$p" 2>/dev/null || true)"
        if [ -n "$PIDS" ]; then
            kill -STOP $PIDS 2>/dev/null || true
            echo "  ! suspendido (SIGSTOP): $p (PIDs: $PIDS)"
            echo "  suspendido: $p" >> "$LOG_FILE" 2>/dev/null || true
            WARNED=$((WARNED+1))
        fi
    done
    echo "  Total suspendidos: $WARNED"
    echo

    echo "[Autostart sospechosos (XDG)]:"
    BAD=0
    if [ -d "$HOME/.config/autostart" ]; then
        for f in "$HOME/.config/autostart"/*.desktop; do
            [ -f "$f" ] || continue
            for pattern in "${BLOAT_APPS[@]}"; do
                if grep -qi "$pattern" "$f" 2>/dev/null; then
                    echo "  ! desactivando: $(basename "$f")"
                    mv "$f" "${f}.disabled" 2>/dev/null || true
                    BAD=$((BAD+1))
                    break
                fi
            done
        done
    fi
    echo "  Autostart desactivados: $BAD"
    WARNED=$((WARNED+BAD))
    echo
    echo "-----------------------------------------------------------"
    TOTAL=$((BLOCKED+WARNED))
    if [ "$TOTAL" -eq 0 ]; then
        echo " ESCANEO OK: Sin procesos pesados ni bloatware."
    else
        echo " Degradados a Idle: $BLOCKED   |   Suspendidos/Removidos: $WARNED"
    fi
    echo "-----------------------------------------------------------"
    exit 0
}

[ "$INSTALL_AS_SERVICE" -eq 1 ] && install_service
[ "$SCAN_NOW" -eq 1 ] && run_scan
