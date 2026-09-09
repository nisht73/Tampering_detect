# AI Document Screening System --- Web/MERN Requirements

## 1. Project Overview

The **AI Document Screening System** is a web-based application for
uploading identity/document images and obtaining an automated screening
result from an AI-powered backend service.

This document defines the requirements for the **Web/MERN development
portion** of the project.

The frontend and MERN backend will provide the complete user-facing
workflow, authentication, document upload, screening-job management,
result presentation, history, and integration points for the AI service.

> **Scope note:** The AI/ML models themselves are not part of the
> frontend/MERN developer's implementation. The MERN application must
> expose and consume well-defined APIs so that an independently
> developed AI service can perform OCR, document detection,
> tampering/image-forensics analysis, and related AI processing.

------------------------------------------------------------------------

# 2. Objectives

The web application should:

-   Provide a clean and professional dashboard for document screening.
-   Allow authenticated users to upload document images.
-   Support drag-and-drop and normal file selection.
-   Validate uploaded files before submission.
-   Send screening requests to the MERN backend.
-   Allow the backend to communicate with the AI service.
-   Display screening progress and processing status.
-   Display AI-generated screening results in an understandable format.
-   Maintain a history of previous screening requests.
-   Allow users to inspect individual screening reports.
-   Provide suitable error, loading, and empty states.
-   Protect authenticated routes and user data.
-   Provide an admin-oriented interface for managing/viewing screening
    activity where required.

------------------------------------------------------------------------

# 3. Scope

## 3.1 In Scope

### Frontend

-   React-based responsive web application.
-   Authentication pages.
-   Dashboard.
-   New Screening page.
-   Document upload interface.
-   Image preview.
-   Upload validation.
-   Screening progress UI.
-   Screening result page.
-   Screening history.
-   Screening detail/report page.
-   Admin dashboard/interface.
-   Error and loading states.
-   Responsive design for desktop, tablet, and mobile.

### MERN Backend

-   Node.js + Express API.
-   MongoDB database.
-   Authentication and authorization.
-   User management.
-   Screening request management.
-   File upload handling.
-   Screening status management.
-   AI-service integration layer.
-   Result persistence.
-   Screening history APIs.
-   Report/result APIs.
-   Input validation and error handling.

### AI Service Integration

The MERN backend should provide an integration layer for an external AI
service.

The AI service may perform:

-   Document detection/separation.
-   PAN/Aadhaar or other supported document identification.
-   OCR.
-   Image-forensics analysis.
-   Tampering detection.
-   Confidence scoring.
-   Document verification.
-   Final AI screening classification.

The MERN developer is responsible for the **API contract and
integration**, not for implementing the AI/ML algorithms.

------------------------------------------------------------------------

# 4. User Roles

## 4.1 User

A normal authenticated user should be able to:

-   Log in.
-   Access the dashboard.
-   Create a new screening.
-   Upload a document image.
-   View screening progress.
-   View screening results.
-   View previous screening requests.
-   Open individual screening reports.
-   Log out.

## 4.2 Admin

An admin should be able to:

-   Log in through the same authentication system or an admin-specific
    flow.
-   View overall screening statistics.
-   View screening requests.
-   Search/filter screening records.
-   View screening details and reports.
-   View user activity where permitted.
-   Monitor failed/processing screening jobs.

Admin permissions must be enforced by the backend and must not rely only
on frontend route protection.

------------------------------------------------------------------------

# 5. Technology Requirements

## 5.1 Frontend

Recommended stack:

-   React
-   Vite
-   React Router
-   Tailwind CSS
-   shadcn/ui
-   Lucide React
-   React Dropzone
-   Axios
-   React Hook Form
-   Zod
-   Framer Motion

## 5.2 Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT-based authentication
-   bcrypt/bcryptjs for password hashing
-   Multer or equivalent multipart upload middleware
-   Axios/fetch for AI-service communication
-   Zod/Joi/express-validator for request validation

## 5.3 Development Tools

-   Git
-   GitHub
-   Postman or equivalent API testing tool
-   ESLint
-   Prettier
-   `.env` environment configuration

------------------------------------------------------------------------

# 6. Frontend Requirements

## 6.1 Application Layout

The application should use a consistent dashboard layout.

Recommended navigation:

