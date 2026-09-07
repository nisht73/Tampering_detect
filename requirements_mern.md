# AI-Based Fake Identity & Document Screening System

## MERN / Web Application Requirements

> **Team responsibility:** This document defines the requirements for
> the **website, MERN application, main backend, database, and
> integration layer** handled by the MERN developer.
>
> The actual AI/ML implementation (OCR models, tampering-detection
> models, face-recognition models, etc.) is **out of scope for this
> developer**. The Node.js backend must, however, provide clean
> services/APIs for communicating with the separate AI service developed
> by the AI team member.

------------------------------------------------------------------------

# 1. Project Overview

The project is an AI-powered document screening platform for assisting
authorized personnel in the preliminary verification of identity and
travel documents.

The website provides the user interface for:

-   Uploading documents.
-   Starting a screening.
-   Viewing extracted information.
-   Viewing document validation results.
-   Viewing AI analysis results.
-   Viewing face-verification results.
-   Viewing the overall risk score.
-   Reviewing previous screenings.
-   Viewing dashboard statistics.
-   Maintaining an audit trail.

The application follows this architecture:

``` text
React Frontend
      |
      | REST API
      v
Node.js + Express Backend
      |
      +--------------------+
      |                    |
      v                    v
   MongoDB             AI Service
                         |
                         | Python/FastAPI
                         |
                 OCR / Tampering / Face
                 (implemented by AI team)
```

The MERN developer is responsible for everything up to the AI-service
integration boundary.

------------------------------------------------------------------------

# 2. Responsibility Boundary

## 2.1 MERN Developer Responsibilities

The MERN developer is responsible for:

-   React frontend.
-   UI/UX.
-   Frontend routing.
-   Authentication UI.
-   API integration using Axios.
-   Document upload UI.
-   Node.js/Express backend.
-   API routes.
-   Controllers.
-   Backend services.
-   Database models.
-   MongoDB integration.
-   File-upload handling.
-   Validation/business rules.
-   Risk-score aggregation logic.
-   AI-service communication.
-   Screening workflow orchestration.
-   Screening history.
-   Dashboard statistics.
-   Audit logs.
-   Error handling.
-   Security middleware.
-   API documentation.
-   Integration testing.

## 2.2 AI Team Responsibilities

The AI team is responsible for:

-   OCR model/engine.
-   MRZ extraction/model if applicable.
-   Image preprocessing required specifically for AI inference.
-   Tampering-detection model/algorithm.
-   Photo-replacement detection.
-   Text-manipulation detection.
-   Stamp-forgery analysis.
-   Metadata analysis logic if treated as part of AI analysis.
-   Face detection.
-   Face embedding/comparison.
-   AI model evaluation.
-   AI inference service implementation.

The AI team exposes APIs that the Node backend can consume.

------------------------------------------------------------------------

# 3. Technology Stack

## Frontend

-   React.js
-   JavaScript
-   Axios
-   React Router
-   Tailwind CSS or another UI framework
-   HTML/CSS

## Backend

-   Node.js
-   Express.js
-   Axios
-   MongoDB
-   Mongoose
-   Multer
-   JWT
-   bcrypt/bcryptjs
-   dotenv
-   CORS
-   Helmet
-   Morgan or equivalent logging library

## AI Integration

The Node backend communicates with a separate AI service.

Example:

``` text
Node.js
   |
   | HTTP REST API
   v
Python FastAPI
```

The MERN developer does not implement the internal AI algorithms.

------------------------------------------------------------------------

# 4. Functional Requirements

## FR-01: User Authentication

The website shall provide authentication for authorized users.

### Required features

-   Login.
-   Logout.
-   User registration if required by the team.
-   JWT-based authentication.
-   Protected routes.
-   Role-based authorization.

### User roles

At minimum:

``` text
OFFICER
ADMIN
```

Possible permissions:

  Feature                     Officer   Admin
  ------------------------ ---------- -------
  Login                           Yes     Yes
  Upload document                 Yes     Yes
  Run screening                   Yes     Yes
  View screening result           Yes     Yes
  View screening history          Yes     Yes
  View dashboard                  Yes     Yes
  Manage users                     No     Yes
  View audit logs            Optional     Yes

------------------------------------------------------------------------

# 5. Frontend Requirements

## FR-02: Application Layout

The application shall contain:

``` text
Login
  |
  v
Dashboard
  |
  +---- New Screening
  |
  +---- Screening History
  |
  +---- Screening Details
  |
  +---- Profile
  |
  +---- Admin/User Management (Admin)
```

