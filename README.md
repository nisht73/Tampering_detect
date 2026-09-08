# Border Force Identity Portal (Tampering Detect)

An AI-powered border force identity verification portal developed for SIH 2026. This platform assists authorized personnel in the preliminary verification of identity and travel documents. It leverages a modern MERN web stack integrated with specialized Python-based AI services for OCR, document classification, database verification, tampering detection (via Error Level Analysis), and face verification.

## 🚀 Features

*   **Multi-Document Verification**: Supports uploading and cross-verifying passports, visas, national IDs, and driving licences.
*   **AI-Powered Analysis**: 
    *   Optical Character Recognition (OCR) and MRZ extraction
    *   Server-side Tampering Detection (Photo replacement, Text manipulation, Stamp forgery)
    *   Face verification (matching presented face against document photo)
*   **Risk Assessment Engine**: Aggregates validation and AI signals to provide comprehensive `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL` risk scores with explainable factors.
*   **Officer Dashboard & Screening Management**: Complete workflow orchestration, history tracking, dashboard statistics, and comprehensive audit trails.
*   **Role-Based Access Control**: Authentication and authorization tailored for `OFFICER` and `ADMIN` roles.
*   **Report Generation**: (Planned) PDF export functionality for completed screenings.

## 🏗️ System Architecture

The application is built on a full-stack, distributed architecture:

```text
React Frontend (Vite/Tailwind)
      |
      | REST API (Axios Axios)
      v
Node.js + Express.js API Gateway (Backend)
      |
      +--------------------+
      |                    |
      v                    v
   MongoDB        Python FastAPI AI Service
 (Storage)      (OCR / Tampering / Face Matching)
```

## 🛠️ Technology Stack

### Frontend
*   **React.js** with Vite
*   **Tailwind CSS** for responsive, modern UI
*   **Axios** for API communication
*   **React Router** for protected routing

### Backend (MERN/Node Service)
*   **Node.js & Express.js**
*   **MongoDB & Mongoose**
*   Multer (file uploads), JWT (Auth), bcryptjs

### AI Service
*   **Python & FastAPI**
*   Custom ML models for Error Level Analysis (ELA), OCR, and face matching logic.

## 📂 Project Structure

```text
Tampering_detect/
├── frontend/         # React frontend application
├── backend/          # Node.js Express API & MongoDB orchestration
├── ai-services/      # Python FastAPI AI models 
└── README.md         # Documentation
```

## 🔐 Security & Responsibilities

The system design enforces a strict separation of concerns:
*   The **MERN stack** securely handles authentication, file validation, database persistence, business validation rules (expiry, cross-checks), and risk score aggregation.
*   The **AI Service** handles only inference (OCR extraction, ELA tampering checks) in an isolated environment. Node.js acts as an orchestration gateway, never exposing inner AI logic directly to the client.

## ⚙️ Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (running locally or a cloud URI)
*   Python 3.9+ (for AI services)

### Installation

**1. Clone & Setup Backend**
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/document-screening
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
UPLOAD_DIR=uploads
```
```bash
npm run dev
```

**2. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

**3. Setup AI Service**
```bash
cd ai-services
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 📡 API Integration Contract

The Node backend orchestrates requests to the AI service. 
Example expected AI service response:
```json
{
  "documentType": "passport",
  "ocr": {
    "name": "John Doe",
    "passportNumber": "ABC123456"
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

## 📜 Development Status
Currently in active debugging and finalization for SIH 2026. Focus is resolving database connections, frontend integrations, and environment variable configurations.
