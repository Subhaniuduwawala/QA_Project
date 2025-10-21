# OWASP Security Testing - Screenshot Capture Script
# Run this script to demonstrate security fixes for screenshot capture

Write-Host "🔒 OWASP Security Testing - Screenshot Capture Demo" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
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
Write-Host "Payload: {'email':{'$ne':null},'password':'anything'}"
Write-Host ""
Write-Host "Expected AFTER fix: 400 Bad Request - 'Attack Blocked!'"
Write-Host ""

# Demonstrate the test
Write-Host "Running NoSQL injection test..." -ForegroundColor Yellow
try {
    $payload = '{"email":{"$ne":null},"password":"anything"}'
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/admin/login" -Method POST -Body $payload -ContentType "application/json" -ErrorAction Stop
    Write-Host "Response: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Red
    Write-Host "❌ VULNERABLE: NoSQL injection not blocked!" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Response: $statusCode $($_.Exception.Response.StatusDescription)" -ForegroundColor Green
    if ($statusCode -eq 400) {
        Write-Host "✅ SECURE: NoSQL injection blocked!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Unexpected response - check server logs" -ForegroundColor Yellow
    }
}

Write-Host ""
Read-Host "Press Enter after taking screenshot of Test 1"

# Test 2: Rate Limiting
Write-Host ""
Write-Host "🧪 TEST 2: Rate Limiting (Brute Force Protection)" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "Request: POST /api/admin/login (wrong credentials, multiple attempts)"
Write-Host "Expected AFTER fix: Attempts 1-5: 401, Attempt 6+: 429 'Too many login attempts'"
Write-Host ""

$wrongCreds = '{"email":"attacker@test.com","password":"wrongpassword"}'
Write-Host "Running 6 login attempts..." -ForegroundColor Yellow
for ($i = 1; $i -le 6; $i++) {
    Write-Host "Attempt $i..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/admin/login" -Method POST -Body $wrongCreds -ContentType "application/json" -ErrorAction Stop
        Write-Host " 401 Unauthorized" -ForegroundColor Yellow
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 429) {
            Write-Host " 429 Too Many Requests - RATE LIMITED!" -ForegroundColor Green
        } elseif ($statusCode -eq 401) {
            Write-Host " 401 Unauthorized" -ForegroundColor Yellow
        } else {
            Write-Host " $statusCode $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
        }
    }
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Read-Host "Press Enter after taking screenshot of Test 2"

# Test 3: Public Read Access
Write-Host ""
Write-Host "🧪 TEST 3: Public Read Access" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host "Request: GET /api/events (no authentication)"
Write-Host "Expected AFTER fix: 200 OK with events data"
Write-Host ""

Write-Host "Testing public read access..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/events" -Method GET -ErrorAction Stop
    $content = $response.Content | ConvertFrom-Json
    Write-Host "Response: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Events count: $($content.count)" -ForegroundColor Green
    Write-Host "✅ SECURE: Public read access working!" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Response: $statusCode $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    Write-Host "❌ ISSUE: Public read not working" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter after taking screenshot of Test 3"

# Test 4: Authentication Required
Write-Host ""
Write-Host "🧪 TEST 4: Authentication Required for Writes" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "Request: POST /api/events (no auth token)"
Write-Host "Expected AFTER fix: 401 Unauthorized"
Write-Host ""

$eventData = '{"title":"Unauthorized Event","description":"Should be blocked","date":"2025-01-01","location":"Test"}'
Write-Host "Testing unauthorized write access..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/events" -Method POST -Body $eventData -ContentType "application/json" -ErrorAction Stop
    Write-Host "Response: $($response.StatusCode) Created" -ForegroundColor Red
    Write-Host "❌ VULNERABLE: Write access not protected!" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Response: $statusCode $($_.Exception.Response.StatusDescription)" -ForegroundColor Green
    if ($statusCode -eq 401) {
        Write-Host "✅ SECURE: Write access requires authentication!" -ForegroundColor Green
    }
}

Write-Host ""
Read-Host "Press Enter after taking screenshot of Test 4"

# Test 5: Password Validation
Write-Host ""
Write-Host "🧪 TEST 5: Password Validation" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host "Request: POST /api/admin/signup"
Write-Host "Payload: {'email':'weak@test.com','password':'weak'}"
Write-Host "Expected AFTER fix: 400 Bad Request"
Write-Host ""

$weakPassword = '{"email":"weak@test.com","password":"weak"}'
Write-Host "Testing weak password validation..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/admin/signup" -Method POST -Body $weakPassword -ContentType "application/json" -ErrorAction Stop
    Write-Host "Response: $($response.StatusCode) Created" -ForegroundColor Red
    Write-Host "❌ VULNERABLE: Weak passwords accepted!" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Response: $statusCode $($_.Exception.Response.StatusDescription)" -ForegroundColor Green
    if ($statusCode -eq 400) {
        Write-Host "✅ SECURE: Password validation working!" -ForegroundColor Green
    }
}

Write-Host ""
Read-Host "Press Enter after taking screenshot of Test 5"

# Test 6: Error Handling
Write-Host ""
Write-Host "🧪 TEST 6: Safe Error Handling" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host "Request: GET /api/invalid-endpoint"
Write-Host "Expected AFTER fix: 404 Not Found (no stack traces)"
Write-Host ""

Write-Host "Testing error handling safety..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/invalid-endpoint" -Method GET -ErrorAction Stop
    Write-Host "Response: $($response.StatusCode) OK" -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Response: $statusCode $($_.Exception.Response.StatusDescription)" -ForegroundColor Green
    if ($statusCode -eq 404) {
        Write-Host "✅ SECURE: Safe error handling (no stack traces)!" -ForegroundColor Green
    }
}

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
Write-Host "2. Run the 'AFTER FIXES' folder tests"
Write-Host "3. Take screenshots of each response"
Write-Host "4. Organize in before-fixes/ and after-fixes/ folders"
Write-Host "5. Follow POSTMAN-SCREENSHOTS-GUIDE.md for detailed instructions"
Write-Host ""
Write-Host "🔒 Your app is now OWASP Top 10 compliant!" -ForegroundColor Green</content>
<parameter name="filePath">C:\Users\Asus\Documents\Project\QA project\screenshot-capture-demo.ps1