------------------------------------------------------------------------

## FR-03: Dashboard

The dashboard shall provide an overview of screening activity.

### Statistics

-   Total screenings.
-   Low-risk screenings.
-   Medium-risk screenings.
-   High-risk screenings.
-   Critical-risk screenings.
-   Pending screenings.

### Recent screenings

Display:

-   Screening ID.
-   Date/time.
-   Document type.
-   Status.
-   Risk level.

------------------------------------------------------------------------

# 6. Document Upload

## FR-04: Upload Interface

The user shall be able to upload supported documents.

### Supported types

-   Passport.
-   Visa.
-   National ID.
-   Driving licence.
-   Permit/travel authorization.

### Frontend requirements

-   Drag-and-drop or file-selection interface.
-   File preview.
-   File type validation.
-   File size validation.
-   Upload progress.
-   Remove/reselect file.
-   Submit for screening.

------------------------------------------------------------------------

## FR-05: Multiple Document Support

The UI should allow multiple related documents when required.

Example:

``` text
Passport
+
Visa
+
Presented Face Image
```

This allows the backend to perform cross-document validation and AI
verification.

------------------------------------------------------------------------

# 7. Backend Document Upload

## FR-06: File Upload API

The Node backend shall accept uploaded files using multipart/form-data.

Example:

``` text
POST /api/documents/upload
```

The backend shall:

1.  Authenticate the user.
2.  Validate the file.
3.  Generate a unique document ID.
4.  Store the file temporarily or in configured storage.
5.  Store document metadata.
6.  Return the document ID.

Example response:

``` json
{
  "success": true,
  "documentId": "DOC-123456",
  "fileName": "passport.jpg",
  "documentType": "passport"
}
```

------------------------------------------------------------------------

# 8. Screening Workflow

## FR-07: Create Screening

The backend shall provide:

``` text
POST /api/screenings
```

The endpoint starts a screening process.

Example request:

``` json
{
  "documentIds": [
    "DOC-123456",
    "DOC-123457"
  ],
  "faceImageId": "DOC-123458"
}
```

------------------------------------------------------------------------

## FR-08: Screening Orchestration

The Node backend shall coordinate the screening process.

The backend workflow should be:

``` text
React
  |
  | Upload
  v
Node
  |
  | Save document
  |
  | Send document to AI service
  v
AI Service
  |
  | OCR
  | Tampering
  | Face
  v
AI Result
  |
  v
Node
  |
  | Validation
  | Risk aggregation
  | Save result
  v
MongoDB
  |
  v
React
```

The Node backend acts as the **orchestrator**, not the AI engine.

------------------------------------------------------------------------

# 9. AI Service Integration

## FR-09: AI Service Client

The backend shall contain a dedicated service for AI communication.

Recommended structure:

``` text
backend/
├── controllers/
├── routes/
├── models/
├── services/
│   ├── aiService.js
│   ├── documentService.js
│   ├── screeningService.js
│   ├── validationService.js
│   └── riskService.js
├── middleware/
└── utils/
```

------------------------------------------------------------------------

## FR-10: AI Service Configuration

The AI service URL shall be stored in an environment variable.

Example:

``` env
AI_SERVICE_URL=http://localhost:8000
```

Do not hard-code the AI service URL throughout the application.

------------------------------------------------------------------------

# 10. Expected AI API Contract

The Node backend should consume a documented API contract from the AI
team.

Example endpoint:

``` text
POST /analyze
```

The exact implementation can be changed by the AI team as long as the
agreed response contract is maintained.

Example request concept:

``` text
multipart/form-data
document: <file>
```

Example response:

``` json
{
  "documentType": "passport",
  "ocr": {
    "name": "Test User",
    "passportNumber": "ABC123456",
    "nationality": "IND",
    "dateOfBirth": "1999-08-12",
    "gender": "M",
    "expiryDate": "2030-05-21"
  },
  "tampering": {
    "suspicious": false,
    "confidence": 0.12,
    "flags": []
  },
  "face": {
    "matched": true,
    "similarity": 0.94
  }
}
```

The MERN backend consumes this response and does not need to know how
the AI model produced it.

------------------------------------------------------------------------

# 11. AI Integration Services

The backend should expose separate service functions for clean
separation.

Example:

``` javascript
aiService.analyzeDocument()
aiService.extractOCR()
aiService.detectTampering()
aiService.verifyFace()
```

