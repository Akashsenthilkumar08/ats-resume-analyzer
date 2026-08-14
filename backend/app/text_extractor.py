"""
Text Extraction Module for ATS Resume Analyzer
Extracts clean plain text from PDF, DOCX, and TXT files.
"""

import io
from typing import Tuple

try:
    import pypdf
except ImportError:
    pypdf = None

try:
    import docx
except ImportError:
    docx = None


def extract_text_from_bytes(file_bytes: bytes, filename: str) -> Tuple[str, str]:
    """
    Extracts text from raw file bytes based on file extension.
    Returns (extracted_text, extension).
    """
    filename_lower = filename.lower()

    if filename_lower.endswith(".pdf"):
        return _extract_pdf(file_bytes), "PDF"
    elif filename_lower.endswith(".docx"):
        return _extract_docx(file_bytes), "DOCX"
    elif filename_lower.endswith(".doc"):
        return _extract_docx(file_bytes), "DOC"
    else:
        # Fallback to UTF-8 text parsing
        return file_bytes.decode("utf-8", errors="ignore"), "TXT"


def _extract_pdf(file_bytes: bytes) -> str:
    if pypdf is None:
        return _raw_text_fallback(file_bytes)
    try:
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        extracted = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted.append(text)
        return "\n".join(extracted)
    except Exception as e:
        return _raw_text_fallback(file_bytes)


def _extract_docx(file_bytes: bytes) -> str:
    if docx is None:
        return _raw_text_fallback(file_bytes)
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
    except Exception:
        return _raw_text_fallback(file_bytes)


def _raw_text_fallback(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore")
