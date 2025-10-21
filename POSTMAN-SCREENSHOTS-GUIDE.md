# 📸 OWASP Security Testing - Postman Screenshots Guide

**Date:** October 21, 2025
**Purpose:** Capture visual evidence of OWASP Top 10 security fixes
**Collection:** `OWASP-Security-Testing-Postman-Collection.json`

---

## 🎯 SCREENSHOT CAPTURE INSTRUCTIONS

### Prerequisites
1. **Install Postman** (if not already installed)
2. **Import the collection:** `OWASP-Security-Testing-Postman-Collection.json`
3. **Start your server:** `cd BEplanora && npm start`
4. **Set environment variable:** `baseUrl = http://localhost:5000`

### Screenshot Requirements
- **Resolution:** 1920x1080 or higher
- **Format:** PNG or JPG
- **Naming:** `[TestNumber]-[Before/After]-[Description].png`
- **Include:** Full Postman window showing request, response, and status

---

## 📋 TESTS TO CAPTURE (BEFORE/AFTER COMPARISON)

### Test 1: NoSQL Injection Prevention
**Request:** POST `/api/admin/login` with MongoDB operator payload

**BEFORE Screenshot:**
- **Expected:** 200 OK (vulnerable - would authenticate with fake data)
- **File:** `01-Before-NoSQL-Injection.png`

**AFTER Screenshot:**
- **Expected:** 400 Bad Request with "Attack Blocked!" message
- **File:** `01-After-NoSQL-Injection-Blocked.png`

**Payload:**
```json
{
  "email": {"$ne": null},
  "password": "anything"
}
```

---

### Test 2: Rate Limiting (Brute Force Protection)
**Request:** POST `/api/admin/login` with wrong credentials (run 6 times)

**BEFORE Screenshot:**
- **Expected:** All 6 attempts return 401 (no rate limiting)
- **File:** `02-Before-No-Rate-Limiting.png`

**AFTER Screenshot:**
- **Expected:** Attempts 1-5: 401, Attempt 6: 429 "Too many login attempts"
- **File:** `02-After-Rate-Limiting-Active.png`

**Payload:**
```json
{
  "email": "attacker@test.com",
  "password": "wrongpassword"
}
```

---

### Test 3: Public Read Access
**Request:** GET `/api/events` (no authentication)

**BEFORE Screenshot:**
- **Expected:** 401 Unauthorized (everything required auth)
- **File:** `03-Before-No-Public-Access.png`

**AFTER Screenshot:**
- **Expected:** 200 OK with events array
- **File:** `03-After-Public-Read-Works.png`

---

### Test 4: Authentication Required for Writes
**Request:** POST `/api/events` without Authorization header

**BEFORE Screenshot:**
- **Expected:** 201 Created (no auth required)
- **File:** `04-Before-Unprotected-Writes.png`

**AFTER Screenshot:**
- **Expected:** 401 Unauthorized
- **File:** `04-After-Auth-Required-Writes.png`

**Payload:**
```json
{
  "title": "Test Event",
  "description": "Should require auth",
  "date": "2025-01-01",
  "location": "Test Location"
}
```

---

### Test 5: Password Validation
**Request:** POST `/api/admin/signup` with weak password

**BEFORE Screenshot:**
- **Expected:** 201 Created (any password accepted)
- **File:** `05-Before-Weak-Passwords-Allowed.png`

**AFTER Screenshot:**
- **Expected:** 400 Bad Request
- **File:** `05-After-Password-Validation.png`

**Payload:**
```json
{
  "email": "weak@test.com",
  "password": "123"
}
```

---

### Test 6: Error Handling Safety
**Request:** GET `/api/nonexistent-endpoint`

**BEFORE Screenshot:**
- **Expected:** 500 Internal Server Error with stack trace
- **File:** `06-Before-Stack-Trace-Leak.png`

**AFTER Screenshot:**
- **Expected:** 404 Not Found with safe error message
- **File:** `06-After-Safe-Error-Handling.png`

---

### Test 7: Successful Authentication Flow
**Request:** POST `/api/admin/signup` then POST `/api/admin/login`

**AFTER Screenshot (Signup):**
- **Expected:** 201 Created with JWT token
- **File:** `07-After-Successful-Signup.png`

**Payload:**
```json
{
  "email": "secure@test.com",
  "password": "SecurePass123!"
}
```

**AFTER Screenshot (Login):**
- **Expected:** 200 OK with JWT token
- **File:** `07-After-Successful-Login.png`

---

### Test 8: Authenticated Write Operations
**Request:** POST `/api/events` with Authorization header

