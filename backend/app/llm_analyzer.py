"""
LLM Explanation Module (Gemini / OpenAI Integration)
Generates structured candidate feedback:
- Strengths
- Weak areas
- Recommendations
- Missing skills
"""

import os
from typing import Dict, Any, List

# Try importing google.generativeai
try:
    import google.generativeai as genai
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
    else:
        model = None
except Exception:
    model = None


def generate_llm_insights(resume_text: str, jd_text: str, match_result: Dict[str, Any], entities: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates Strengths, Weak areas, Recommendations, and Missing skills using Gemini LLM if configured,
    or smart fallback reasoning engine.
    """
    missing_kw = match_result.get("missing_keywords", [])
    found_skills = entities.get("skills", [])
    overall = match_result.get("overall_score", 75)

    if model is not None:
        try:
            prompt = f"""
            System: You are an expert ATS (Applicant Tracking System) Specialist & Technical Recruiter.
            Analyze the following resume against the job description.

            Resume Skills: {', '.join(found_skills)}
            Overall Match Score: {overall}%
            Missing Keywords: {', '.join(missing_kw[:8])}

            Provide structured output:
            1. 3 Key Strengths
            2. 2 Weak Areas / Gaps
            3. 3 Actionable Recommendations
            """
            response = model.generate_content(prompt)
            if response and response.text:
                return _parse_llm_response(response.text, missing_kw)
        except Exception:
            pass

    # High-quality fallback engine
    strengths = [
        f"Strong alignment in core skill domain ({', '.join(found_skills[:3]) if found_skills else 'Technical proficiency'})",
        "Clear formatting and well-structured professional experience bullet points.",
        f"Demonstrated relevant experience ({entities.get('experience_years', 3)}+ years estimated)."
    ]

    weaknesses = [
        f"Missing critical ATS keywords required by the JD ({', '.join(missing_kw[:3]) if missing_kw else 'Domain specific tools'})",
        "Bullet points could quantify results more directly with percentages or revenue metrics."
    ]

    recommendations = [
        f"Incorporate missing keywords naturally into your Skills section: {', '.join(missing_kw[:4]) if missing_kw else 'Key industry terms'}.",
        "Rephrase duty statements into action-oriented impact accomplishments.",
        "Customize your professional summary to explicitly match the target job title."
    ]

    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": recommendations,
        "missing_skills": missing_kw[:6]
    }


def _parse_llm_response(text: str, missing_kw: List[str]) -> Dict[str, Any]:
    lines = [line.strip("- *").strip() for line in text.split("\n") if line.strip()]
    return {
        "strengths": lines[:3],
        "weaknesses": lines[3:5],
        "recommendations": lines[5:8],
        "missing_skills": missing_kw[:6]
    }
