# AI Service — Document Forensics & OCR API

> Python **FastAPI** microservice for the Border Force Identity Portal.  
> Runs on **port 8000** by default.  
> Interactive API docs available at: `http://localhost:8000/docs`

---

## Setup

```bash
cd ai-services

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install fastapi uvicorn easyocr opencv-python scikit-image pillow numpy

# Start server
uvicorn app:app --reload --port 8000
```

---

## Analysis Pipeline

When a document image is submitted to `POST /analyze`, the following steps run in sequence:

```
POST /analyze (image file)
        │
        ▼
1. EXIF Metadata Forensics
   → Check for editing software (e.g., Photoshop, GIMP) in EXIF tags
        │
        ▼
2. Document Detection & Cropping
   → Canny edge detection + contour analysis to isolate document regions
   → Falls back to full image if no document rectangle found (area < 50,000px)
        │
        ▼
3. ORB Feature Matching + Perspective Warp (Alignment)
   → ORB detects keypoints and descriptors on both uploaded doc and template
   → BruteForce Hamming matcher finds correspondences
   → Top 20% best matches used to compute homography matrix
   → cv2.warpPerspective() aligns the document to template dimensions
        │
        ▼
4. SSIM Structural Similarity (Tampering Detection)
   → Pixel-by-pixel grayscale comparison between aligned doc and template
   → SSIM score 0–1 (higher = more similar)
   → Difference image thresholded and dilated to group nearby mismatches
   → Contours with area > 300px flagged as tampered regions
   → Red bounding boxes annotated on output image
        │
        ▼
5. EasyOCR Text Extraction
   → Runs on cropped document region
   → Returns raw text array, joined as a single string
   → Fields extracted from raw text (name, number, DOB, expiry, nationality, gender)
        │
        ▼
JSON Response → Node.js Backend
```

---

## API Endpoint

### `POST /analyze`

Analyzes a single document image for OCR, tampering indicators, and face match.

**Request:**
```
Content-Type: multipart/form-data
Field: file  (image — JPEG, PNG supported)
```

**Response:**
```json
{
  "ocr": {
    "name": "First 50 chars of extracted text or 'Unknown'",
    "documentNumber": "DOC1234",
    "dateOfBirth": "1990-01-01",
    "expiryDate": "2030-01-01",
    "nationality": "IND",
    "gender": "M"
  },
  "tampering": {
    "suspicious": false,
    "confidence": 0.85,
    "flags": ["Clean EXIF metadata."]
  },
  "face": {
    "matched": true,
    "similarity": 0.95
  }
}
```

**Error Response (invalid image):**
```json
{
  "error": "Invalid image file."
}
```

---

## Tampering Detection Logic

### 1. EXIF Forensics (`extract_metadata`)
Reads EXIF tags from the image using Pillow.  
Looks specifically for the **`Software`** tag — editing tools like Adobe Photoshop, GIMP, or LightRoom write this tag when saving.

- `"Clean EXIF metadata."` → No editing software detected
- `"WARNING: Image saved by Adobe Photoshop"` → Sets `suspicious = True`
- `"No EXIF data found"` → Common for phone camera images, neutral result

### 2. Document Alignment (`align_to_template`)
Uses **ORB (Oriented FAST and Rotated BRIEF)** to align the uploaded document to a known-good template:
1. Detect up to 5000 keypoints in both images
2. Match descriptors using BruteForce Hamming distance
3. Keep the top 20% of best matches
4. Compute **homography matrix** (RANSAC to remove outliers)
5. Apply `warpPerspective()` to align uploaded document to template shape

### 3. SSIM Pixel Comparison (`calculate_ssim`)
After alignment, computes the **Structural Similarity Index (SSIM)** between the aligned document and the template:
- Converts both to grayscale
- SSIM returns a score (0 = completely different, 1 = identical) and a difference image
- Difference image is thresholded (threshold > 200 inverted) to find high-difference zones
- A 5×5 dilation kernel groups nearby pixel differences together
- Any contour with area **> 300px** is flagged as a tampered region and drawn with a red bounding box

---

## OCR — EasyOCR

- Model: English (`['en']`), CPU mode (`gpu=False`)
- Input: Cropped document image (from contour detection step)
- Output: List of text strings, joined with spaces
- Current limitation: Raw text only — structured field extraction is partially mocked for prototype

---

## Class: `DocumentForensics`

| Method                           | Description                                             |
|----------------------------------|---------------------------------------------------------|
| `extract_metadata(image_bytes)`  | Reads EXIF Software tag; returns warning string if found |
| `detect_and_crop_documents(img)` | Finds document contours > 50k px², returns cropped list  |
| `align_to_template(img, tmpl)`   | ORB + homography perspective warp to match template shape |
| `calculate_ssim(aligned, tmpl)`  | Returns annotated image, SSIM score, and `tampered` bool |

---

## Notes for AI Team

- The **template** is currently a blank white image (prototype fallback). Replace with actual reference document templates per document type for production.
- Face verification is currently returning a **mock response** (`matched: True, similarity: 0.95`). Replace with a real face embedding comparison model (e.g., DeepFace, FaceNet, or InsightFace).
- Structured OCR field extraction (name, passport number, DOB) should be improved with MRZ parsing or regex patterns for production.
- SSIM threshold (300px contour area) and EXIF confidence score may need tuning based on real document datasets.
