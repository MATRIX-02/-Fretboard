@echo off
REM ============================================================
REM  Fretwork - launch on http://localhost:8123
REM  Optional. Double-clicking index.html works in Chrome/Firefox,
REM  but serving over http guarantees saving works in every browser
REM  (and is required for Safari and for future service-worker features).
REM ============================================================
cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel%==0 (
  echo Starting Fretwork at http://localhost:8123 ...
  start "" http://localhost:8123
  python -m http.server 8123
  goto :eof
)

where node >nul 2>nul
if %errorlevel%==0 (
  echo Starting Fretwork at http://localhost:8123 ...
  start "" http://localhost:8123
  npx --yes http-server -p 8123 -c-1
  goto :eof
)

echo Neither Python nor Node was found on this machine.
echo No problem - just double-click index.html instead. It works offline.
pause
