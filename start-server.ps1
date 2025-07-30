Write-Host "🚀 Starting MediChive Backend Server on Port 3000..." -ForegroundColor Green
Write-Host ""
Write-Host "Environment Configuration:" -ForegroundColor Yellow
Write-Host "PORT=3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Magenta
Write-Host ""

# Start the development server
npm run start:dev
