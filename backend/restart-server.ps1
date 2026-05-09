# WASCO Backend Server Restart Script
# This script kills all Node.js processes and starts the server fresh

Write-Host "Restarting WASCO Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Kill all Node.js processes
Write-Host "Stopping all Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Verify port 5000 is free
Write-Host "Checking if port 5000 is free..." -ForegroundColor Yellow
$portCheck = netstat -ano | findstr :5000
if ($portCheck) {
    Write-Host "Port 5000 still in use. Killing process..." -ForegroundColor Red
    $pid = ($portCheck -split '\s+')[-1]
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host "Port 5000 is now free" -ForegroundColor Green
Write-Host ""

# Start the server
Write-Host "Starting WASCO Backend Server..." -ForegroundColor Cyan
Write-Host ""
npm start

# Made with Bob
