#!/usr/bin/env bash
# EduOS Lite :: Modo Estudio + Filtro Anti-Distracciones (Linux)
set -e
HOSTS_FILE="/etc/hosts"
MARKER="# EduOS - Bloqueos Modo Estudio"
STATE_FILE="$HOME/.eduos_study_mode"

BLOCKED_DOMAINS=(
  "facebook.com" "instagram.com" "twitter.com" "tiktok.com"
  "youtube.com" "twitch.tv" "discord.com" "reddit.com"
  "steamcommunity.com" "store.steampowered.com" "epicgames.com"
)

WHITELIST_APPS=(
  "Navegador edu (LMS)"
  "Suite ofimatica / Editor documentos"
  "Visor PDF, libros digitales"
  "Reproductor de videos clase"
)

banner() { echo "============================================================"; }

case "${1:-}" in
  --off|disable)
    goto_disable
    ;;
  *)
    goto_enable
    ;;
esac

goto_enable() {
    banner
    echo " EduOS Lite :: Activando Modo Estudio"
    banner
    echo
    echo "[1] Bloqueando dominios no educativos en /etc/hosts..."
    if [ "$(id -u)" -eq 0 ]; then
        {
            echo ""
            echo "$MARKER"
        } >> "$HOSTS_FILE" 2>/dev/null || true
        for d in "${BLOCKED_DOMAINS[@]}"; do
            if ! grep -q "$d" "$HOSTS_FILE" >/dev/null 2>&1; then
                echo "127.0.0.1  $d" >> "$HOSTS_FILE"
                echo "127.0.0.1  www.$d" >> "$HOSTS_FILE"
            fi
        done
    else
        echo "   (ejecutar como root para bloqueo de hosts)"
    fi
    command -v nscd >/dev/null 2>&1 && nscd -I hosts 2>/dev/null || true
    echo "    Dominios bloqueados: ${#BLOCKED_DOMAINS[@]}"
    echo

    echo "[2] Suprimiendo notificaciones (Focus Assist)... "
    if command -v gsettings >/dev/null 2>&1; then
        gsettings set org.gnome.desktop.notifications show-banners false 2>/dev/null || true
        gsettings set org.gnome.desktop.notifications show-in-lock-screen false 2>/dev/null || true
    fi
    if command -v notify-send >/dev/null 2>&1; then
        notify-send "Modo Estudio" "Notificaciones suprimidas (solo alertas criticas)" 2>/dev/null || true
    fi
    echo "    Solo alertas criticas permitidas"
    echo

    echo "[3] Degradando procesos de fondo..."
    BG_LIST=(tracker-extract tracker-miner-fs baloo_file updatedb plasmashell krunner)
    for p in "${BG_LIST[@]}"; do
        pids="$(pgrep -f "$p" 2>/dev/null || true)"
        if [ -n "$pids" ]; then
            renice +15 $pids >/dev/null 2>&1 || true
        fi
    done
    echo "    Indexado y busqueda: baja prioridad"
    echo

    echo "[4] Aplicaciones prioritarias (foreground):"
    for a in "${WHITELIST_APPS[@]}"; do
        echo "    - $a"
    done

    echo "1" > "$STATE_FILE" 2>/dev/null || true
    echo
    echo "-----------------------------------------------------------"
    echo " MODO ESTUDIO: ACTIVADO"
    echo " (Desactivar con: sudo bash $0 --off)"
    echo "-----------------------------------------------------------"
    exit 0
}

goto_disable() {
    banner
    echo " EduOS Lite :: Desactivando Modo Estudio"
    banner
    if [ "$(id -u)" -eq 0 ]; then
        tmpf="$(mktemp)"
        sed -i.bak "/$MARKER/,/^$/d" "$HOSTS_FILE" 2>/dev/null || true
        rm -f "${HOSTS_FILE}.bak"
    fi
    command -v nscd >/dev/null 2>&1 && nscd -I hosts 2>/dev/null || true
    if command -v gsettings >/dev/null 2>&1; then
        gsettings set org.gnome.desktop.notifications show-banners true 2>/dev/null || true
    fi
    rm -f "$STATE_FILE" 2>/dev/null || true
    echo
    echo "-----------------------------------------------------------"
    echo " MODO ESTUDIO: DESACTIVADO"
    echo "-----------------------------------------------------------"
    exit 0
}
