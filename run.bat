@echo off
title Student Attendance Management System - Java Server
echo ===============================================================
echo   Compiling Student Attendance Management System (Java 26)...
echo ===============================================================
if not exist "backend\bin" mkdir "backend\bin"

javac -d "backend\bin" -sourcepath "backend\src" "backend\src\Main.java"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Compilation failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [SUCCESS] Compilation successful! Starting server on port 8080...
echo Opening browser at http://localhost:8080/ ...
echo.
start "" http://localhost:8080/
java -cp "backend\bin" Main 8080
pause
