from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "AI service is running"
    }


@app.post("/analyze")
def analyze_document():
    return {
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
            "suspicious": False,
            "confidence": 0.12,
            "flags": []
        },
        "face": {
            "matched": True,
            "similarity": 0.94
        }
    }