These functions communicate with the AI team's API.

The MERN developer should **not** put AI logic directly inside Express
routes.

Bad structure:

``` text
route
  -> axios.post(...)
  -> validation
  -> database
  -> risk calculation
```

Preferred:

``` text
Route
  ↓
Controller
  ↓
Screening Service
  ↓
AI Service
  ↓
Validation Service
  ↓
Risk Service
  ↓
Database
```

------------------------------------------------------------------------

# 12. Document Validation

## FR-11: Backend Validation

The Node backend shall perform application-level validation independent
of the AI model.

Examples:

-   Required fields.
-   Date validation.
-   Expiry validation.
-   Basic document-number format.
-   Cross-document comparison.
-   Application-specific rules.

Example:

``` text
Passport DOB
      vs
Visa DOB
```

If they differ:

``` text
DOB_MISMATCH
```

------------------------------------------------------------------------

# 13. Expiry Validation

## FR-12: Document Expiry

The backend shall determine whether a document is:

``` text
VALID
EXPIRING_SOON
EXPIRED
UNKNOWN
```

Example:

``` javascript
{
  expiryStatus: "EXPIRED"
}
```

------------------------------------------------------------------------

# 14. Cross-Document Validation

## FR-13: Cross-Document Checks

The backend shall compare fields returned by OCR.

Examples:

``` text
Passport name ↔ Visa name
Passport number ↔ Visa passport number
Passport DOB ↔ Visa DOB
Nationality ↔ Related document nationality
```

Results should contain explicit flags.

Example:

``` json
{
  "status": "MISMATCH",
  "field": "passportNumber"
}
```

------------------------------------------------------------------------

# 15. Reference/Blacklist Data

## FR-14: Reference Database

The Node backend should support prototype/reference records.

Possible collections:

``` text
referenceDocuments
blacklistRecords
```

Example:

``` text
Passport Number: ABC123456
Status: BLACKLISTED
```

The database used in the prototype is **demo/reference data** unless an
authorized external system is officially integrated.

------------------------------------------------------------------------

# 16. Risk Assessment

## FR-15: Risk Service

The backend shall contain a dedicated risk calculation service.

Example:

``` text
services/
└── riskService.js
```

It receives:

-   Document validation results.
-   OCR/MRZ mismatch results.
-   Cross-document mismatches.
-   AI tampering result.
-   Face verification result.
-   Reference/blacklist result.

It produces:

``` json
{
  "score": 72,
  "level": "HIGH",
  "flags": [
    "POSSIBLE_TAMPERING",
    "FACE_MISMATCH"
  ]
}
```

------------------------------------------------------------------------

## FR-16: Explainable Risk Score

The backend shall store the reasons contributing to the risk score.

Example:

``` json
{
  "score": 82,
  "level": "CRITICAL",
  "factors": [
    {
      "reason": "Possible document tampering",
      "weight": 30
    },
    {
      "reason": "Face mismatch",
      "weight": 30
    },
    {
      "reason": "Document expired",
      "weight": 25
    }
  ]
}
```

Risk weights should be configurable rather than scattered across
controllers.

------------------------------------------------------------------------

# 17. Screening Status

Each screening should have a status.

Recommended states:

``` text
UPLOADED
PROCESSING
COMPLETED
FAILED
REVIEW_REQUIRED
```

Example:

``` text
POST /api/screenings

Response:
{
  "screeningId": "SCR-001",
  "status": "PROCESSING"
}
```

The frontend can then request:

``` text
GET /api/screenings/SCR-001
```

to obtain the result.

------------------------------------------------------------------------

# 18. MongoDB Requirements

## FR-17: User Model

Example fields:

``` text
_id
name
email
passwordHash
role
createdAt
updatedAt
```

------------------------------------------------------------------------

## FR-18: Document Model

Example:

``` text
_id
documentId
originalFileName
documentType
filePath/storageReference
mimeType
fileSize
uploadedBy
createdAt
```

Do not store raw sensitive document information unnecessarily.

------------------------------------------------------------------------

## FR-19: Screening Model

Example:

``` text
_id
screeningId
userId
documentIds
status
documentType
ocrResult
validationResult
tamperingResult
faceResult
riskResult
createdAt
completedAt
```

------------------------------------------------------------------------

## FR-20: Audit Log Model

Example:

``` text
_id
screeningId
userId
action
status
metadata
timestamp
```

Examples:

