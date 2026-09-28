@echo off
REM EduOS Lite :: Modo Batería Extrema / Stealth
REM Módulo 2: Stealth / Extreme Battery Mode
chcp 65001 >nul 2>&1
setlocal

if "%~1"=="/off" goto DISABLE

echo ============================================================
echo  EduOS Lite :: Modo Bateria Extrema (Stealth)
echo ============================================================
echo.

echo [1] Aplicando esquema de energia Ahorro Maximo...
powercfg /setactive a1841308-3541-4fab-bc81-f71556f20b4a >nul 2>&1
powercfg /change standby-timeout-ac 5 >nul 2>&1
powercfg /change standby-timeout-dc 2 >nul 2>&1
powercfg /change monitor-timeout-ac 2 >nul 2>&1
powercfg /change monitor-timeout-dc 1 >nul 2>&1
powercfg /change hibernate-timeout-ac 15 >nul 2>&1
powercfg /change hibernate-timeout-dc 5 >nul 2>&1
powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 70 >nul 2>&1
powercfg /setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 50 >nul 2>&1
powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PERFEPP 2 >nul 2>&1
powercfg /S SCHEME_CURRENT >nul 2>&1
echo      CPU throttle max: 50%% (DC) / 70%% (AC)
echo      Apagado monitor: 1min (DC)
echo.

echo [2] Suspendiendo servicios no esenciales...
sc config WSearch start= demand >nul 2>&1
sc stop WSearch >nul 2>&1
sc config SysMain start= demand >nul 2>&1
sc stop SysMain >nul 2>&1
sc config DiagTrack start= disabled >nul 2>&1
sc stop DiagTrack >nul 2>&1
sc config dmwappushservice start= disabled >nul 2>&1
sc stop dmwappushservice >nul 2>&1
sc config OneSyncSvc start= demand >nul 2>&1
echo      Servicios suspendidos: Search, Superfetch, Telemetria
echo.

echo [3] Reduciendo brillo de pantalla...
echo      Brillo objetivo: 35%% (aplique manualmente si no se aplica)
echo.

echo [4] Desactivando efectos visuales pesados...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ThemeManager" /v ThemeActive /t REG_DWORD /d 0 /f >nul 2>&1
echo      Efectos: Minimos (Rendimiento)
echo.

echo -----------------------------------------------------------
echo  MODO BATERIA EXTREMA: ACTIVADO
echo  (Desactivar con: battery_mode.bat /off)
echo -----------------------------------------------------------
goto END

:DISABLE
powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e >nul 2>&1
sc config WSearch start= delayed-auto >nul 2>&1
sc config SysMain start= auto >nul 2>&1
sc config DiagTrack start= demand >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 1 /f >nul 2>&1
echo -----------------------------------------------------------
echo  MODO BATERIA EXTREMA: DESACTIVADO
echo -----------------------------------------------------------

:END
endlocal
exit /b 0
