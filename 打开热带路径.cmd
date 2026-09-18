@echo off
cd /d "%~dp0"
start "WindTrack Data Bridge" /min pythonw "%~dp0tropical-system-server.py"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8877/tropical-system-tracker.html"
