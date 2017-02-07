@echo off
cd %~dp0
title Auto restart Naomi Tanizaki
set _checkup=node.exe
tasklist /FI "IMAGENAME eq %_checkup%" 2>NUL | find /I /N "%_checkup%">NUL
if "%ERRORLEVEL%" NEQ "0" start "Naomi Tanizaki" npm run start
TIMEOUT /T 5 /NOBREAK >nul
:st
tasklist /FI "IMAGENAME eq %_checkup%" 2>NUL | find /I /N "%_checkup%">NUL
if "%ERRORLEVEL%" EQU "0" (echo [%DATE% - %TIME%] Up and running!) else (echo [%DATE% - %TIME%] ------------------------- Restarting! & start "Naomi Tanizaki" npm run start)
TIMEOUT /T 60 /NOBREAK >nul
goto st