``` text
Dashboard
New Screening
Screening History
Reports
Settings
Logout
```

Admin users may additionally have:

``` text
Admin Dashboard
Users
All Screenings
System Monitoring
```

------------------------------------------------------------------------

# 7. Dashboard

The dashboard should provide a quick overview of screening activity.

## Required information

Display cards such as:

-   Total screenings.
-   Completed screenings.
-   Processing screenings.
-   Failed screenings.
-   Potentially tampered documents.

Example:

``` text
Total Screenings     Completed       Processing       Flagged
      128                96               8              24
```

The dashboard may also contain:

-   Recent screening requests.
-   Recent screening status.
-   Quick action: `New Screening`.
-   Screening-result summary chart.

Charts can be implemented using Recharts if required.

------------------------------------------------------------------------

# 8. New Screening Page

The New Screening page is the primary user workflow.

## UI Requirements

The page should contain:

### Header

``` text
New Document Screening

Upload documents for AI tampering detection and verification.
```

### Upload section

The upload component should support:

-   Click-to-upload.
-   Drag-and-drop.
-   Image preview.
-   File name display.
-   File size display.
-   Remove file.
-   Replace file.
-   Upload progress where applicable.

Supported formats:

-   JPG
-   JPEG
-   PNG

Maximum file size:

``` text
10 MB
```

The exact maximum size should be configurable through
environment/backend configuration if possible.

------------------------------------------------------------------------

# 9. Upload Validation

The frontend should validate:

-   File exists.
-   File type is supported.
-   File size is within the configured limit.
-   Maximum number of files is respected.
-   Image can be previewed.

The backend must repeat validation because frontend validation alone
cannot be trusted.

Example error messages:

``` text
Please upload a document image.

Unsupported file format.
Supported formats: JPG, JPEG, PNG.

File size exceeds the 10 MB limit.

Unable to process this image.
Please upload a clearer document.
```

------------------------------------------------------------------------

# 10. Screening Workflow

The expected workflow is:

``` text
User
  ↓
Upload document
  ↓
Frontend validation
  ↓
MERN API
  ↓
Store screening request
  ↓
Send document to AI Service
  ↓
AI processing
  ↓
Receive AI result
  ↓
Store result in MongoDB
  ↓
Frontend retrieves status/result
  ↓
Display screening report
```

The frontend should not directly depend on the internal implementation
of the AI model.

------------------------------------------------------------------------

# 11. Screening Status

Each screening should have a status.

Recommended statuses:

``` text
UPLOADED
QUEUED
PROCESSING
COMPLETED
FAILED
```

Optional statuses:

``` text
CANCELLED
REVIEW_REQUIRED
```

The UI should visually distinguish each state.

Example:

``` text
Processing     → Blue/neutral indicator
Completed      → Green indicator
Failed         → Red indicator
Review Required → Warning indicator
```

------------------------------------------------------------------------

# 12. Screening Progress UI

During processing, the frontend should provide feedback instead of
appearing frozen.

Example:

``` text
Document uploaded                  ✓
Document detection                 ✓
OCR analysis                       ✓
Tampering analysis                 ●
Generating report                  ○
```

The exact AI stages depend on the AI service API.

If the AI service does not expose individual stages, the frontend should
display a generic processing state:

``` text
Analyzing document...

Please wait while the screening service processes your document.
```

------------------------------------------------------------------------

# 13. Screening Result Page

After processing, the user should see a structured report.

## Result summary

Example:

``` text
Screening Result

Status: Potentially Tampered

Confidence: 92%

Documents Detected: 2

OCR: Completed
Image Analysis: Completed
Verification: Completed
```

The result page should clearly communicate whether the document appears:

-   Authentic / Verified
-   Potentially Tampered
-   Suspicious
-   Unable to Verify
-   Processing Failed

The exact classification values must be configurable according to the AI
team's API contract.

------------------------------------------------------------------------

# 14. Document-Level Results

If a single uploaded image contains multiple documents, the UI should
support displaying results for each detected document.

Example:

``` text
Document 1
PAN Card
Status: Verified
Confidence: 96%

Document 2
Aadhaar Card
Status: Potentially Tampered
Confidence: 88%
```

Each document may display:

