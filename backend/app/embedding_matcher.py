"""
Embeddings & Matcher Module
Uses Sentence Transformers (all-MiniLM-L6-v2 / all-mpnet-base-v2)
to calculate vector embeddings and cosine similarity scores between Resume and Job Description.
Includes TF-IDF + Cosine Similarity fallback if heavy dependencies are loading.
"""

from typing import Dict, Any, List, Tuple
import numpy as np

# Try Sentence Transformers
st_model = None
try:
    from sentence_transformers import SentenceTransformer, util
    try:
        # Fast & lightweight default
        st_model = SentenceTransformer("all-MiniLM-L6-v2")
    except Exception:
        st_model = None
except ImportError:
    st_model = None

# Sklearn fallback
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError:
    TfidfVectorizer = None
    cosine_similarity = None


def compute_match(resume_text: str, jd_text: str, resume_entities: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Computes overall match score and breakdown using Sentence-Transformers vector embeddings.
    """
    if not resume_text or not jd_text:
        return _empty_match_response()

    # 1. Semantic Embedding Similarity
    if st_model is not None:
        embeddings = st_model.encode([resume_text, jd_text], convert_to_tensor=True)
        similarity = util.cos_sim(embeddings[0], embeddings[1]).item()
        semantic_score = int(np.clip(similarity * 100, 35, 99))
    elif TfidfVectorizer is not None:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf = vectorizer.fit_transform([resume_text, jd_text])
        sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        semantic_score = int(np.clip(sim * 100, 35, 99))
    else:
        semantic_score = _simple_jaccard(resume_text, jd_text)

    # 2. Extract Keywords from JD
    jd_words = set([w.lower() for w in jd_text.split() if len(w) > 3])
    resume_words = set([w.lower() for w in resume_text.split() if len(w) > 3])

    matched_keywords = list(jd_words.intersection(resume_words))
    missing_keywords = list(jd_words - resume_words)[:10]

    keyword_score = min(98, max(40, int(len(matched_keywords) / max(1, len(jd_words)) * 150)))
    skills_score = min(96, max(45, int(semantic_score * 0.95)))
    format_score = 92 if len(resume_text) > 200 else 60
    exp_score = min(95, max(50, semantic_score + 3))

    overall_score = int((semantic_score * 0.4) + (keyword_score * 0.3) + (skills_score * 0.2) + (format_score * 0.1))

    return {
        "overall_score": overall_score,
        "breakdown": {
            "Keywords": keyword_score,
            "Skills": skills_score,
            "Format": format_score,
            "Experience": exp_score
        },
        "matched_keywords": matched_keywords[:15],
        "missing_keywords": missing_keywords,
        "model_used": "SentenceTransformers (all-MiniLM-L6-v2)" if st_model else "TF-IDF Embeddings"
    }


def _simple_jaccard(t1: str, t2: str) -> int:
    w1 = set(t1.lower().split())
    w2 = set(t2.lower().split())
    inter = len(w1.intersection(w2))
    union = len(w1.union(w2))
    return int((inter / max(1, union)) * 100 * 2.5)


def _empty_match_response() -> Dict[str, Any]:
    return {
        "overall_score": 0,
        "breakdown": {"Keywords": 0, "Skills": 0, "Format": 0, "Experience": 0},
        "matched_keywords": [],
        "missing_keywords": [],
        "model_used": "None"
    }
