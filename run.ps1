# PowerShell Runner for Student Attendance Management System Java Server
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "  Compiling Student Attendance Management System (Java)..." -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan

if (-not (Test-Path "backend\bin")) {
    New-Item -ItemType Directory -Path "backend\bin" | Out-Null
}

javac -d "backend\bin" -sourcepath "backend\src" "backend\src\Main.java"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Java compilation failed." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "[SUCCESS] Compilation successful! Starting Java server on port 8080..." -ForegroundColor Green
Write-Host "Open your browser at: http://localhost:8080/" -ForegroundColor Yellow
Start-Process "http://localhost:8080/"
java -cp "backend\bin" Main 8080