-   Document type.
-   Detection confidence.
-   OCR status.
-   OCR extracted fields where permitted.
-   Tampering score.
-   Verification status.
-   AI explanation/reason.
-   Document preview.

------------------------------------------------------------------------

# 15. OCR Result Display

If the AI service returns OCR information, the frontend should display
it in a structured manner.

Example:

``` text
Extracted Information

Name       John Doe
Document   PAN
PAN        XXXXX1234X
DOB        XX/XX/XXXX
```

Sensitive information should be masked when appropriate.

Example:

``` text
XXXX XXXX 1234
```

The frontend must not expose sensitive document information
unnecessarily.

------------------------------------------------------------------------

# 16. AI Result Explanation

Where the AI service provides explanation data, the frontend should
present it clearly.

Example:

``` text
Why this document was flagged

• Inconsistent image compression detected.
• Possible modification around document text.
• Metadata differs from expected characteristics.
```

The frontend should display AI-provided explanations as returned by the
backend and should not invent its own forensic conclusions.

------------------------------------------------------------------------

# 17. Screening History

Users should have a history page showing previous screening requests.

Recommended table:

  Date          Screening ID     Documents Status       Result     Action
  ------------- -------------- ----------- ------------ ---------- --------
  08 Sep 2026   SCR-1024                 2 Completed    Verified   View
  08 Sep 2026   SCR-1023                 1 Processing   ---        View
  07 Sep 2026   SCR-1022                 2 Completed    Flagged    View

Required features:

-   Pagination.
-   Search by screening ID.
-   Filter by status.
-   Filter by result.
-   Sort by date.
-   View screening details.

------------------------------------------------------------------------

# 18. Screening Detail Page

Each screening should have a unique detail page.

Example route:

``` text
/screenings/:screeningId
```

The page should contain:

-   Screening metadata.
-   Uploaded image/document preview.
-   Processing status.
-   AI result.
-   Document-level results.
-   OCR information.
-   Confidence scores.
-   Explanation.
-   Created timestamp.
-   Completed timestamp.

------------------------------------------------------------------------

# 19. Authentication

The application should provide:

-   Login.
-   Logout.
-   Persistent authentication.
-   Protected routes.
-   Role-based authorization.
-   Session/token expiration handling.

Recommended authentication flow:

``` text
Login
  ↓
POST /api/auth/login
  ↓
Backend validates credentials
  ↓
JWT/token returned
  ↓
Frontend stores authentication state
  ↓
Protected application routes become available
```

Passwords must never be stored as plain text.

------------------------------------------------------------------------

# 20. Backend API Requirements

Recommended API structure:

``` text
/api/auth
/api/users
/api/screenings
/api/reports
/api/admin
/api/health
```

------------------------------------------------------------------------

# 21. Authentication APIs

### Login

``` http
POST /api/auth/login
```

Request:

``` json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response should contain:

``` json
{
  "success": true,
  "token": "...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "user"
  }
}
```

### Current user

``` http
GET /api/auth/me
```

### Logout

``` http
POST /api/auth/logout
```

Implementation may use stateless JWT or secure cookie-based
authentication depending on the final architecture.

------------------------------------------------------------------------

# 22. Screening APIs

### Create screening

``` http
POST /api/screenings
```

Content type:

``` text
multipart/form-data
```

Input:

``` text
document: image file
```

Response:

``` json
{
  "success": true,
  "screening": {
    "id": "...",
    "status": "QUEUED"
  }
}
```

### Get screening status

``` http
GET /api/screenings/:id/status
```

Example:

``` json
{
  "success": true,
  "status": "PROCESSING"
}
```

### Get screening result

``` http
GET /api/screenings/:id
```

### Get screening history

``` http
GET /api/screenings
```

Supported query parameters:

``` text
page
limit
status
result
search
sort
```

------------------------------------------------------------------------

# 23. AI Service API Contract

The backend should isolate AI integration inside a dedicated
service/module.

Example:

``` text
server/
└── src/
    └── services/
        └── ai/
            ├── ai.service.js
            ├── ai.client.js
            └── ai.mapper.js
