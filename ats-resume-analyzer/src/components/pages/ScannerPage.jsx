import { useState, useRef } from "react";
import { CloudUpload, ScanLine, CheckCircle2, AlertTriangle, Lightbulb, Tag } from "lucide-react";
import { useApp } from "../../context/AppContext";

const SAMPLE_JD = `We are looking for a Senior Frontend Engineer with strong experience in React, TypeScript, and modern CSS. 
You should have at least 3 years of experience with REST APIs, GraphQL, and state management (Redux/Zustand). 
Experience with CI/CD pipelines and Docker is a plus. Strong communication skills and ability to work in Agile teams required.`;

export default function ScannerPage() {
  const { addToast } = useApp();
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  function handleFile(f) {
    if (!f) return;
    setFile(f);
    setResult(null);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  async function handleScan() {
    if (!file) { addToast({ title: "No File", message: "Please upload a resume first.", type: "warning" }); return; }
    if (!jd.trim()) { addToast({ title: "No Job Description", message: "Please paste a job description.", type: "warning" }); return; }
    setScanning(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jd);

    try {
      const res = await fetch("/api/scan", { method: "POST", body: formData });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);
      addToast({ title: "Scan Complete!", message: `Match score: ${data.match_score}%`, type: "success" });
    } catch {
      await new Promise(r => setTimeout(r, 2000));
      setResult({
        match_score: 74,
        strengths: ["Strong React & TypeScript experience", "Agile methodology background", "Good API integration skills"],
        weak_areas: ["Missing GraphQL experience", "No Docker/CI-CD mentioned", "Limited leadership examples"],
        recommendations: ["Add quantified achievements", "Mention any DevOps tools", "Include open source contributions"],
        missing_skills: ["GraphQL", "Docker", "Kubernetes", "Jest", "Webpack"],
        extracted_skills: ["React", "TypeScript", "Redux", "REST APIs", "HTML/CSS", "Git"],
      });
      addToast({ title: "Scan Complete (Demo)", message: "Showing demo results — connect backend for real analysis.", type: "info" });
    }
    setScanning(false);
  }

  const score = result?.match_score ?? 0;
  const scoreColor = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <main className="content page-fade">
      <div className="page-header">
        <div>
          <h2 className="page-title">Resume Scanner</h2>
          <p className="page-subtitle">Upload your resume and paste a job description to get an AI-powered match analysis.</p>
        </div>
      </div>

      <div className="scanner-grid">
        <div className="scanner-inputs">
          <div className="card">
            <div className="card-header-row">
              <h3 className="card-title">Upload Resume</h3>
              {file && <span className="chip chip-sm chip-success">✓ {file.name}</span>}
            </div>
            <div
              className={"dropzone" + (dragging ? " drag-over" : "")}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
              <CloudUpload size={40} className="dropzone-icon" />
              {file
                ? <><p><strong>✓ {file.name}</strong></p><p className="dropzone-sub">Click to change</p></>
                : <><p><strong>Drag & drop your resume</strong></p><p className="dropzone-sub">PDF, DOCX, TXT supported</p></>
              }
            </div>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <div className="card-header-row">
              <h3 className="card-title">Job Description</h3>
              <button className="chip chip-sm chip-purple" style={{cursor:"pointer",border:"none"}} onClick={() => setJd(SAMPLE_JD)}>Use Sample</button>
            </div>
            <textarea
              className="jd-textarea"
              placeholder="Paste the full job description here..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={8}
            />
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 16 }} onClick={handleScan} disabled={scanning}>
            {scanning ? <span className="spinner-sm" /> : <ScanLine size={18} />}
            {scanning ? "Analyzing…" : "Scan & Analyze"}
          </button>
        </div>

        <div className="scanner-results">
          {!result && !scanning && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No scan yet</h3>
              <p>Upload a resume and job description, then click Scan to see your AI analysis here.</p>
            </div>
          )}

          {scanning && (
            <div className="scanning-anim">
              <div className="scan-ring" />
              <p>AI is analyzing your resume…</p>
              <p className="scan-steps">Extracting text → Matching skills → Generating insights</p>
            </div>
          )}

          {result && (
            <div className="results-stack">
              <div className="card result-score-card">
                <svg viewBox="0 0 120 120" className="result-ring">
                  <circle cx="60" cy="60" r="52" className="ring-bg" />
                  <circle cx="60" cy="60" r="52" className="ring-fill" stroke={scoreColor}
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - score / 100)}
                  />
                  <text x="60" y="56" textAnchor="middle" className="score-num">{score}</text>
                  <text x="60" y="72" textAnchor="middle" className="score-pct">Match %</text>
                </svg>
                <div>
                  <p className="result-score-label" style={{ color: scoreColor }}>
                    {score >= 80 ? "🟢 Excellent Match" : score >= 60 ? "🟡 Good Match" : "🔴 Needs Improvement"}
                  </p>
                  <p className="result-score-sub">Based on skills, keywords & experience</p>
                </div>
              </div>

              <div className="card">
                <h4 className="result-section-title"><CheckCircle2 size={16} style={{color:"#22c55e"}} /> Strengths</h4>
                <ul className="result-list result-list-green">
                  {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="card">
                <h4 className="result-section-title"><AlertTriangle size={16} style={{color:"#f59e0b"}} /> Areas to Improve</h4>
                <ul className="result-list result-list-yellow">
                  {result.weak_areas?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="card">
                <h4 className="result-section-title"><Tag size={16} style={{color:"#a855f7"}} /> Missing Keywords</h4>
                <div className="tag-cloud">
                  {result.missing_skills?.map((s, i) => <span className="chip chip-purple" key={i}>{s}</span>)}
                </div>
              </div>

              <div className="card">
                <h4 className="result-section-title"><Lightbulb size={16} style={{color:"#6C63FF"}} /> Recommendations</h4>
                <ul className="result-list result-list-blue">
                  {result.recommendations?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
