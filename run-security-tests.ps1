# OWASP Security Testing - All Tests

Write-Host "`n==========================================`n" -ForegroundColor Cyan
Write-Host "OWASP SECURITY TESTING - ALL TESTS" -ForegroundColor Cyan
Write-Host "`n==========================================`n" -ForegroundColor Cyan

# Test 1: Rate Limiting
Write-Host "TEST 1: RATE LIMITING (Brute Force Protection)" -ForegroundColor Yellow
Write-Host "=========================================`n" -ForegroundColor Yellow

Write-Host "Sending 6 login attempts (limit is 5 per 15 minutes)`n" -ForegroundColor Cyan

for ($i = 1; $i -le 6; $i++) {
    Write-Host "Attempt $($i):" -ForegroundColor White
    
    $body = @{email = "test@test.com"; password = "Wrong123!"} | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/admin/login" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        
        $content = $response.Content | ConvertFrom-Json
        Write-Host "  HTTP 400 - $($content.message)" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 429) {
            $content = $_.Exception.Response.Content.ReadAsString() | ConvertFrom-Json
            Write-Host "  HTTP 429 - $($content.message)" -ForegroundColor Red
        } else {
            $content = $_.Exception.Response.Content.ReadAsString() | ConvertFrom-Json
            Write-Host "  HTTP $($_.Exception.Response.StatusCode) - $($content.message)" -ForegroundColor Green
        }
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n✓ TEST 1 COMPLETE`n" -ForegroundColor Green

# Test 2: NoSQL Injection
Write-Host "TEST 2: NoSQL INJECTION PREVENTION" -ForegroundColor Yellow
Write-Host "=========================================`n" -ForegroundColor Yellow

Write-Host "Attempting MongoDB operator injection...`n" -ForegroundColor Cyan

$body = @{email = @{"`$ne" = $null}; password = "anything"} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/admin/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    
    $content = $response.Content | ConvertFrom-Json
    Write-Host "  FAILED - Attack accepted!" -ForegroundColor Red
}
catch {
    $content = $_.Exception.Response.Content.ReadAsString() | ConvertFrom-Json
    Write-Host "  HTTP $($_.Exception.Response.StatusCode) - Attack blocked!" -ForegroundColor Green
    Write-Host "  Response: $($content.message)" -ForegroundColor Cyan
}

Write-Host "`n✓ TEST 2 COMPLETE`n" -ForegroundColor Green

# Test 3: Public Read Access
Write-Host "TEST 3: PUBLIC READ ACCESS (No Auth Required)" -ForegroundColor Yellow
Write-Host "=========================================`n" -ForegroundColor Yellow

Write-Host "Getting events without token (should work)...`n" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/events" `
        -Method GET
    
    $content = $response.Content | ConvertFrom-Json
    Write-Host "  HTTP 200 - Success!" -ForegroundColor Green
    Write-Host "  Events count: $($content.count)" -ForegroundColor Cyan
}
catch {
    Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✓ TEST 3 COMPLETE`n" -ForegroundColor Green

# Test 4: Authentication Required
Write-Host "TEST 4: AUTHENTICATION REQUIRED (Write Operations)" -ForegroundColor Yellow
Write-Host "=========================================`n" -ForegroundColor Yellow

Write-Host "Attempting POST without token (should fail)...`n" -ForegroundColor Cyan

$body = @{name = "Test Event"; location = "Test"; date = "2025-12-15T09:00:00Z"} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/events" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "  FAILED - Post accepted without token!" -ForegroundColor Red
}
catch {
    $content = $_.Exception.Response.Content.ReadAsString() | ConvertFrom-Json
    Write-Host "  HTTP $($_.Exception.Response.StatusCode) - POST blocked!" -ForegroundColor Green
    Write-Host "  Response: $($content.message)" -ForegroundColor Cyan
}

Write-Host "`n✓ TEST 4 COMPLETE`n" -ForegroundColor Green

Write-Host "==========================================`n" -ForegroundColor Cyan
Write-Host "ALL TESTS EXECUTED SUCCESSFULLY!" -ForegroundColor Cyan
Write-Host "`n==========================================`n" -ForegroundColor Cyan
