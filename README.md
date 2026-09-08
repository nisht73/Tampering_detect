# 🛂 Border Force Identity Portal — Tampering Detect

> **SIH 2026 Prototype** — An AI-powered document screening and identity verification system for authorized border force personnel.

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [API Reference](#api-reference)
9. [AI Service Contract](#ai-service-contract)
10. [Risk Score Engine](#risk-score-engine)
11. [User Roles & Permissions](#user-roles--permissions)
12. [Development Phases](#development-phases)

---

## Overview

**Tampering Detect** is a full-stack identity verification portal that enables border officers to:

- Upload identity and travel documents (passports, visas, national IDs, driving licences)
- Run AI-powered analysis including OCR, tampering detection, and face verification
- Get an explainable **risk score** combining all signals
- Review screening history, manage users, and maintain a full audit trail

The system is split into three independent services:
- **React Frontend** — Officer-facing portal
- **Node.js Backend** — Orchestration, validation, risk scoring, and database layer
- **Python FastAPI AI Service** — OCR, EXIF forensics, SSIM tampering detection

---

## System Architecture

```
React Frontend (Vite/Tailwind CSS)   :5173
          |
          | REST (Axios)
          v
Node.js + Express API Gateway        :5000
          |
          +-------------------+
          |                   |
          v                   v
       MongoDB            Python FastAPI AI Service  :8000
     (Mongoose)         (EasyOCR / SSIM / EXIF / ORB)
```

> The Node.js backend acts as the **orchestrator** — it never puts AI logic inside routes, keeping the AI service cleanly decoupled and replaceable.

---

## Technology Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Axios, React Router, React-Hot-Toast |
| Backend    | Node.js, Express.js, Mongoose, Multer, JWT, bcryptjs, Helmet, Morgan, express-rate-limit |
| Database   | MongoDB                                                 |
| AI Service | Python, FastAPI, EasyOCR, OpenCV (cv2), scikit-image, Pillow (EXIF) |

---

## Project Structure

```
Tampering_detect/
│
├── frontend/               # React frontend application
│   └── src/
│       ├── components/     # Reusable UI components (Layout, ProtectedRoute, etc.)
│       ├── pages/          # Route-level page components
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── NewScreening.jsx
│       │   ├── ScreeningDetails.jsx
│       │   ├── ScreeningHistory.jsx
│       │   ├── Profile.jsx
│       │   └── admin/
│       │       ├── UserManagement.jsx
│       │       └── AuditLogs.jsx
│       ├── context/        # AuthContext (JWT token storage, user state)
│       ├── services/       # Centralized Axios API client
│       └── App.jsx         # Route definitions with RBAC guards
│
├── backend/                # Node.js/Express API + MongoDB models
│   ├── app.js              # Entry point, middleware, route mounting
│   ├── config/             # DB connection (db.js), risk weight config (riskWeights.js)
│   ├── controllers/        # Route handler logic (auth, documents, screenings, etc.)
│   ├── routes/             # Route definitions (6 route groups)
│   ├── models/             # Mongoose schemas (User, Document, Screening, AuditLog, ReferenceRecord)
│   ├── services/           # Business logic layer
│   │   ├── aiService.js        # HTTP client for FastAPI AI service
│   │   ├── documentService.js  # File handling & metadata
│   │   ├── screeningService.js # Main orchestration workflow
│   │   ├── validationService.js# Expiry, format, cross-doc checks
│   │   ├── riskService.js      # Risk score aggregation
│   │   └── auditService.js     # Audit log creation
│   ├── middleware/         # auth, role, upload, error middlewares
│   └── utils/              # logger.js, helpers.js (ID generation)
│
├── ai-services/            # Python FastAPI AI microservice
│   └── app.py              # EXIF forensics, ORB alignment, SSIM diff, EasyOCR
│
├── package.json            # Root-level scripts (optional)
├── requirements_mern.md    # Full MERN developer requirements spec
└── README.md               # This file
```

---

## Features

### 🔐 Authentication & Authorization
- JWT-based login/logout
- **OFFICER** and **ADMIN** roles with protected routes
- Rate-limited auth endpoints (100 req / 15 min per IP)
- Passwords hashed with bcryptjs

### 📄 Document Upload
- Drag-and-drop or file-picker upload
- Supports: Passport, Visa, National ID, Driving Licence, Travel Permit
- File type & size validation (10 MB limit)
- Safe server-side filename generation (no user-supplied names trusted)

### 🤖 AI-Powered Analysis
- **OCR** — EasyOCR extracts text fields from the document image
- **EXIF Forensics** — Detects editing software signatures (e.g., Photoshop) in metadata
- **SSIM Tampering Detection** — ORB feature matching aligns to template, then pixel-level Structural Similarity Index highlights tampered regions
- **Face Verification** — Checks face match and similarity score

### ⚖️ Risk Assessment Engine
- Weighted risk scoring combining: tampering, face mismatch, expiry, validation errors, and blacklist hits
- Risk levels: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- Fully **explainable** — returns a list of contributing factors and weights

### 📊 Dashboard & History
- Real-time statistics: total, low/medium/high/critical/pending screenings
- Searchable, filterable screening history table
- Screening statuses: `UPLOADED`, `PROCESSING`, `COMPLETED`, `FAILED`, `REVIEW_REQUIRED`

### 📋 Audit Trail
- Immutable log of every action: `DOCUMENT_UPLOADED`, `OCR_REQUESTED`, `AI_ANALYSIS_COMPLETED`, `VALIDATION_COMPLETED`, `RISK_SCORE_GENERATED`, `SCREENING_COMPLETED`

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a cloud Atlas URI
- **Python** 3.9+ (for AI service)

---

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` (see [Environment Variables](#environment-variables)):

```bash
npm run dev
# Server starts on http://localhost:5000
```

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# App opens on http://localhost:5173
```

---

### 3. AI Service

```bash
cd ai-services
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install fastapi uvicorn easyocr opencv-python scikit-image pillow numpy
uvicorn app:app --reload --port 8000
# AI API docs: http://localhost:8000/docs
```

---

## Environment Variables

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/document-screening

# Auth
JWT_SECRET=your_very_strong_secret_here

# CORS
CLIENT_URL=http://localhost:5173

# AI Service
AI_SERVICE_URL=http://localhost:8000

# File Storage
UPLOAD_DIR=uploads
```

> ⚠️ Never commit `.env` to Git. It is already in `.gitignore`.

---

## API Reference

All backend APIs are prefixed with `/api`.  
Protected routes require `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint              | Auth | Description          |
|--------|-----------------------|------|----------------------|
| POST   | `/api/auth/register`  | No   | Register a new user  |
| POST   | `/api/auth/login`     | No   | Login, returns JWT   |
| GET    | `/api/auth/me`        | Yes  | Get current user     |
| POST   | `/api/auth/logout`    | Yes  | Logout               |

### Documents

| Method | Endpoint                  | Auth | Description              |
|--------|---------------------------|------|--------------------------|
| POST   | `/api/documents/upload`   | Yes  | Upload a document file   |
| GET    | `/api/documents/:id`      | Yes  | Get document metadata    |
| DELETE | `/api/documents/:id`      | Yes  | Delete a document        |

**Upload Response Example:**
```json
{
  "success": true,
  "documentId": "DOC-123456",
  "fileName": "passport.jpg",
  "documentType": "passport"
}
```

### Screenings

| Method | Endpoint                  | Auth | Description                        |
|--------|---------------------------|------|------------------------------------|
| POST   | `/api/screenings`         | Yes  | Create & start a new screening     |
| GET    | `/api/screenings`         | Yes  | List all screenings (with filters) |
| GET    | `/api/screenings/:id`     | Yes  | Get screening result by ID         |

**Create Screening Request:**
```json
{
  "documentIds": ["DOC-123456", "DOC-123457"],
  "faceImageId": "DOC-123458",
  "documentType": "passport"
}
```

### Dashboard & Admin

| Method | Endpoint                  | Auth  | Role  | Description            |
|--------|---------------------------|-------|-------|------------------------|
| GET    | `/api/dashboard/stats`    | Yes   | Any   | Risk & count statistics|
| GET    | `/api/users`              | Yes   | ADMIN | List all users         |
| PATCH  | `/api/users/:id`          | Yes   | ADMIN | Update user role       |
| DELETE | `/api/users/:id`          | Yes   | ADMIN | Delete a user          |
| GET    | `/api/audit-logs`         | Yes   | ADMIN | View audit logs        |

---

## AI Service Contract

The Node.js backend sends documents to the FastAPI service and expects this response:

**Request:** `POST http://localhost:8000/analyze`  
Content-Type: `multipart/form-data`  
Field: `file` (image file)

**Response:**
```json
{
  "ocr": {
    "name": "John Doe",
    "documentNumber": "ABC123456",
    "dateOfBirth": "1990-01-01",
    "expiryDate": "2030-01-01",
    "nationality": "IND",
    "gender": "M"
  },
  "tampering": {
    "suspicious": false,
    "confidence": 0.12,
    "flags": ["Clean EXIF metadata."]
  },
  "face": {
    "matched": true,
    "similarity": 0.95
  }
}
```

> The AI service uses **EasyOCR** for text extraction, **EXIF tag analysis** for software signatures, **ORB feature matching** for document alignment to template, and **SSIM pixel comparison** to highlight tampered regions.

---

## Risk Score Engine

The `riskService.js` aggregates weighted signals into a 0–100 score.

| Signal                    | Weight (points) |
|---------------------------|-----------------|
| Tampering detected        | Configurable    |
| Face mismatch (< 0.7)     | Configurable    |
| Document expired          | Configurable    |
| Document expiring soon    | Configurable    |
| Validation errors (×count)| Configurable    |
| Blacklisted document      | Configurable    |

Scores are mapped to levels via `config/riskWeights.js`:

| Score     | Level      | Outcome           |
|-----------|------------|-------------------|
| 0–25      | `LOW`      | `COMPLETED`       |
| 26–50     | `MEDIUM`   | `COMPLETED`       |
| 51–75     | `HIGH`     | `REVIEW_REQUIRED` |
| 76–100    | `CRITICAL` | `REVIEW_REQUIRED` |

**Response includes explainable factors:**
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

---

## User Roles & Permissions

| Feature              | OFFICER | ADMIN |
|----------------------|---------|-------|
| Login / Logout       | ✅      | ✅    |
| Upload documents     | ✅      | ✅    |
| Run a screening      | ✅      | ✅    |
| View results         | ✅      | ✅    |
| View history         | ✅      | ✅    |
| View dashboard stats | ✅      | ✅    |
| Manage users         | ❌      | ✅    |
| View audit logs      | ❌      | ✅    |

---

## Development Phases

| Phase | Description                                      | Status      |
|-------|--------------------------------------------------|-------------|
| 1     | Project setup (React, Express, MongoDB, .env)    | ✅ Done     |
| 2     | Frontend ↔ Backend connection verified           | ✅ Done     |
| 3     | Backend ↔ AI Service connection (mock → real)    | ✅ Done     |
| 4     | Authentication — JWT, login, protected routes    | ✅ Done     |
| 5     | Document upload — Multer, metadata, storage      | ✅ Done     |
| 6     | AI integration — live FastAPI calls              | ✅ Done     |
| 7     | Validation — expiry, format, cross-doc checks    | ✅ Done     |
| 8     | Risk engine — weighted score & explanation       | ✅ Done     |
| 9     | Database persistence — all models & audit logs   | ✅ Done     |
| 10    | Dashboard — live statistics & history            | ✅ Done     |
| 11    | Testing & finalization for SIH demo              | 🔄 In Progress |

---

> Built for **Smart India Hackathon (SIH) 2026** — Border Force Identity Verification track.
