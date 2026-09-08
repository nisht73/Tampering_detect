# Backend Developer Guide

> Node.js + Express.js API for the Border Force Identity Portal.  
> Runs on **port 5000** by default.

---

## Folder Layout

```
backend/
├── app.js                  # Entry point: middleware, routes, server start
├── .env                    # Environment variables (not committed)
│
├── config/
│   ├── db.js               # MongoDB connection via Mongoose
│   └── riskWeights.js      # Configurable risk score weights & thresholds
│
├── controllers/            # Route handler functions
│   ├── authController.js
│   ├── documentController.js
│   ├── screeningController.js
│   ├── dashboardController.js
│   ├── userController.js
│   └── auditController.js
│
├── routes/                 # Express routers
│   ├── authRoutes.js       → /api/auth
│   ├── documentRoutes.js   → /api/documents
│   ├── screeningRoutes.js  → /api/screenings
│   ├── dashboardRoutes.js  → /api/dashboard
│   ├── userRoutes.js       → /api/users
│   └── auditRoutes.js      → /api/audit-logs
│
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── Document.js
│   ├── Screening.js
│   ├── AuditLog.js
│   └── ReferenceRecord.js
│
├── services/               # Business logic (no Express objects here)
│   ├── aiService.js        # HTTP calls to Python FastAPI
│   ├── documentService.js  # File I/O & document metadata
│   ├── screeningService.js # Full screening orchestration
│   ├── validationService.js# Field, expiry, cross-doc validation
│   ├── riskService.js      # Weighted risk score calculation
│   └── auditService.js     # Audit log creation helper
│
├── middleware/
│   ├── authMiddleware.js   # JWT verification
│   ├── roleMiddleware.js   # Role-based access guard
│   ├── uploadMiddleware.js # Multer config (file type/size validation)
│   └── errorMiddleware.js  # Centralized error handler
│
├── seeds/                  # Seed scripts for reference/test data
├── uploads/                # Uploaded document files (gitignored)
└── utils/
    ├── logger.js           # Logging utility
    └── helpers.js          # generateScreeningId(), etc.
```

---

## Layered Request Flow

```
HTTP Request
    ↓
Route (routes/*.js)
    ↓
Middleware (auth, role, upload validation)
    ↓
Controller (controllers/*.js)   — handles req/res only
    ↓
Service Layer (services/*.js)   — all business logic
    ↓
Database (models/*.js via Mongoose)
    ↓
Response / Error Middleware
```

> **Rule:** Controllers only read from `req` and write to `res`. No business logic lives in controllers or routes.

---

## Services

### `screeningService.js` — Orchestrator

This is the core of the application. It runs asynchronously after creating a screening record.

**Workflow:**
```
createScreening()
    → save Screening with status PROCESSING
    → for each document: aiService.analyzeDocument()
    → validationService.validateDocument()
    → validationService.validateExpiry()
    → validationService.checkReferences()
    → validationService.crossDocumentValidation() (if > 1 doc)
    → riskService.calculateRisk()
    → save all results to Screening
    → set status = COMPLETED or REVIEW_REQUIRED
    → create AuditLog at each step
```

If any step throws, the screening is set to `FAILED` and an audit entry is created with the error.

---

### `aiService.js` — AI HTTP Client

Sends the document file to the Python FastAPI service via `multipart/form-data`.

```js
aiService.analyzeDocument(filePath)
```

Returns structured `{ ocr, tampering, face }` or throws `AI_SERVICE_UNAVAILABLE` if FastAPI is unreachable.  
The Node server **does not crash** when AI is unavailable — the error is caught and the screening is marked `FAILED`.

---

### `validationService.js` — Business Rules

| Function                          | What it checks                                   |
|-----------------------------------|--------------------------------------------------|
| `validateDocument(ocr, type)`     | Required fields present, basic format rules       |
| `validateExpiry(expiryDate)`      | Returns `VALID`, `EXPIRING_SOON`, `EXPIRED`, or `UNKNOWN` |
| `checkReferences(documentNumber)` | Queries `ReferenceRecord` collection for blacklist hits |
| `crossDocumentValidation(docs[])` | Compares name, DOB, passport number across docs  |

---

### `riskService.js` — Risk Score

Accepts signals from all upstream services and produces:

```json
{
  "score": 72,
  "level": "HIGH",
  "factors": [
    { "reason": "Tampering detected", "weight": 30 },
    { "reason": "Document expired", "weight": 25 }
  ]
}
```

Weights are imported from `config/riskWeights.js` — never scattered in route handlers.  
Score is capped at 100.

---

### `auditService.js` — Immutable Audit Trail

Creates an `AuditLog` document for every important event.  
Standard actions:

```
DOCUMENT_UPLOADED
OCR_REQUESTED
AI_ANALYSIS_COMPLETED
VALIDATION_COMPLETED
RISK_SCORE_GENERATED
SCREENING_COMPLETED
SCREENING_FAILED
SCREENING_CREATED
```

---

## MongoDB Models

### User
```
_id, name, email, passwordHash, role (OFFICER|ADMIN), createdAt, updatedAt
```

### Document
```
_id, documentId, originalFileName, documentType, filePath, mimeType,
fileSize, uploadedBy (ref: User), createdAt
```

### Screening
```
_id, screeningId, userId (ref: User), documentIds ([ref: Document]),
faceImageId, status, documentType, ocrResult, tamperingResult,
faceResult, validationResult, riskResult, createdAt, completedAt
```

### AuditLog
```
_id, screeningId, userId, action, status, metadata (Object), timestamp
```

### ReferenceRecord
```
_id, documentNumber, status (BLACKLISTED|CLEAR|FLAGGED), notes, createdAt
```

---

## Middleware

| File                  | Purpose                                                          |
|-----------------------|------------------------------------------------------------------|
| `authMiddleware.js`   | Verifies `Authorization: Bearer <JWT>`, attaches `req.user`      |
| `roleMiddleware.js`   | Guards admin routes — returns 403 if role not in allowed list    |
| `uploadMiddleware.js` | Multer config: validates MIME type, limits to 10 MB, renames file safely |
| `errorMiddleware.js`  | Catches all unhandled errors, returns JSON error without stack trace in production |

---

## Error Handling Strategy

| Status | Code                       | Scenario                                |
|--------|----------------------------|-----------------------------------------|
| 400    | BAD_REQUEST                | Missing required fields                 |
| 401    | UNAUTHORIZED               | Missing or invalid JWT                  |
| 403    | FORBIDDEN                  | Valid JWT but insufficient role         |
| 404    | NOT_FOUND                  | Resource not found                      |
| 413    | PAYLOAD_TOO_LARGE          | File exceeds 10 MB                      |
| 422    | VALIDATION_ERROR           | Field validation failed                 |
| 500    | INTERNAL_SERVER_ERROR      | Unexpected server error                 |
| 503    | AI_SERVICE_UNAVAILABLE     | FastAPI service is unreachable          |

All errors are centralized in `errorMiddleware.js`. Controllers use `next(error)` to pass errors there.  
Stack traces are **never** sent to the client in production.

---

## Security Summary

- **Helmet** — sets secure HTTP headers
- **CORS** — only allows requests from `CLIENT_URL`
- **Rate limiting** — 100 requests / 15 minutes on `/api/auth`
- **Multer** — validates MIME type and extension, generates random server-side filenames
- **bcryptjs** — all passwords hashed before storage
- **JWT secrets** — loaded from `.env`, never hard-coded
- **Uploads directory** — served as static files, not executable