``` text
DOCUMENT_UPLOADED
OCR_REQUESTED
AI_ANALYSIS_COMPLETED
VALIDATION_COMPLETED
RISK_SCORE_GENERATED
SCREENING_COMPLETED
```

------------------------------------------------------------------------

# 19. API Requirements

## Authentication

``` text
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
POST /api/auth/logout
```

## Documents

``` text
POST /api/documents/upload
GET  /api/documents/:id
DELETE /api/documents/:id
```

## Screening

``` text
POST /api/screenings
GET  /api/screenings
GET  /api/screenings/:id
```

## Dashboard

``` text
GET /api/dashboard/stats
```

## Users

``` text
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

Admin-only where applicable.

------------------------------------------------------------------------

# 20. Frontend API Service

The frontend shall communicate with the Node backend through a
centralized Axios instance.

Example:

``` text
src/
└── services/
    └── api.js
```

Recommended:

``` javascript
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export default API;
```

Additional API functions:

``` javascript
uploadDocument()
createScreening()
getScreening()
getScreenings()
getDashboardStats()
login()
```

The React components should not repeatedly hard-code API URLs.

------------------------------------------------------------------------

# 21. Frontend Pages

Minimum pages:

``` text
/login
/dashboard
/screening/new
/screening/:id
/screenings
/profile
```

Admin:

``` text
/admin/users
/admin/audit-logs
```

------------------------------------------------------------------------

# 22. New Screening Page

The page should contain:

1.  Document type selection.
2.  Document upload.
3.  Optional additional document upload.
4.  Optional presented-face image upload.
5.  Preview.
6.  Submit button.
7.  Processing status.

Example:

``` text
--------------------------------
     NEW DOCUMENT SCREENING
--------------------------------

Document Type:
[ Passport ▼ ]

Upload Passport:
[ Choose File ]

Passport Preview:
[ Image ]

Presented Face:
[ Choose File ]

[ Start Screening ]
--------------------------------
```

------------------------------------------------------------------------

# 23. Screening Result Page

The result page should clearly separate:

## Document Information

``` text
Name
Passport Number
Nationality
DOB
Expiry
```

## Validation

``` text
Document Format       ✓
Expiry Status         ✓
Cross-document Check  ✓
Reference Check       ✓
```

## AI Results

``` text
Tampering Detection
Face Verification
OCR Confidence
```

## Risk

``` text
Risk Score: 72/100
Risk Level: HIGH
```

## Reasons

``` text
- Possible document tampering
- Face similarity below configured threshold
```

------------------------------------------------------------------------

# 24. Screening History

## FR-21: History

Users shall be able to:

-   View previous screenings.
-   Search by screening ID.
-   Filter by status.
-   Filter by risk level.
-   Filter by document type.
-   Sort by date.
-   Open screening details.

Example table:

``` text
ID       TYPE       STATUS      RISK       DATE
SCR001   Passport   COMPLETED   LOW        07/09/2026
SCR002   Visa       COMPLETED   HIGH       07/09/2026
SCR003   Passport   PROCESSING  --         07/09/2026
```

------------------------------------------------------------------------

# 25. Dashboard Statistics

The backend shall calculate statistics from MongoDB.

Example:

``` json
{
  "total": 1250,
  "low": 980,
  "medium": 190,
  "high": 60,
  "critical": 20,
  "pending": 10
}
```

The frontend visualizes these values.

------------------------------------------------------------------------

# 26. Audit Trail

The backend shall create audit records for important events.

Example:

``` text
User logged in
Document uploaded
Screening started
AI analysis requested
AI analysis completed
Validation completed
Risk score generated
Screening completed
```

The audit trail should not expose unnecessary sensitive document
contents.

------------------------------------------------------------------------

# 27. Error Handling

The backend shall use centralized error handling.

Examples:

``` text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
413 Payload Too Large
422 Validation Error
500 Internal Server Error
503 AI Service Unavailable
```

Example AI-service failure:

``` json
{
  "success": false,
  "message": "AI analysis service unavailable",
  "code": "AI_SERVICE_UNAVAILABLE"
}
```

The Node server should not crash when the AI service is unavailable.

------------------------------------------------------------------------

# 28. AI Service Failure Strategy

If the AI service fails:

``` text
React
  ↓
Node
  ↓
AI Service
  X
  ↓