```

The MERN backend should communicate with the AI service using an
environment variable such as:

``` env
AI_SERVICE_URL=http://localhost:8000
```

The actual AI endpoint should be decided jointly with the AI team.

Example request:

``` http
POST /analyze
Content-Type: multipart/form-data
```

Example response:

``` json
{
  "status": "completed",
  "overallResult": "potentially_tampered",
  "confidence": 0.92,
  "documents": [
    {
      "type": "PAN",
      "result": "verified",
      "confidence": 0.96
    },
    {
      "type": "AADHAAR",
      "result": "potentially_tampered",
      "confidence": 0.88
    }
  ]
}
```

The exact response schema must be finalized with the AI team.

------------------------------------------------------------------------

# 24. Database Requirements

MongoDB should store application metadata and screening results.

The original uploaded document should preferably be stored in dedicated
object/file storage rather than directly inside MongoDB.

## User collection

Suggested fields:

``` text
_id
name
email
passwordHash
role
createdAt
updatedAt
```

## Screening collection

Suggested fields:

``` text
_id
screeningId
userId
fileUrl
originalFileName
fileSize
status
overallResult
confidence
documents
aiRequestId
error
createdAt
updatedAt
completedAt
```

## Document result

Suggested structure:

``` text
documentType
documentImageUrl
ocrResult
tamperingResult
verificationResult
confidence
explanation
```

The final schema should be adjusted according to the AI service
response.

------------------------------------------------------------------------

# 25. File Storage

The application should not unnecessarily store large binary files
directly in MongoDB.

Preferred architecture:

``` text
React
  ↓
Express
  ↓
File Storage
  ↓
Store URL/reference in MongoDB
```

Possible storage options:

-   Cloudinary
-   AWS S3
-   Azure Blob Storage
-   Google Cloud Storage
-   Local filesystem for prototype/development

For a prototype, local storage is acceptable if the deployment
environment supports persistent storage.

------------------------------------------------------------------------

# 26. Admin Dashboard

The admin dashboard should provide:

### Statistics

``` text
Total Users
Total Screenings
Completed
Processing
Failed
Flagged
```

### Screening management

Admin should be able to:

-   View all screenings.
-   Search screenings.
-   Filter by status.
-   Filter by result.
-   Open screening reports.
-   Identify failed AI requests.

Optional:

-   User management.
-   Export reports.
-   Delete records.
-   Re-run failed screening.

------------------------------------------------------------------------

# 27. UI/UX Requirements

The UI should follow a modern SaaS/dashboard design.

Recommended design system:

``` text
React
Tailwind CSS
shadcn/ui
Lucide React
```

## Design characteristics

-   Clean white cards.
-   Subtle borders.
-   Rounded corners.
-   Consistent spacing.
-   Clear typography hierarchy.
-   Accessible contrast.
-   Limited use of accent colors.
-   Clear success/warning/error states.
-   Responsive layout.

------------------------------------------------------------------------

# 28. Upload Component UX

The upload area should visually communicate:

``` text
Upload your document

Drag & drop your image here
or
Browse files

PNG, JPG, JPEG
Maximum 10 MB
```

On drag:

``` text
Drop your document here
```

After upload:

``` text
document.jpg
2.4 MB

✓ Ready for screening

[Change file] [Remove]
```

------------------------------------------------------------------------

# 29. Loading States

Every API operation that can take noticeable time should have a loading
state.

Examples:

``` text
Loading dashboard...
Loading screening history...
Uploading document...
Analyzing document...
Generating report...
```

Use skeleton loaders where appropriate instead of blank screens.

------------------------------------------------------------------------

# 30. Error Handling

The frontend should gracefully handle:

-   Network errors.
-   Authentication errors.
-   Invalid files.
-   Upload failures.
-   AI-service failures.
-   Backend errors.
-   Timeout errors.
-   Missing screening records.
-   Expired sessions.

Example:

``` text
Unable to complete screening.

The AI service is currently unavailable.
Please try again later.
```

Do not expose raw stack traces or internal server errors to users.

------------------------------------------------------------------------

# 31. Notifications

Use toast notifications for short-lived events.

Recommended library:

``` text
Sonner
```

Examples:

``` text
Document uploaded successfully.

Screening started.

Screening completed.

Failed to upload document.

