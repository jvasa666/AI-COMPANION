@echo off
setlocal

REM === CONFIG ===
set "REPO_URL=https://github.com/jvasa666/AI-COMPANION.git"
set "USER_NAME=jvasa666"
set "USER_EMAIL=jvasa666@users.noreply.github.com"
set "BRANCH=main"
set "ZIP_NAME=AI COMPANION (3)"

REM === GIT SETUP ===
git init
git config --global user.name "%USER_NAME%"
git config --global user.email "%USER_EMAIL%"

REM === REMOTE ORIGIN ===
git remote remove origin 2>nul
git remote add origin %REPO_URL%

REM === BRANCH ===
git checkout -B %BRANCH%

REM === COPY FILES (IF ZIP) ===
REM If your content is zipped, unzip it:
REM powershell -Command "Expand-Archive -Force '%ZIP_NAME%.zip' ."

REM === COMMIT + PUSH ===
git add .
git commit -m "Upload: %ZIP_NAME%"
git push -u origin %BRANCH% --force

echo.
echo ✅ Upload complete to %REPO_URL%
pause