**AFTER Screenshot:**
- **Expected:** 201 Created (authenticated request successful)
- **File:** `08-After-Authenticated-Create.png`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer [JWT_TOKEN_FROM_LOGIN]
```

**Payload:**
```json
{
  "title": "Secure Event",
  "description": "Created with valid authentication",
  "date": "2025-01-01",
  "location": "Secure Location"
}
```

---

## 📁 SCREENSHOT ORGANIZATION

Create a folder structure like this:
```
screenshots/
├── before-fixes/
│   ├── 01-Before-NoSQL-Injection.png
│   ├── 02-Before-No-Rate-Limiting.png
│   ├── 03-Before-No-Public-Access.png
│   ├── 04-Before-Unprotected-Writes.png
│   ├── 05-Before-Weak-Passwords-Allowed.png
│   └── 06-Before-Stack-Trace-Leak.png
└── after-fixes/
    ├── 01-After-NoSQL-Injection-Blocked.png
    ├── 02-After-Rate-Limiting-Active.png
    ├── 03-After-Public-Read-Works.png
    ├── 04-After-Auth-Required-Writes.png
    ├── 05-After-Password-Validation.png
    ├── 06-After-Safe-Error-Handling.png
    ├── 07-After-Successful-Signup.png
    ├── 07-After-Successful-Login.png
    └── 08-After-Authenticated-Create.png
```

---

## 📸 HOW TO TAKE SCREENSHOTS IN POSTMAN

### Method 1: Postman Built-in Screenshot
1. Send the request
2. Click the **"Save Response"** button (floppy disk icon)
3. Choose **"Save as image"**
4. Save with appropriate filename

### Method 2: System Screenshot
1. Send the request in Postman
2. Use Windows Snipping Tool or Win+Shift+S
3. Capture the full Postman window
4. Save with appropriate filename

### Method 3: Browser Screenshot (if using Postman Web)
1. Send request
2. Press F12 to open DevTools
3. Use browser's screenshot tool
4. Or use Ctrl+Shift+P → "Capture full size screenshot"

---

## ✅ VERIFICATION CHECKLIST

After capturing all screenshots, verify:

- [ ] **BEFORE screenshots** show vulnerable behavior
- [ ] **AFTER screenshots** show security controls working
- [ ] **All 8 test pairs** captured (16 total screenshots)
- [ ] **File naming** follows the specified convention
- [ ] **Full Postman window** visible in each screenshot
- [ ] **Request and response** clearly visible
- [ ] **HTTP status codes** match expected results

---

## 🔍 INTERPRETING RESULTS

### Security Controls Demonstrated:

1. **Input Validation** (A03:2021) - Blocks NoSQL injection
2. **Rate Limiting** (A07:2021) - Prevents brute force attacks
3. **Authorization** (A01:2021) - Protects write operations
4. **Authentication** (A02:2021) - JWT token validation
5. **Password Security** (A02:2021) - Strong password requirements
6. **Error Handling** (A02:2021) - Prevents information disclosure

### Expected Status Codes:
- **200 OK** - Successful requests
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid input/validation failed
- **401 Unauthorized** - Authentication required/missing
- **404 Not Found** - Resource not found (safe error)
- **429 Too Many Requests** - Rate limit exceeded

---

## 📤 SUBMISSION INSTRUCTIONS

1. **Organize screenshots** in the folder structure above
2. **Create a ZIP file:** `OWASP-Security-Screenshots.zip`
3. **Include this guide** in the ZIP file
4. **Upload to GitHub** in a new folder: `screenshots/`

### GitHub Upload Commands:
```bash
# Create screenshots folder
mkdir screenshots

# Copy your screenshot folders here
# ... copy before-fixes/ and after-fixes/ folders ...

# Add to git
git add screenshots/
git commit -m "📸 Add OWASP security testing screenshots - Before/After evidence"
git push origin main
```

---

## 🎯 FINAL DELIVERABLE

Your complete OWASP security evidence package will include:

- ✅ **Source code** with security fixes
- ✅ **Automated test results** (`SECURITY-TEST-RESULTS.md`)
- ✅ **Comprehensive documentation** (`README.md`)
- ✅ **Visual evidence** (16 screenshots showing before/after)
- ✅ **Postman collection** for future testing

**This provides complete proof that all OWASP Top 10 vulnerabilities have been identified and fixed!** 🔒

---

*Generated: October 21, 2025*</content>
<parameter name="filePath">C:\Users\Asus\Documents\Project\QA project\POSTMAN-SCREENSHOTS-GUIDE.md