"""
NLP Entity Extraction Module using spaCy & Regex
Extracts key resume entities: Skills, Organizations, Job Titles, Education, Dates, Experience.
"""

import re
from typing import Dict, List, Any

# Try importing spacy
try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
    except Exception:
        nlp = spacy.blank("en")
except ImportError:
    nlp = None

# Comprehensive skill taxonomy catalog
SKILL_TAXONOMY = {
    # Technical & Languages
    "python", "javascript", "typescript", "react", "react.js", "next.js", "node.js",
    "express", "html", "html5", "css", "css3", "tailwinds", "tailwind css", "vue", "angular",
    "java", "c++", "c#", "go", "golang", "rust", "sql", "postgresql", "mysql", "mongodb",
    "redis", "graphql", "rest api", "docker", "kubernetes", "aws", "gcp", "azure", "git",
    "github", "ci/cd", "linux", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "keras", "nlp", "machine learning", "deep learning", "ai", "llm", "fastapi", "flask", "django",

    # Soft skills & Management
    "agile", "scrum", "leadership", "communication", "problem solving", "teamwork",
    "project management", "product design", "figma", "user research", "a/b testing",
    "data analysis", "system design", "performance optimization", "microservices"
}

EDUCATION_KEYWORDS = [
    "bachelor", "master", "phd", "b.s", "m.s", "b.tech", "m.tech", "b.e", "computer science",
    "information technology", "data science", "degree", "university", "college", "institute"
]

JOB_TITLE_KEYWORDS = [
    "software engineer", "frontend engineer", "backend engineer", "full stack developer",
    "product manager", "project manager", "data scientist", "ml engineer", "ux designer",
    "ui designer", "devops engineer", "system architect", "tech lead", "intern"
]


def extract_entities(text: str) -> Dict[str, Any]:
    """
    Extracts Skills, Organizations, Job titles, Education, Dates, Experience from resume text.
    """
    text_lower = text.lower()
    words = set(re.findall(r'\b[a-zA-Z0-9\.\+#\-]+\b', text_lower))

    # 1. Extract Skills
    found_skills = []
    for skill in SKILL_TAXONOMY:
        if skill in text_lower:
            found_skills.append(skill.title())

    # 2. Extract Organizations & Dates using spaCy if available
    organizations = []
    dates = []
    if nlp is not None and len(text) > 0:
        doc = nlp(text[:5000]) # Cap for performance
        for ent in doc.ents:
            if ent.label_ == "ORG" and ent.text not in organizations:
                organizations.append(ent.text)
            elif ent.label_ == "DATE" and ent.text not in dates:
                dates.append(ent.text)

    # 3. Extract Education
    found_education = []
    for edu in EDUCATION_KEYWORDS:
        if edu in text_lower:
            found_education.append(edu.title())

    # 4. Extract Job Titles
    found_titles = []
    for title in JOB_TITLE_KEYWORDS:
        if title in text_lower:
            found_titles.append(title.title())

    # 5. Estimate Experience Years
    experience_years = _estimate_experience(text_lower)

    return {
        "skills": list(set(found_skills)),
        "organizations": list(set(organizations))[:8],
        "job_titles": list(set(found_titles)),
        "education": list(set(found_education)),
        "dates": list(set(dates))[:5],
        "experience_years": experience_years
    }


def _estimate_experience(text_lower: str) -> int:
    matches = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*experience', text_lower)
    if matches:
        try:
            return max([int(m) for m in matches])
        except ValueError:
            pass
    return 3 # Default estimate fallback
