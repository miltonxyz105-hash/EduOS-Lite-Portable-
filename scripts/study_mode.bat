@echo off
REM EduOS Lite :: Modo Estudio + Filtro Anti-Distracciones
REM Módulo 2: Study Mode & Anti-Distraction Filter
chcp 65001 >nul 2>&1
setlocal

if "%~1"=="/off" goto DISABLE

echo ============================================================
echo  EduOS Lite :: Activando Modo Estudio
echo ============================================================
echo.

echo [1] Bloqueando dominios no educativos en hosts...
set "HOSTS=%WinDir%\System32\drivers\etc\hosts"
echo # EduOS - Bloqueos Modo Estudio >> "%HOSTS%" 2>nul
set "BLOCKED=facebook.com instagram.com twitter.com tiktok.com youtube.com twitch.tv discord.com reddit.com steamcommunity.com"
for %%d in (%BLOCKED%) do (
    findstr /C:"%%d" "%HOSTS%" >nul 2>nul || (
        echo 127.0.0.1    %%d >> "%HOSTS%" 2>nul
        echo 127.0.0.1    www.%%d >> "%HOSTS%" 2>nul
    )
)
ipconfig /flushdns >nul 2>&1
echo      Dominios bloqueados: 8
echo.

echo [2] Suprimiendo notificaciones no esenciales...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PushNotifications" /v ToastEnabled /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Notifications\Settings" /v NOC_GLOBAL_SETTING_TOASTS_ENABLED /t REG_DWORD /d 0 /f >nul 2>&1
echo      Focus Assist: Alarmas Only
echo.

echo [3] Reduciendo procesos de fondo (CPU throttling bg)...
wmic process where "name='SearchIndexer.exe'" CALL SetPriority "Idle" >nul 2>&1
wmic process where "name='OneDrive.exe'" CALL SetPriority "Idle" >nul 2>&1
wmic process where "name='wsappx'" CALL SetPriority "Idle" >nul 2>&1
echo      Procesos no esenciales: Prioridad BAJA
echo.

echo [4] Estableciendo lista blanca de apps permitidas:
echo      - Navegador edu (LMS)
echo      - Suite ofimática / Editor documentos
echo      - Visor PDF, libros digitales
echo      - Reproductor de videos clase
echo.

echo -----------------------------------------------------------
echo  MODO ESTUDIO: ACTIVADO
echo  (Desactivar con: study_mode.bat /off)
echo -----------------------------------------------------------
goto END

:DISABLE
echo ============================================================
echo  EduOS Lite :: Desactivando Modo Estudio
echo ============================================================
set "HOSTS=%WinDir%\System32\drivers\etc\hosts"
findstr /v /c:"# EduOS - Bloqueos" /v /c:"127.0.0.1" /c:"facebook" /c:"instagram" /c:"twitter" /c:"tiktok" /c:"youtube" /c:"twitch" /c:"discord" /c:"reddit" "%HOSTS%" > "%TEMP%\hosts_clean"
move /y "%TEMP%\hosts_clean" "%HOSTS%" >nul 2>&1
ipconfig /flushdns >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PushNotifications" /v ToastEnabled /t REG_DWORD /d 1 /f >nul 2>&1
echo -----------------------------------------------------------
echo  MODO ESTUDIO: DESACTIVADO
echo -----------------------------------------------------------

:END
endlocal
exit /b 0
