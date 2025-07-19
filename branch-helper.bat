@echo off
echo ========================================
echo    EHIX - THE TRIUNE CONVERGENCE
echo         Branch Management Tool
echo ========================================
echo.

echo Current branch:
git branch --show-current
echo.

echo All available branches:
git branch -a | grep -E "(feature/|content/|develop|main|hotfix/|release/)" | sort
echo.

echo ========================================
echo Quick Branch Switch Commands:
echo.
echo   git checkout develop               - Main development
echo   git checkout feature/story-expansion   - Story content
echo   git checkout content/locations     - New locations  
echo   git checkout feature/ui-improvements   - UI work
echo   git checkout content/items-equipment   - New items
echo   git checkout feature/combat-system     - Combat mechanics
echo.
echo Remember: NEVER work directly on main!
echo ========================================
echo.

set /p branch="Enter branch name to switch to (or press Enter to exit): "
if not "%branch%"=="" (
    echo Switching to %branch%...
    git checkout %branch%
    if %errorlevel% equ 0 (
        echo Successfully switched to %branch%
    ) else (
        echo Failed to switch to %branch%. Check if branch exists.
    )
)

pause
