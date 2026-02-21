# ComfortCare Agent System - Complete Setup Script
# Run this in PowerShell to set up your system

Write-Host "
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🏥 ComfortCare Agent Management System Setup               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Check Node.js installation
Write-Host "`n1️⃣  Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js $nodeVersion installed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found!" -ForegroundColor Red
    Write-Host "   Please install from: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n2️⃣  Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "   ✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check for .env file
Write-Host "`n3️⃣  Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "   ✅ .env file created" -ForegroundColor Green
    Write-Host "   ⚠️  IMPORTANT: Edit .env and add your Stripe keys!" -ForegroundColor Yellow
}

# Display setup summary
Write-Host "
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ✅ Setup Complete!                                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

📋 NEXT STEPS:

1️⃣  Configure Stripe:
   - Go to: https://dashboard.stripe.com/apikeys
   - Copy your keys
   - Edit .env file and paste them

2️⃣  Start the server:
   npm start

3️⃣  Access the system:

   👥 CUSTOMER SITE (No login required):
   http://localhost:3001/index.html

   🚚 AGENT PORTAL:
   http://localhost:3001/agent-login.html
   Credentials: AG-001 / 1234

   👑 ADMIN PORTAL (Owner):
   http://localhost:3001/admin-login.html
   Credentials: admin / admin123

🔐 DEFAULT CREDENTIALS:

   Agent 1:
   - Agent ID: AG-001
   - PIN: 1234

   Agent 2:
   - Agent ID: AG-002
   - PIN: 5678

   Admin:
   - Username: admin
   - Password: admin123

⚠️  SECURITY WARNING:
   Change these credentials before going live!

📚 DOCUMENTATION:
   - System Guide: AGENT-SYSTEM-GUIDE.md
   - README: README.md
   - Quick Start: QUICK_START.md

🆘 TROUBLESHOOTING:

   Port already in use:
   Get-NetTCPConnection -LocalPort 3001 | Select-Object OwningProcess
   Stop-Process -Id <PID>

   Dependencies error:
   Remove-Item node_modules -Recurse -Force
   npm install

   Stripe errors:
   Verify your API keys in .env file

💡 READY TO START!
   Run: npm start

" -ForegroundColor White

# Offer to start server
$start = Read-Host "`nWould you like to start the server now? (y/n)"
if ($start -eq "y" -or $start -eq "Y") {
    Write-Host "`n🚀 Starting ComfortCare API Server...`n" -ForegroundColor Green
    npm start
} else {
    Write-Host "`n✅ Setup complete! Run 'npm start' when ready.`n" -ForegroundColor Green
}
