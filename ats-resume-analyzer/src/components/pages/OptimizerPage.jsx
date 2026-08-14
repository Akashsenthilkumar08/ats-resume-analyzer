import { useState, useRef } from "react";
import { Sparkles, CloudUpload, Copy, Download, CheckCircle2, Tag, Lightbulb, Lock, QrCode } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function OptimizerPage() {
  const { addToast, isSubscribed, setUpgradeModalOpen } = useApp();
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  async function handleOptimize() {
    if (!file && !jd.trim()) {
      addToast({ title: "Required", message: "Provide a resume file or job description.", type: "warning" });
      return;
    }
    setOptimizing(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 2200));
    setResult({
      score_before: 62,
      score_after: 88,
      added_keywords: ["TypeScript", "GraphQL", "Docker", "Agile", "REST APIs"],
      removed_phrases: ["responsible for", "worked with team", "helped to"],
      improved_bullets: [
        { before: "Worked on the frontend", after: "Architected and shipped 12+ React components reducing load time by 40%" },
        { before: "Helped with APIs", after: "Designed and integrated 5 REST API endpoints serving 50k daily active users" },
      ],
      suggestions: ["Quantify all achievements with numbers", "Use action verbs at the start of each bullet", "Add a skills section with exact keywords from JD"],
    });
    setOptimizing(false);
    addToast({ title: "Optimization Complete!", message: "Score improved by 26%.", type: "success" });
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
    addToast({ title: "Copied!", message: "Text copied to clipboard.", type: "success" });
  }

  if (!isSubscribed) {
    return (
      <main className="content page-fade">
        <div className="page-header">
          <div>
            <h2 className="page-title">Resume Optimizer 🔒</h2>
            <p className="page-subtitle">AI rewrites and enhances your resume content to maximize ATS scores.</p>
          </div>
        </div>

        <div className="card locked-card-container">
          <div className="locked-badge">
            <Lock size={32} style={{ color: "#ef4444" }} />
          </div>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
            Resume Optimizer is Locked
          </h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "460px", margin: "0 auto 24px", lineHeight: 1.6 }}>
            Subscribe to Classic (₹1,650/mo), Pro (₹8,250/mo), or Enterprise (₹16,500/mo) to unlock AI bullet-point rewrites, keyword additions, and ATS optimization.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => setUpgradeModalOpen(true)}>
            <QrCode size={18} /> Unlock &amp; Pay via PhonePe QR
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="content page-fade">
      <div className="page-header">
        <div>
          <h2 className="page-title">Resume Optimizer</h2>
          <p className="page-subtitle">AI rewrites and enhances your resume content to maximize ATS scores.</p>
        </div>
      </div>

      <div className="scanner-grid">
        <div className="scanner-inputs">
          <div className="card">
            <h3 className="card-title">Upload Resume</h3>
            <div
              className={"dropzone" + (dragging ? " drag-over" : "")}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
              <CloudUpload size={36} className="dropzone-icon" />
              {file ? <p><strong>✓ {file.name}</strong></p> : <p>Drop resume or click to upload</p>}
            </div>
          </div>
          <div className="card" style={{ marginTop: 20 }}>
            <h3 className="card-title">Target Job Description <span className="optional-badge">optional</span></h3>
            <textarea className="jd-textarea" placeholder="Paste job description to tailor optimization..." value={jd} onChange={e => setJd(e.target.value)} rows={6} />
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 16 }} onClick={handleOptimize} disabled={optimizing}>
            {optimizing ? <span className="spinner-sm" /> : <Sparkles size={18} />}
            {optimizing ? "Optimizing…" : "Optimize Resume"}
          </button>
        </div>

        <div className="scanner-results">
          {!result && !optimizing && (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <h3>Ready to optimize</h3>
              <p>Upload your resume and click Optimize to get AI-powered improvements.</p>
            </div>
          )}
          {optimizing && (
            <div className="scanning-anim">
              <div className="scan-ring" />
              <p>AI is rewriting your resume…</p>
              <p className="scan-steps">Analyzing → Rewriting bullets → Adding keywords</p>
            </div>
          )}
          {result && (
            <div className="results-stack">
              <div className="card result-score-card" style={{ gap: 24 }}>
                <div style={{ textAlign: "center" }}>
                  <p className="result-score-sub">Before</p>
                  <p className="opt-score opt-score-before">{result.score_before}%</p>
                </div>
                <div className="score-arrow">→</div>
                <div style={{ textAlign: "center" }}>
                  <p className="result-score-sub">After</p>
                  <p className="opt-score opt-score-after">{result.score_after}%</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p className="result-score-sub">Improvement</p>
                  <p className="opt-score opt-score-gain">+{result.score_after - result.score_before}%</p>
                </div>
              </div>

              <div className="card">
                <h4 className="result-section-title"><Tag size={16} style={{color:"#a855f7"}} /> Keywords Added</h4>
                <div className="tag-cloud">
                  {result.added_keywords.map((k, i) => <span className="chip chip-purple" key={i}>{k}</span>)}
                </div>
              </div>

              <div className="card">
                <h4 className="result-section-title"><CheckCircle2 size={16} style={{color:"#22c55e"}} /> Improved Bullets</h4>
                {result.improved_bullets.map((b, i) => (
                  <div key={i} className="bullet-improve">
                    <p className="bullet-before">❌ {b.before}</p>
                    <p className="bullet-after">✅ {b.after} <button className="icon-btn" onClick={() => copy(b.after)}><Copy size={12} /></button></p>
                  </div>
                ))}
              </div>

              <div className="card">
                <h4 className="result-section-title"><Lightbulb size={16} style={{color:"#6C63FF"}} /> Suggestions</h4>
                <ul className="result-list result-list-blue">
                  {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
