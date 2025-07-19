# EHIX - The Triune Convergence Branch Management Tool

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    EHIX - THE TRIUNE CONVERGENCE" -ForegroundColor Yellow
Write-Host "         Branch Management Tool" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Current branch:" -ForegroundColor Green
$currentBranch = git branch --show-current
Write-Host "  $currentBranch" -ForegroundColor White
Write-Host ""

Write-Host "Available development branches:" -ForegroundColor Green
$branches = git branch -a | Where-Object { $_ -match "(feature/|content/|develop|hotfix/|release/)" -and $_ -notmatch "remotes/origin/HEAD" } | Sort-Object
foreach ($branch in $branches) {
    $cleanBranch = $branch.Trim().Replace("remotes/origin/", "").Replace("* ", "")
    if ($branch -match "\*") {
        Write-Host "  $cleanBranch" -ForegroundColor Yellow -NoNewline
        Write-Host " (current)" -ForegroundColor Green
    } else {
        Write-Host "  $cleanBranch" -ForegroundColor White
    }
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Quick Commands:" -ForegroundColor Green
Write-Host "  develop                 - Main development" -ForegroundColor White
Write-Host "  feature/story-expansion - Story content" -ForegroundColor White
Write-Host "  content/locations       - New locations" -ForegroundColor White
Write-Host "  feature/ui-improvements - UI work" -ForegroundColor White
Write-Host "  content/items-equipment - New items" -ForegroundColor White
Write-Host "  feature/combat-system   - Combat mechanics" -ForegroundColor White
Write-Host ""
Write-Host "Remember: NEVER work directly on main!" -ForegroundColor Red -BackgroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$branch = Read-Host "Enter branch name to switch to (or press Enter to exit)"
if ($branch -ne "") {
    Write-Host "Switching to $branch..." -ForegroundColor Yellow
    git checkout $branch
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully switched to $branch" -ForegroundColor Green
        Write-Host "Current branch: $(git branch --show-current)" -ForegroundColor Green
    } else {
        Write-Host "Failed to switch to $branch. Check if branch exists." -ForegroundColor Red
    }
}

Write-Host ""
Read-Host "Press Enter to exit"