Session expired. Please log in again.
```

------------------------------------------------------------------------

# 32. Responsive Design

The application must work on:

-   Desktop.
-   Laptop.
-   Tablet.
-   Mobile.

The dashboard should collapse appropriately on smaller screens.

The upload component should remain usable with touch input.

Tables should support horizontal scrolling or switch to card-based
layouts on mobile.

------------------------------------------------------------------------

# 33. Security Requirements

The application should:

-   Hash passwords.
-   Validate all user input.
-   Validate uploaded files on the backend.
-   Restrict file types.
-   Restrict file size.
-   Protect authenticated API endpoints.
-   Enforce role-based authorization.
-   Prevent unauthorized access to another user's screening.
-   Avoid exposing sensitive document information.
-   Store secrets only in environment variables.
-   Configure CORS appropriately.
-   Use HTTPS in production.
-   Implement rate limiting where appropriate.
-   Sanitize/validate external AI-service responses.

------------------------------------------------------------------------

# 34. Environment Variables

Example frontend:

``` env
VITE_API_URL=http://localhost:5000/api
```

Example backend:

``` env
PORT=5000
MONGO_URI=mongodb://localhost:27017/document-screening
JWT_SECRET=your_secret
AI_SERVICE_URL=http://localhost:8000
UPLOAD_MAX_SIZE=10485760
```

Production secrets must not be committed to Git.

Provide:

``` text
.env.example
```

instead of committing `.env`.

------------------------------------------------------------------------

# 35. Suggested Project Structure

## Frontend

``` text
client/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── upload/
│   │   ├── screening/
│   │   └── dashboard/
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── NewScreening.jsx
│   │   ├── ScreeningHistory.jsx
│   │   ├── ScreeningDetails.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── hooks/
│   │
│   ├── context/
│   │
│   ├── routes/
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

## Backend

``` text
server/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   │   └── ai/
│   ├── utils/
│   ├── config/
│   └── app.js
│
├── uploads/
├── package.json
└── server.js
```

------------------------------------------------------------------------

# 36. API Error Format

All backend APIs should preferably return a consistent format.

Success:

``` json
{
  "success": true,
  "data": {}
}
```

Error:

``` json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE",
    "message": "Unsupported file format."
  }
}
```

This makes frontend API handling easier.

------------------------------------------------------------------------

# 37. Frontend State Management

For the prototype, React Context and local component state may be
sufficient.

Use state for:

-   Authentication.
-   Current user.
-   Uploaded file.
-   Screening status.
-   Screening result.
-   Filters.
-   UI state.

A global state library such as Redux Toolkit should only be introduced
if application complexity requires it.

------------------------------------------------------------------------

# 38. Testing Requirements

## Frontend

Test:

-   Login.
-   Protected routes.
-   File validation.
-   Drag-and-drop upload.
-   File preview.
-   Start screening.
-   Loading state.
-   Result rendering.
-   History filtering.
-   Error states.

## Backend

Test:

-   Authentication.
-   Authorization.
-   File validation.
-   Screening creation.
-   Screening retrieval.
-   User-specific screening access.
-   AI-service integration.
-   Error handling.

Recommended tools:

``` text
Vitest / Jest
React Testing Library
Supertest
Postman
```

------------------------------------------------------------------------

# 39. Development Phases

## Phase 1 --- UI Foundation

-   Setup React + Vite.
-   Setup Tailwind.
-   Setup shadcn/ui.
-   Create dashboard layout.
-   Create navigation.
-   Create authentication UI.
-   Create responsive design system.

## Phase 2 --- New Screening

-   Build upload component.
-   Add drag-and-drop.
-   Add validation.
-   Add image preview.
-   Add file removal/replacement.
-   Add screening button.

## Phase 3 --- MERN Backend

-   Setup Express.
-   Setup MongoDB.
-   Create User model.
-   Create Screening model.
-   Implement authentication.
-   Implement screening APIs.
-   Implement file upload.

## Phase 4 --- AI Integration

-   Finalize API contract with AI team.
-   Create AI client/service.
-   Send uploaded document to AI service.
-   Receive AI result.
-   Store result.
-   Handle AI failures/timeouts.

## Phase 5 --- Results

-   Create screening progress UI.
-   Create result page.
-   Display confidence.
-   Display document-level results.
-   Display OCR data.
-   Display AI explanation.

## Phase 6 --- History/Admin

-   Screening history.
-   Search/filter/pagination.
-   Screening details.
-   Admin dashboard.
-   Statistics.

