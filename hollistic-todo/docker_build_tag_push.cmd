@echo off

REM Script to build, tag, and push Docker image for Hollistic To-Do
REM Ensure Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker and try again.
    exit /b 1
)

set /p FLAG_USE_CONFIG_VERSION=Read version from config.yaml? [Y/n]:
if "%FLAG_USE_CONFIG_VERSION%"=="" set FLAG_USE_CONFIG_VERSION=Y

if /I "%FLAG_USE_CONFIG_VERSION%"=="Y" (
    for /f "tokens=2 delims=: " %%v in ('findstr /b /c:"version:" config.yaml') do set VERSION=%%v
)
set VERSION=%VERSION:"=%


set /p FLAG_BUILD=Build image with version:%VERSION% ? [Y/n]:
if "%FLAG_BUILD%"=="" set FLAG_BUILD=Y

if /I "%FLAG_BUILD%"=="Y" (
    docker build -t msoehnchen/hollistic-todo:%VERSION% .
)

set /p FLAG_TAG_PUSH=Tag and push image? [Y/n]:
if "%FLAG_TAG_PUSH%"=="" set FLAG_TAG_PUSH=Y
if /I "%FLAG_TAG_PUSH%"=="Y" (
    docker tag msoehnchen/hollistic-todo:%VERSION% msoehnchen/hollistic-todo:%VERSION%
    docker push msoehnchen/hollistic-todo:%VERSION%
)