AI unavailable
```

Node should:

1.  Catch the error.
2.  Log the technical error.
3.  Mark screening as `FAILED` or `REVIEW_REQUIRED`.
4.  Return a safe message to the frontend.
5.  Avoid exposing internal stack traces.

------------------------------------------------------------------------

# 29. Security Requirements

## Authentication

-   Passwords must be hashed.
-   JWT/session secrets must be stored in environment variables.
-   Protected APIs require authentication.
-   Admin APIs require appropriate authorization.

## File Security

-   Validate MIME type.
-   Validate extension.
-   Limit file size.
-   Generate safe server-side filenames.
-   Never trust user-supplied filenames.
-   Prevent arbitrary file execution.
-   Do not expose private upload directories directly.

## API Security

-   Use CORS appropriately.
-   Use Helmet.
-   Validate request bodies.
-   Rate-limit authentication endpoints.
-   Do not expose stack traces in production.

------------------------------------------------------------------------

# 30. Environment Variables

Example backend `.env`:

``` env
PORT=5000

MONGO_URI=mongodb://localhost:27017/document-screening

JWT_SECRET=your_secret_here

AI_SERVICE_URL=http://localhost:8000

CLIENT_URL=http://localhost:5173

UPLOAD_DIR=uploads
```

The `.env` file must not be committed to Git.

------------------------------------------------------------------------

# 31. Recommended Backend Structure

``` text
backend/
│
├── app.js
├── package.json
├── .env
├── .gitignore
│
├── config/
│   └── db.js
│
├── models/
│   ├── User.js
│   ├── Document.js
│   ├── Screening.js
│   └── AuditLog.js
│
├── routes/
│   ├── authRoutes.js
│   ├── documentRoutes.js
│   ├── screeningRoutes.js
│   ├── dashboardRoutes.js
│   └── userRoutes.js
│
├── controllers/
│   ├── authController.js
│   ├── documentController.js
│   ├── screeningController.js
│   └── dashboardController.js
│
├── services/
│   ├── aiService.js
│   ├── documentService.js
│   ├── screeningService.js
│   ├── validationService.js
│   └── riskService.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── uploadMiddleware.js
│   └── errorMiddleware.js
│
└── utils/
    ├── logger.js
    └── helpers.js
```

------------------------------------------------------------------------

# 32. Recommended Frontend Structure

``` text
frontend/
│
├── src/
│
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── FileUpload.jsx
│   ├── RiskBadge.jsx
│   └── Loading.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── NewScreening.jsx
│   ├── ScreeningDetails.jsx
│   ├── ScreeningHistory.jsx
│   └── Profile.jsx
│
├── services/
│   └── api.js
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│
├── utils/
│
├── App.jsx
└── main.jsx
```

------------------------------------------------------------------------

# 33. Backend Service Responsibilities

## `aiService.js`

Responsible only for communication with the AI service.

``` text
sendDocumentToAI()
analyzeDocument()
verifyFace()
```

It should not contain React/UI logic.

## `documentService.js`

Responsible for:

-   File handling.
-   Document metadata.
-   Storage references.
-   Document retrieval.

## `validationService.js`

Responsible for:

-   Expiry validation.
-   Field validation.
-   Cross-document validation.
-   Reference checks.

## `riskService.js`

Responsible for:

-   Combining screening signals.
-   Calculating score.
-   Assigning risk level.
-   Generating risk explanations.

## `screeningService.js`

Responsible for orchestrating the complete workflow.

``` text
Create Screening
       ↓
Load Documents
       ↓
Call AI Service
       ↓
Validate Results
       ↓
Calculate Risk
       ↓
Save Screening
       ↓
Create Audit Log
```

------------------------------------------------------------------------

# 34. AI Contract Between Team Members

The AI and MERN developers must agree on an API contract before
integration.

At minimum define:

### Request

``` text
Endpoint
HTTP method
Authentication
Content-Type
File fields
Additional parameters
```

### Response

``` text
OCR schema
Tampering schema
Face schema
Error schema
Confidence fields
Processing status
```

### Example contract

``` json
{
  "success": true,
  "documentType": "passport",
  "ocr": {
    "name": "Test User",
    "passportNumber": "ABC123456",
    "dateOfBirth": "1999-08-12",
    "nationality": "IND",
    "expiryDate": "2030-05-21"
  },
  "tampering": {
    "suspicious": false,
    "confidence": 0.12,
    "flags": []
  },
  "face": {
    "matched": true,
    "similarity": 0.94
  }
}
```

This allows both team members to work independently.

------------------------------------------------------------------------

# 35. Development Phases for the MERN Developer

## Phase 1 --- Project Setup

-   React application.
-   Express backend.
-   MongoDB connection.
-   Environment variables.
-   Git setup.
-   Folder structure.

## Phase 2 --- Frontend ↔ Backend

Establish:

``` text
React :5173
     ↓