## Phase 7 --- Polish

-   Loading skeletons.
-   Toast notifications.
-   Animations.
-   Accessibility.
-   Responsive testing.
-   Error handling.
-   Security review.
-   Production deployment.

------------------------------------------------------------------------

# 40. Definition of Done

The web/MERN portion is considered complete when:

-   [ ] User can authenticate.
-   [ ] User can access a protected dashboard.
-   [ ] User can upload a supported document image.
-   [ ] Drag-and-drop works.
-   [ ] File validation works on frontend and backend.
-   [ ] Uploaded document can be sent to the backend.
-   [ ] Backend can create a screening record.
-   [ ] Backend can communicate with the AI service.
-   [ ] AI results can be stored in MongoDB.
-   [ ] User can see processing status.
-   [ ] User can view the final screening result.
-   [ ] User can view previous screenings.
-   [ ] User cannot access another user's screening.
-   [ ] Admin can view screening activity.
-   [ ] Errors are handled gracefully.
-   [ ] Application is responsive.
-   [ ] Sensitive configuration is stored in environment variables.
-   [ ] README contains setup instructions.
-   [ ] `.env.example` is provided.
-   [ ] API documentation is available.
-   [ ] Basic frontend/backend tests pass.

------------------------------------------------------------------------

# 41. Team Responsibility Boundary

This project may be divided into separate **Web/MERN** and **AI/ML**
responsibilities.

## Web/MERN Team

Responsible for:

-   React frontend.
-   UI/UX.
-   Authentication.
-   Dashboard.
-   File upload.
-   Backend APIs.
-   MongoDB.
-   Screening records.
-   AI service integration.
-   Result storage.
-   Result presentation.
-   Admin interface.
-   API documentation.
-   Deployment of web/backend services.

## AI/ML Team

Responsible for:

-   Document detection.
-   Document separation.
-   OCR.
-   PAN/Aadhaar detection/classification.
-   Image-forensics analysis.
-   Tampering detection.
-   AI confidence scores.
-   AI classification.
-   AI processing pipeline.
-   AI service API.

## Shared Responsibility

Both teams must agree on:

-   AI API URL.
-   Request format.
-   Response format.
-   Authentication between services if required.
-   Error response format.
-   Processing status.
-   Timeout behavior.
-   Confidence-score format.
-   Result classifications.

------------------------------------------------------------------------

# 42. Minimum Viable Prototype

For a short-duration prototype, the minimum implementation should be:

``` text
Login
  ↓
Dashboard
  ↓
New Screening
  ↓
Upload Image
  ↓
Backend
  ↓
AI Service
  ↓
Screening Result
  ↓
Screening History
```

The MVP should prioritize a **complete working flow** over implementing
a large number of secondary features.

The recommended MVP pages are:

``` text
/login
/dashboard
/screenings/new
/screenings/:id
/screenings/history
/admin
```

------------------------------------------------------------------------

# 43. Recommended UI Component Set

For the React implementation, use reusable components instead of
building every UI element separately.

``` text
AppLayout
Sidebar
Navbar
PageHeader
StatCard
UploadDropzone
FilePreview
ScreeningProgress
StatusBadge
ResultCard
ConfidenceScore
DocumentResultCard
ScreeningTable
SearchFilter
EmptyState
ErrorState
LoadingSkeleton
ConfirmDialog
```

This will make the application easier for the team to maintain and
extend.

------------------------------------------------------------------------

# 44. Final Architecture

``` text
                    ┌─────────────────────┐
                    │       React         │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                         REST / HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Express        │
                    │       API           │
                    └──────┬───────┬──────┘
                           │       │
                ┌──────────┘       └───────────┐
                ▼                              ▼
       ┌─────────────────┐            ┌─────────────────┐
       │     MongoDB     │            │   AI Service    │
       │                 │            │                 │
       │ Users           │            │ OCR             │
       │ Screenings      │            │ Detection       │
       │ AI Results      │            │ Tampering       │
       └─────────────────┘            │ Verification    │
                                      └─────────────────┘
```

The key architectural principle is:

> **The MERN application should treat the AI system as an external
> service with a clearly defined API contract.**

This allows the AI team to develop or replace the AI pipeline
independently while the React/MERN application remains stable.
