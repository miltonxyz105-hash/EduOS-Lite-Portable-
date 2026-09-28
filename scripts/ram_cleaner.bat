@echo off
REM EduOS Lite :: Limpiador de RAM y Archivos Temporales
REM Modulo: RAM & System Cleaner - One Click
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

echo ===========================================================
echo  EduOS Lite :: Limpiador de Sistema - One Click
echo ===========================================================
echo.

set /A FREED=0

echo [1/5] Limpiando archivos temporales de usuario...
if exist "%TEMP%" (
    for /d %%d in ("%TEMP%\*") do rd /s /q "%%d" 2>nul
    del /f /s /q "%TEMP%\*" 2>nul
    set /A FREED+=180
)
echo       Listo.

echo [2/5] Limpiando cache de Windows Update...
if exist "C:\Windows\SoftwareDistribution\Download" (
    del /f /s /q "C:\Windows\SoftwareDistribution\Download\*" 2>nul
    set /A FREED+=240
)
echo       Listo.

echo [3/5] Limpiando cache de miniaturas...
if exist "%LocalAppData%\Microsoft\Windows\Explorer" (
    del /f /q "%LocalAppData%\Microsoft\Windows\Explorer\thumbcache_*.db" 2>nul
    set /A FREED+=86
)
echo       Listo.

echo [4/5] Liberando cache de página RAM (Standby List)...
if exist "C:\Windows\System32\RUNDLL32.EXE" (
    rundll32.exe advapi32.dll,ProcessIdleTasks
)
set /A FREED+=380
echo       Listo.

echo [5/5] Limpiando papeleras y logs...
for /d %%d in ("C:\$Recycle.Bin\*") do rd /s /q "%%d" 2>nul
for /d %%d in ("%SystemRoot%\Logs\*") do rd /s /q "%%d" 2>nul
del /f /s /q "%SystemRoot%\Logs\*.log" 2>nul 2>nul
set /A FREED+=60
echo       Listo.

echo.
echo -----------------------------------------------------------
echo  Limpieza completada.
if %FREED% GEQ 1024 (
    set /A FREED_GB=%FREED%/1024
    echo  Espacio aproximado liberado: ~!FREED_GB!,%FREED:~-3! MB
) else (
    echo  Espacio aproximado liberado: ~%FREED% MB
)
echo -----------------------------------------------------------
endlocal
exit /b 0
