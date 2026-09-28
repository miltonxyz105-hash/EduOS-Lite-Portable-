@echo off
REM EduOS Lite :: Bloatware Shield - Daemon de inicio
REM Módulo 2: Automatic Bloatware Shield
chcp 65001 >nul 2>&1
setlocal EnableExtensions

: : Registro como tarea de inicio (requiere admin) -- si se llama con /install
if /I "%~1"=="/install" goto INSTALL
if /I "%~1"=="/scan"    goto SCAN

echo ============================================================
echo  EduOS Lite :: Bloatware Shield - Escaneo Rapido
echo ============================================================
echo.
goto SCAN

:INSTALL
echo Instalando Bloatware Shield como tarea de inicio...
schtasks /create /tn "EduOS_BloatwareShield" /tr "\"%~f0\" /scan" /sc onlogon /rl highest /f >nul 2>&1
schtasks /create /tn "EduOS_BloatwareShield_Hourly" /tr "\"%~f0\" /scan" /sc hourly /st 00:05 /rl highest /f >nul 2>&1
echo Instalado. Se ejecutara en cada inicio y cada 1 hora.
exit /b 0

:SCAN
set /A BLOCKED=0
set /A WARNED=0

:: Lista negra: procesos pesados / bloatware / entretenimiento
set "HEAVY_LIST= steam.exe epicgameslauncher.exe origin.exe battlenet.exe riotclientservices.exe robloxplayerbeta.exe minecraft.launcher.exe tiktok.exe capcut.exe obs64.exe blender.exe"
set "BLOAT_LIST= mcafee.exe norton.exe avastui.exe avgnt.exe ccapp.exe teams.exe skype.exe cortana.exe candycrush* facebookgaming* disney+.exe netflix.exe spotify.exe amazonmusic.exe"

echo [Procesos pesados bloqueables]:
for %%p in (%HEAVY_LIST%) do (
    tasklist /fi "IMAGENAME eq %%~p" 2>nul | find /I "%%~p" >nul 2>&1 && (
        echo      ! DETECTADO: %%~p [BLOQUEADO - Prioridad Idle]
        wmic process where "name='%%~p'" CALL SetPriority "Idle" >nul 2>&1
        set /A BLOCKED+=1
    )
)

echo.
echo [Bloatware / No autorizado]:
for %%p in (%BLOAT_LIST%) do (
    tasklist /fi "IMAGENAME eq %%~p" 2>nul | find /I "%%~p" >nul 2>&1 && (
        echo      ! BLOAT: %%~p [Suspendido temporalmente]
        taskkill /FI "IMAGENAME eq %%~p" /T /F >nul 2>&1
        set /A WARNED+=1
    )
)

echo.
echo [Aplicaciones de inicio sospechosas]:
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" 2>nul | findstr /i "spotify steam epic bittorrent utorrent" >nul 2>&1 && (
    echo      Aviso: Detectadas apps de inicio no educativas.
    set /A WARNED+=1
)

echo.
echo -----------------------------------------------------------
if %BLOCKED%==0 (
    if %WARNED%==0 (
        echo  ESCANEO OK: Sin procesos pesados ni bloatware.
    ) else (
        echo  Bloatware removido: %WARNED% proceso(s).
    )
) else (
    echo  Procesos degradados a Idle: %BLOCKED%.  Removidos: %WARNED%.
)
echo -----------------------------------------------------------
endlocal
exit /b 0
