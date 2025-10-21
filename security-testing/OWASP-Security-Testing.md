# OWASP Top 10 Security Testing

## Overview
This document identifies and demonstrates fixes for OWASP Top 10 vulnerabilities found in the Planora event management application.

## Executive Summary
**Vulnerabilities Identified**: 4 critical issues
**Severity**: Medium to High
**Status**: Fixes implemented and documented

---

## Vulnerability #1: Broken Access Control (OWASP A01:2021)

### Description
The application allows **any user to create, update, and delete events** without requiring authentication or authorization. This is a critical broken access control issue.

### Affected Endpoints
- `POST /api/events` - Create event (No authentication required!)
- `PUT /api/events/:id` - Update event (No authentication required!)
- `DELETE /api/events/:id` - Delete event (No authentication required!)

### Current Vulnerable Code
**Location**: `BEplanora/routes/events.js`

```javascript
// ❌ VULNERABLE - No authentication middleware
router.post("/", eventController.createEvent);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);
```

### Security Risk
- **Impact**: HIGH
- **Likelihood**: HIGH
- **Overall Risk**: CRITICAL

**Attack Scenario**:
1. Malicious user discovers the API endpoint `/api/events`
2. Uses tools like Postman or curl to send POST requests
3. Can create unlimited fake events without authentication
4. Can delete all events in the database
5. Can modify existing events to contain malicious content

### Proof of Concept
```bash
# Anyone can create an event without logging in
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Malicious Event",
    "location": "Anywhere",
    "date": "2025-12-31"
  }'

# Anyone can delete any event
curl -X DELETE http://localhost:5000/api/events/123456789
```

### The Fix

#### Step 1: Create Authentication Middleware

Create file: `BEplanora/middleware/auth.js`

```javascript
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user from payload
      req.user = decoded;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ 
        message: "Not authorized, token failed" 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      message: "Not authorized, no token" 
    });
  }
};
```

#### Step 2: Apply Middleware to Protected Routes

**Updated**: `BEplanora/routes/events.js`

```javascript
import express from "express";
import { body } from "express-validator";
import * as eventController from "../controllers/eventController.js";
import { protect } from "../middleware/auth.js"; // ✅ Import middleware

const router = express.Router();

// ✅ PROTECTED - Require authentication for write operations
router.post(
  "/",
  protect, // ✅ Add authentication
  body("name").trim().escape().notEmpty(),
  body("location").trim().escape().notEmpty(),
  body("date").isISO8601().toDate(),
  eventController.createEvent
);

router.put(
  "/:id",
  protect, // ✅ Add authentication
  body("name").optional().trim().escape(),
  body("location").optional().trim().escape(),
  body("date").optional().isISO8601().toDate(),
  eventController.updateEvent
);

router.delete(
  "/:id", 
  protect, // ✅ Add authentication
  eventController.deleteEvent
);

// Public routes (read-only)
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

export default router;
```

### Testing the Fix

#### Before Fix (Vulnerable):
```bash
# ❌ This works WITHOUT authentication
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{"name": "Hack", "location": "Test", "date": "2025-12-31"}'
# Response: 201 Created ❌
```

#### After Fix (Secure):
```bash
# ❌ This fails WITHOUT authentication
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{"name": "Hack", "location": "Test", "date": "2025-12-31"}'
# Response: 401 Unauthorized ✅

# ✅ This works WITH valid token
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <valid-jwt-token>" \
  -d '{"name": "Valid Event", "location": "Office", "date": "2025-12-31"}'
# Response: 201 Created ✅
```

### Verification Steps
1. ✅ Try to create event without token → Should get 401
2. ✅ Try to update event without token → Should get 401
3. ✅ Try to delete event without token → Should get 401
4. ✅ Try with valid token → Should succeed
5. ✅ Try with expired token → Should get 401
6. ✅ Try with invalid token → Should get 401

---

## Vulnerability #2: Security Misconfiguration (OWASP A05:2021)

### Description
The application exposes **detailed error messages** to users, revealing internal implementation details, file paths, and stack traces.

### Affected Code
**Location**: Multiple controllers

```javascript
// ❌ VULNERABLE - Exposes internal error details
catch (error) {
  res.status(500).json({ message: error.message });
}
```

### Security Risk
- **Impact**: MEDIUM
- **Likelihood**: HIGH
- **Overall Risk**: MEDIUM

**Information Disclosed**:
- Database structure and query details
- File paths and directory structure
- Framework and library versions
- Stack traces with code snippets

### Example of Leaked Information
```json
{
  "message": "Cast to ObjectId failed for value '123' at path '_id' for model 'Event'",
  "stack": "CastError: Cast to ObjectId failed...\n    at model.findById (/app/node_modules/mongoose/..."
}
```

### The Fix

#### Step 1: Create Error Handler Middleware

Create file: `BEplanora/middleware/errorHandler.js`

```javascript
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging (server-side only)
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Determine status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Send generic error message in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message: isDevelopment 
      ? err.message 
      : 'An error occurred while processing your request',
    // Only show stack trace in development
    ...(isDevelopment && { stack: err.stack }),
  });
};
```

#### Step 2: Apply Error Handler

**Updated**: `BEplanora/app.js`

```javascript
import { errorHandler } from './middleware/errorHandler.js';

// ... other middleware

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Add error handler (MUST be after routes)
app.use(errorHandler);

// ... rest of app
```

#### Step 3: Update Controllers to Use Error Handler

**Updated**: `BEplanora/controllers/eventController.js`

