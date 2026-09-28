#!/usr/bin/env bash
# EduOS Lite :: Modo Batería Extrema / Stealth (Linux)
set -e
STATE_FILE="$HOME/.eduos_battery_mode"

[ "$1" = "--off" ] && goto_disable || goto_enable

goto_enable() {
    echo "============================================================"
    echo " EduOS Lite :: Modo Bateria Extrema (Stealth)"
    echo "============================================================"
    echo

    echo "[1] Gobierno CPU: powersave + throttle agresivo..."
    for gov in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do
        [ -w "$gov" ] && echo powersave > "$gov" 2>/dev/null || true
    done
    if [ "$(id -u)" -eq 0 ] && [ -f /proc/sys/vm/swappiness ]; then
        echo 10 > /proc/sys/vm/swappiness 2>/dev/null || true
        echo 1 > /proc/sys/vm/dirty_writeback_centisecs 2>/dev/null || true
    fi
    echo "    Gobernador: powersave (max eficiencia energetica)"
    echo

    echo "[2] Suspendiendo servicios no esenciales..."
    SERVICES=(NetworkManager-wait-online bluetooth cups ModemManager rsyslog fstrim.timer)
    for s in "${SERVICES[@]}"; do
        systemctl stop "$s" 2>/dev/null || true
    done
    command -v systemctl >/dev/null 2>&1 && \
        systemctl mask NetworkManager-wait-online 2>/dev/null || true
    echo "    Servicios detenidos: BT, CUPS, ModemManager, indexado"
    echo

    echo "[3] Pantalla: brillo y tiempo de apagado..."
    # Backlight PWM (si existe)
    for bl in /sys/class/backlight/*/brightness; do
        [ -f "$bl" ] && max_file="${bl%brightness}max_brightness"
        if [ -f "$max_file" ] && [ -w "$bl" ]; then
            max="$(cat "$max_file")"
            target=$(( max * 35 / 100 ))
            [ "$target" -gt 0 ] && echo "$target" > "$bl" 2>/dev/null || true
        fi
    done
    # Xorg DPMS / blanking
    command -v xset >/dev/null 2>&1 && xset s 60 dpms 120 180 240 2>/dev/null || true
    echo "    Brillo objetivo: 35% | Standby: 1min"
    echo

    echo "[4] E/S Disco: Agressive SATA link power mgmt..."
    if [ "$(id -u)" -eq 0 ]; then
        for sata in /sys/class/scsi_host/host*/link_power_management_policy; do
            [ -w "$sata" ] && echo min_power > "$sata" 2>/dev/null || true
        done
        # Writeback agresivo
        echo "    SATA: min_power (ahorro maximo)"
    fi
    echo

    echo "[5] PCI / USB: autosuspend dispositivos..."
    for d in /sys/bus/usb/devices/*/power/control; do
        [ -w "$d" ] && echo auto > "$d" 2>/dev/null || true
    done
    echo "    USB autosuspend: activado"
    echo

    echo "1" > "$STATE_FILE" 2>/dev/null || true
    echo "-----------------------------------------------------------"
    echo " MODO BATERIA EXTREMA: ACTIVADO"
    echo " (Desactivar con: sudo bash $0 --off)"
    echo "-----------------------------------------------------------"
    exit 0
}

goto_disable() {
    echo "============================================================"
    echo " EduOS Lite :: Desactivando Modo Bateria"
    echo "============================================================"
    for gov in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do
        [ -w "$gov" ] && echo schedutil > "$gov" 2>/dev/null || true
    done
    if [ "$(id -u)" -eq 0 ] && [ -f /proc/sys/vm/swappiness ]; then
        echo 60 > /proc/sys/vm/swappiness 2>/dev/null || true
    fi
    SERVICES=(bluetooth cups)
    for s in "${SERVICES[@]}"; do
        systemctl start "$s" 2>/dev/null || true
    done
    for sata in /sys/class/scsi_host/host*/link_power_management_policy; do
        [ -w "$sata" ] && echo medium_power > "$sata" 2>/dev/null || true
    done
    command -v xset >/dev/null 2>&1 && xset s default dpms force on 2>/dev/null || true
    rm -f "$STATE_FILE" 2>/dev/null || true
    echo
    echo "-----------------------------------------------------------"
    echo " MODO BATERIA EXTREMA: DESACTIVADO"
    echo "-----------------------------------------------------------"
    exit 0
}