Node :5000
```

Create:

``` text
GET /api/test
```

------------------------------------------------------------------------

## Phase 3 --- Backend ↔ AI Service

Establish:

``` text
Node :5000
     ↓
FastAPI :8000
```

Use a temporary AI response first.

Example:

``` text
POST /api/test-ai
       ↓
POST /analyze
```

------------------------------------------------------------------------

## Phase 4 --- Authentication

Implement:

-   User model.
-   Register/login.
-   Password hashing.
-   JWT.
-   Protected routes.
-   Roles.

------------------------------------------------------------------------

## Phase 5 --- Document Upload

Implement:

``` text
React
 ↓
Node
 ↓
File storage
 ↓
MongoDB metadata
```

------------------------------------------------------------------------

## Phase 6 --- AI Integration

Replace the temporary response with the AI team's API.

``` text
React
 ↓
Node
 ↓
AI Service
 ↓
Node
```

------------------------------------------------------------------------

## Phase 7 --- Validation

Implement:

-   Expiry checks.
-   Format checks.
-   Cross-document checks.
-   Reference/blacklist checks.

------------------------------------------------------------------------

## Phase 8 --- Risk Engine

Combine:

``` text
Validation
+
Tampering result
+
Face result
+
Reference result
```

into:

``` text
Risk Score
Risk Level
Risk Factors
```

------------------------------------------------------------------------

## Phase 9 --- Database Persistence

Store:

-   Documents.
-   Screenings.
-   AI results.
-   Validation results.
-   Risk results.
-   Audit logs.

------------------------------------------------------------------------

## Phase 10 --- Dashboard

Build:

-   Statistics.
-   Recent screenings.
-   Risk distribution.
-   History.

------------------------------------------------------------------------

## Phase 11 --- Testing

Test the complete flow:

``` text
Login
 ↓
Upload
 ↓
Create Screening
 ↓
AI Processing
 ↓
Validation
 ↓
Risk Score
 ↓
Save
 ↓
Display Result
```

------------------------------------------------------------------------

# 36. MVP Scope for the MERN Developer

The first demo should successfully perform:

``` text
1. Login
2. Upload passport image
3. Create screening
4. Send image to AI service
5. Receive AI result
6. Perform backend validation
7. Calculate risk score
8. Save result in MongoDB
9. Display result
10. Show screening history
```

The AI teammate supplies the actual AI result.

For the initial integration, a mock AI response can be used:

``` text
Node
 ↓
Mock AI Service
 ↓
JSON
```

Later:

``` text
Node
 ↓
Real AI Service
 ↓
JSON
```

This allows the MERN development to continue without waiting for the AI
model to be completed.

------------------------------------------------------------------------

# 37. Definition of Done

The MERN portion is considered complete when:

-   Users can authenticate.
-   Authorized users can upload supported documents.
-   Documents are securely handled.
-   A screening can be created.
-   Node can communicate with the AI service.
-   AI results can be consumed through a defined contract.
-   Backend validation works.
-   Risk score is generated.
-   Screening data is stored in MongoDB.
-   Results are displayed clearly in React.
-   Screening history works.
-   Dashboard statistics work.
-   Audit logs are generated.
-   AI-service failures are handled gracefully.
-   Protected APIs and role-based permissions work.
-   The complete demo flow works end-to-end.

------------------------------------------------------------------------

# 38. Important Scope Limitation

The MERN developer does **not** need to implement:

-   OCR algorithms.
-   Computer-vision models.
-   Tampering-detection algorithms.
-   Face-recognition algorithms.
-   Model training.
-   Dataset creation for AI models.
-   AI model evaluation.

Instead, the MERN backend provides a stable integration layer:

``` text
                MERN RESPONSIBILITY
                       |
React → Express → Services → AI API
                       |
                       v
                    MongoDB


                AI TEAM RESPONSIBILITY
                       |
                 FastAPI Service
                       |
             ┌─────────┼─────────┐
             ↓         ↓         ↓
            OCR    Tampering    Face
```

The key objective is to keep the boundary between the two parts clean:
**the AI team owns inference; the MERN team owns the product, business
workflow, persistence, security, and integration.**