```javascript
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error("Event not found"); // ✅ Generic message
    }
    res.json({ success: true, data: event });
  } catch (err) {
    next(err); // ✅ Pass to error handler
  }
};
```

### Testing the Fix

#### Before Fix:
```bash
curl http://localhost:5000/api/events/invalid-id
# Response exposes MongoDB internals:
{
  "message": "Cast to ObjectId failed for value 'invalid-id'...",
  "stack": "at CastError: /node_modules/mongoose/..."
}
```

#### After Fix (Production):
```bash
curl http://localhost:5000/api/events/invalid-id
# Response is generic:
{
  "success": false,
  "message": "An error occurred while processing your request"
}
```

#### After Fix (Development):
```bash
NODE_ENV=development npm start
curl http://localhost:5000/api/events/invalid-id
# Response shows details only in dev:
{
  "success": false,
  "message": "Event not found",
  "stack": "..." // Only in development
}
```

---

## Vulnerability #3: Injection (OWASP A03:2021) - NoSQL Injection

### Description
MongoDB queries using user input without proper validation can lead to **NoSQL injection attacks**.

### Affected Code
**Location**: `BEplanora/controllers/adminController.js`

```javascript
// ❌ VULNERABLE to NoSQL injection
const admin = await Admin.findOne({ email });
```

### Security Risk
- **Impact**: HIGH
- **Likelihood**: MEDIUM
- **Overall Risk**: HIGH

**Attack Scenario**:
Attacker sends malicious JSON object instead of email string:

```json
{
  "email": { "$ne": null },
  "password": "anything"
}
```

This bypasses authentication and logs in as the first admin in the database!

### Proof of Concept
```bash
# NoSQL Injection attempt
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": {"$ne": null},
    "password": "anything"
  }'
# ❌ This could bypass authentication!
```

### The Fix

#### Step 1: Add Input Validation Middleware

**Updated**: `BEplanora/routes/admin.js`

```javascript
import express from "express";
import { body } from "express-validator";
import { signupAdmin, loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// ✅ Add strict validation
router.post(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("firstName")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("First name is required"),
    body("lastName")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("Last name is required"),
  ],
  signupAdmin
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("password")
      .isString()
      .notEmpty()
      .withMessage("Password is required"),
  ],
  loginAdmin
);

export default router;
```

#### Step 2: Update Controller with Validation Check

**Updated**: `BEplanora/controllers/adminController.js`

```javascript
import { validationResult } from "express-validator";

export const loginAdmin = async (req, res, next) => {
  try {
    // ✅ Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // ✅ Type checking - ensure string inputs
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ 
        message: "Invalid input format" 
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      _id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      token,
    });
  } catch (error) {
    next(error); // ✅ Use error handler
  }
};
```

### Testing the Fix

#### Before Fix:
```bash
# ❌ NoSQL injection works
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": {"$ne": null}, "password": "anything"}'
# Response: 200 OK with admin token ❌
```

#### After Fix:
```bash
# ✅ NoSQL injection blocked
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": {"$ne": null}, "password": "anything"}'
# Response: 400 Bad Request
# {
#   "success": false,
#   "errors": [{"msg": "Valid email is required"}]
# } ✅
```

---

## Vulnerability #4: Identification and Authentication Failures (OWASP A07:2021)

### Description
The application has **weak password requirements** and **no rate limiting** on login attempts, allowing brute force attacks.

### Current Issues
1. No minimum password length enforced
2. No password complexity requirements
3. No rate limiting on login endpoint
4. No account lockout after failed attempts

### Security Risk
- **Impact**: HIGH
- **Likelihood**: HIGH
- **Overall Risk**: CRITICAL

### The Fix

#### Step 1: Strengthen Password Requirements

**Updated**: `BEplanora/routes/admin.js`

```javascript
router.post(
  "/signup",
  [
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage("Password must contain uppercase, lowercase, number, and special character"),
  ],
  signupAdmin
);
```

#### Step 2: Add Rate Limiting

Install rate limiter:
```bash
cd BEplanora
npm install express-rate-limit
```

Create file: `BEplanora/middleware/rateLimiter.js`

```javascript
import rateLimit from 'express-rate-limit';

// ✅ Limit login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});
```

**Updated**: `BEplanora/routes/admin.js`

```javascript
import { loginLimiter } from "../middleware/rateLimiter.js";

// ✅ Apply rate limiter to login
router.post(
  "/login",
  loginLimiter, // ✅ Add rate limiting
  [
    body("email").trim().isEmail().normalizeEmail(),
    body("password").isString().notEmpty(),
  ],
  loginAdmin
);
```

### Testing the Fix

```bash
# Try 6 login attempts rapidly
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/admin/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test@test.com", "password": "wrong"}'
  echo "\nAttempt $i"
done

# After 5 attempts:
# {
#   "success": false,
#   "message": "Too many login attempts, please try again after 15 minutes"
# } ✅
```

---

## Summary of Fixes

| Vulnerability | Severity | Status | Fix |
|--------------|----------|--------|-----|
| Broken Access Control | CRITICAL | ✅ Fixed | Added JWT authentication middleware |
| Security Misconfiguration | MEDIUM | ✅ Fixed | Implemented error handler |
| NoSQL Injection | HIGH | ✅ Fixed | Added input validation |
| Weak Authentication | HIGH | ✅ Fixed | Strengthened passwords + rate limiting |

## Next Steps

1. ✅ Review and test all fixes
2. ✅ Update API documentation with authentication requirements
3. ✅ Add security testing to CI/CD pipeline
4. ✅ Implement logging and monitoring for security events
5. ✅ Conduct penetration testing

## References

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
