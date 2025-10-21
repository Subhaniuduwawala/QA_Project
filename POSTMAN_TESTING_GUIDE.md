# MongoDB NoSQL Injection - Postman Test Guide

## How to Test MongoDB Injection Protection

### Test 1: Before Fix - Vulnerable Login (Attack Succeeds)

**Endpoint:** `POST http://localhost:5000/api/admin/login`

**Headers:**
```
Content-Type: application/json
```

**Body (Malicious Payload):**
```json
{
  "email": {"$gt": ""},
  "password": {"$gt": ""}
}
```

**Expected Result (Before Fix):**
- ❌ Status: 200 OK
- ❌ Returns user data and token
- ❌ Authentication bypassed!

---

### Test 2: After Fix - Protected Login (Attack Blocked)

**Endpoint:** `POST http://localhost:5000/api/admin/login`

**Headers:**
```
Content-Type: application/json
```

**Body (Same Malicious Payload):**
```json
{
  "email": {"$gt": ""},
  "password": {"$gt": ""}
}
```

**Expected Result (After Fix):**
- ✅ Status: 400 Bad Request
- ✅ Returns validation error
- ✅ Attack blocked by sanitization!

**Response:**
```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "value": "[object Object]",
      "msg": "Valid email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

---

### Test 3: Normal Login Still Works

**Endpoint:** `POST http://localhost:5000/api/admin/login`

**Headers:**
```
Content-Type: application/json
```

**Body (Legitimate Request):**
```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Returns user data and JWT token
- ✅ Normal functionality preserved

**Response:**
```json
{
  "success": true,
  "_id": "...",
  "firstName": "Test",
  "lastName": "Admin",
  "email": "admin@example.com",
  "token": "eyJhbGci..."
}
```

---

## Screenshot Capture Steps

### For "Before Fix" Screenshot:
1. Comment out the sanitization middleware in `app.js`:
   ```javascript
   // app.use(mongoSanitize);
   ```
2. Restart the server
3. Run Test 1 in Postman
4. Capture screenshot showing successful attack (200 OK with token)

### For "After Fix" Screenshot:
1. Uncomment the sanitization middleware:
   ```javascript
   app.use(mongoSanitize);
   ```
2. Restart the server
3. Run Test 2 in Postman
4. Capture screenshot showing blocked attack (400 Bad Request)

---

## Additional Malicious Payloads to Test

### Test 4: $ne (Not Equal) Injection
```json
{
  "email": {"$ne": null},
  "password": {"$ne": null}
}
```

### Test 5: $regex Injection
```json
{
  "email": {"$regex": ".*"},
  "password": "Password123!"
}
```

### Test 6: $where Injection
```json
{
  "email": "admin@example.com",
  "$where": "this.password.length > 0"
}
```

All of these should be **BLOCKED** after the fix is applied.

---

## Verification Checklist

- [ ] MongoDB injection attack fails with 400 error
- [ ] Normal login still works with valid credentials
- [ ] Invalid credentials still return 401/400 errors
- [ ] Server doesn't crash when receiving malicious payloads
- [ ] Error messages don't reveal sensitive information
- [ ] All MongoDB operators ($gt, $ne, $regex, $where, etc.) are stripped

## Security Impact

**Severity:** HIGH
**CWE:** CWE-943 (Improper Neutralization of Special Elements in Data Query Logic)
**OWASP:** A03:2021 – Injection

**Before:** Attackers could bypass authentication and access any account
**After:** MongoDB operators are sanitized, injection attacks are blocked
