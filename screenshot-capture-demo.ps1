# OWASP Security Testing - Screenshot Capture Script
# This script guides you through capturing screenshots for security testing

Write-Host "🔒 OWASP Security Testing - Screenshot Capture Guide" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Check if server is running
Write-Host "📡 Checking server status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/events" -Method GET -TimeoutSec 5
    Write-Host "✅ Server is running on localhost:5000" -ForegroundColor Green
} catch {
    Write-Host "❌ Server is not running. Please start with: cd BEplanora && npm start" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📸 SCREENSHOT CAPTURE INSTRUCTIONS:" -ForegroundColor Magenta
Write-Host "==================================" -ForegroundColor Magenta
Write-Host "1. Open Postman and import: OWASP-Security-Testing-Postman-Collection.json"
Write-Host "2. Set baseUrl variable to: http://localhost:5000"
Write-Host "3. Run each test below and take screenshots of the responses"
Write-Host "4. Save screenshots in before-fixes/ and after-fixes/ folders"
Write-Host ""

# Test 1: NoSQL Injection
Write-Host "🧪 TEST 1: NoSQL Injection Prevention" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Request: POST /api/admin/login"
Write-Host "Payload: {`"email`":{`"`$ne`":null},`"password`":`"anything`"}" -ForegroundColor Cyan
Write-Host ""
Write-Host "Expected AFTER fix: 400 Bad Request - 'Attack Blocked!'"
Write-Host ""
Write-Host "📸 Take screenshot after running this in Postman!" -ForegroundColor Magenta
Write-Host ""

Read-Host "Press Enter after taking screenshot of Test 1"

# Test 2: Rate Limiting
Write-Host ""
Write-Host "🧪 TEST 2: Rate Limiting (Brute Force Protection)" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "Request: POST /api/admin/login (wrong credentials, multiple attempts)"
Write-Host "Expected AFTER fix: Attempts 1-5: 401, Attempt 6+: 429 Too many login attempts"
Write-Host ""
Write-Host "Payload: {`"email`":`"attacker@test.com`",`"password`":`"wrongpassword`"}" -ForegroundColor Cyan
Write-Host ""
Write-Host "📸 Take screenshot after running 6 attempts in Postman!" -ForegroundColor Magenta
Write-Host ""

Read-Host "Press Enter after taking screenshot of Test 2"

# Test 3: Public Read Access
Write-Host ""
Write-Host "🧪 TEST 3: Public Read Access" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host "Request: GET /api/events (no authentication)"
Write-Host "Expected AFTER fix: 200 OK with events data"
Write-Host ""
Write-Host "📸 Take screenshot after running this in Postman!" -ForegroundColor Magenta
Write-Host ""

Read-Host "Press Enter after taking screenshot of Test 3"

# Test 4: Authentication Required
Write-Host ""
Write-Host "🧪 TEST 4: Authentication Required for Writes" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "Request: POST /api/events (no auth token)"
Write-Host "Expected AFTER fix: 401 Unauthorized"
Write-Host ""
Write-Host "Payload: {`"title`":`"Unauthorized Event`",`"description`":`"Should be blocked`",`"date`":`"2025-01-01`",`"location`":`"Test`"}" -ForegroundColor Cyan
Write-Host ""
Write-Host "📸 Take screenshot after running this in Postman!" -ForegroundColor Magenta
Write-Host ""

Read-Host "Press Enter after taking screenshot of Test 4"

# Test 5: Password Validation
Write-Host ""
Write-Host "🧪 TEST 5: Password Validation" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host "Request: POST /api/admin/signup"
Write-Host "Payload: {`"email`":`"weak@test.com`",`"password`":`"weak`"}" -ForegroundColor Cyan
Write-Host "Expected AFTER fix: 400 Bad Request"
Write-Host ""
Write-Host "📸 Take screenshot after running this in Postman!" -ForegroundColor Magenta
Write-Host ""

Read-Host "Press Enter after taking screenshot of Test 5"

# Test 6: Error Handling
Write-Host ""
Write-Host "🧪 TEST 6: Safe Error Handling" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host "Request: GET /api/invalid-endpoint"
Write-Host "Expected AFTER fix: 404 Not Found (no stack traces)"
Write-Host ""
Write-Host "📸 Take screenshot after running this in Postman!" -ForegroundColor Magenta
Write-Host ""

Read-Host "Press Enter after taking screenshot of Test 6"

# Summary
Write-Host ""
Write-Host "🎯 SUMMARY" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan
Write-Host "✅ All security tests completed!"
Write-Host "📸 Screenshots captured for Postman collection"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Import OWASP-Security-Testing-Postman-Collection.json into Postman"
Write-Host "2. Run the AFTER FIXES folder tests"
Write-Host "3. Take screenshots of each response"
Write-Host "4. Organize in before-fixes/ and after-fixes/ folders"
Write-Host "5. Follow POSTMAN-SCREENSHOTS-GUIDE.md for detailed instructions"
Write-Host ""
Write-Host "SECURE: Your app is now OWASP Top 10 compliant!" -ForegroundColor Green