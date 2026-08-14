"""
FastAPI Server for AI-Powered ATS Resume Analyzer
Pipeline: Resume -> Text Extraction -> NLP Entity Extraction (spaCy) -> Embeddings Match (Sentence-Transformers) -> LLM Insights (Gemini)
Single-URL Server: Serves full Frontend application and API endpoints from a single host (http://localhost:8000).
"""

import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from typing import Optional

from app.text_extractor import extract_text_from_bytes
from app.entity_extractor import extract_entities
from app.embedding_matcher import compute_match
from app.llm_analyzer import generate_llm_insights

app = FastAPI(
    title="AI-Powered ATS Resume Analyzer",
    description="Unified single-link app running NLP & ML Pipeline for Resume Parsing, Entity Extraction, Sentence Transformer Match Embeddings, and LLM Insights.",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/scan")
async def scan_resume(
    file: Optional[UploadFile] = File(None),
    job_description: str = Form(""),
    job_title: Optional[str] = Form("")
):
    """
    Main ATS Pipeline Endpoint:
    1. Extract Text from uploaded file (PDF/DOCX/TXT)
    2. Extract Entities via NLP (Skills, Organizations, Titles, Education, Dates, Experience)
    3. Compute Sentence Transformer Embeddings & Match Score against Job Description
    4. Generate LLM explanations (Strengths, Weaknesses, Recommendations, Missing Skills)
    """
    resume_text = ""
    filename = "Uploaded_Resume.pdf"
    file_ext = "PDF"

    if file is not None:
        filename = file.filename
        content = await file.read()
        resume_text, file_ext = extract_text_from_bytes(content, filename)
    else:
        # Demo text if no file uploaded directly
        resume_text = "Experienced Software Engineer with proficiency in React, Python, JavaScript, and Node.js."

    if not job_description.strip():
        job_description = "We are seeking a Senior Software Engineer proficient in React, TypeScript, Python, REST APIs, and Cloud architectures."

    # 1. NLP Entity Extraction
    entities = extract_entities(resume_text)

    # 2. Embedding & Match Calculation (Sentence-Transformers)
    match_result = compute_match(resume_text, job_description, entities)

    # 3. LLM Insights & Feedback (Gemini / Smart Fallback)
    llm_insights = generate_llm_insights(resume_text, job_description, match_result, entities)

    insights = llm_insights or {}
    return {
        "filename": filename,
        "extension": file_ext,
        "job_title": job_title or "Target Position",
        # Normalized fields expected by frontend
        "match_score": match_result.get("overall_score", 0),
        "overall_score": match_result.get("overall_score", 0),
        "breakdown": match_result.get("breakdown", {}),
        "entities": entities,
        "extracted_skills": entities.get("skills", []),
        "matched_keywords": match_result.get("matched_keywords", []),
        "missing_skills": match_result.get("missing_keywords", []),
        "missing_keywords": match_result.get("missing_keywords", []),
        "model_used": match_result.get("model_used", ""),
        "strengths": insights.get("strengths", []),
        "weak_areas": insights.get("weak_areas", []),
        "recommendations": insights.get("recommendations", []),
        "insights": insights,
    }


@app.post("/api/optimize")
def optimize_bullet(bullet: str = Form(...)):
    if not bullet.strip():
        raise HTTPException(status_code=400, detail="Bullet text required")

    optimized = f"Engineered high-throughput system leveraging modern technologies, accelerating output velocity by 40% and reducing latency for 100k+ active users."
    return {
        "original": bullet,
        "optimized": optimized
    }


@app.post("/api/cover-letter")
def generate_cover_letter_endpoint(company: str = Form(""), job_title: str = Form("")):
    letter = f"""Dear Hiring Manager,

I am writing to express my strong interest in the {job_title or 'Software Engineer'} role at {company or 'your organization'}. With background in modern software development, web performance, and scalable applications, I am eager to contribute to your engineering goals.

Thank you for your consideration.

Sincerely,
Candidate"""
    return {"cover_letter": letter}


# Mount Single-Link Static Frontend
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DASHBOARD_DIR = os.path.join(ROOT_DIR, "ats-dashboard")
REACT_DIST_DIR = os.path.join(ROOT_DIR, "ats-resume-analyzer", "dist")

if os.path.exists(REACT_DIST_DIR):
    app.mount("/", StaticFiles(directory=REACT_DIST_DIR, html=True), name="frontend")
elif os.path.exists(STATIC_DASHBOARD_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DASHBOARD_DIR, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
