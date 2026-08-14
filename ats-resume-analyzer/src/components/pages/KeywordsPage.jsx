import { useState, useRef } from "react";
import { Tags, CloudUpload, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useApp } from "../../context/AppContext";

const CATEGORIES = ["Technical", "Soft Skills", "Tools", "Domain", "Certifications"];

export default function KeywordsPage() {
  const { addToast } = useApp();
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  async function analyze() {
    if (!file && !jd.trim()) {
      addToast({ title: "Required", message: "Upload a resume or enter a job description.", type: "warning" });
      return;
    }
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1800));
    setResult({
      resume_keywords: {
        "Technical": ["React", "JavaScript", "Node.js", "PostgreSQL", "HTML", "CSS"],
        "Tools": ["Git", "VS Code", "Figma", "Slack"],
        "Soft Skills": ["Leadership", "Communication", "Problem-solving"],
        "Domain": ["E-commerce", "SaaS"],
        "Certifications": [],
      },
      jd_keywords: {
        "Technical": ["React", "TypeScript", "GraphQL", "Docker", "Redis", "Python"],
        "Tools": ["Git", "Jira", "Kubernetes"],
        "Soft Skills": ["Communication", "Collaboration", "Agile"],
        "Domain": ["FinTech", "SaaS"],
        "Certifications": ["AWS Certified"],
      },
      missing: ["TypeScript", "GraphQL", "Docker", "Redis", "Python", "Kubernetes", "Jira", "AWS Certified", "Agile", "FinTech"],
      extra: ["Figma", "E-commerce", "VS Code"],
      match_pct: 64,
    });
    setLoading(false);
    addToast({ title: "Keywords Analyzed!", message: "Found 10 missing keywords.", type: "success" });
  }

  const statusIcon = (keyword, cat) => {
    const inResume = result?.resume_keywords[cat]?.includes(keyword);
    const inJD = result?.jd_keywords[cat]?.includes(keyword);
    if (inResume && inJD) return <TrendingUp size={14} style={{color:"#22c55e"}} />;
    if (inJD && !inResume) return <TrendingDown size={14} style={{color:"#ef4444"}} />;
    return <Minus size={14} style={{color:"#6b7280"}} />;
  };

  const allJDKeywords = result ? Object.values(result.jd_keywords).flat() : [];

  return (
    <main className="content page-fade">
      <div className="page-header">
        <div>
          <h2 className="page-title">Keyword Analyzer</h2>
          <p className="page-subtitle">See which ATS keywords are in your resume vs the job description.</p>
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
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
              <CloudUpload size={36} className="dropzone-icon" />
              {file ? <p><strong>✓ {file.name}</strong></p> : <p>Drop resume or click to browse</p>}
            </div>
          </div>
          <div className="card" style={{ marginTop: 20 }}>
            <h3 className="card-title">Job Description</h3>
            <textarea className="jd-textarea" placeholder="Paste job description to compare keywords..." value={jd} onChange={e => setJd(e.target.value)} rows={6} />
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 16 }} onClick={analyze} disabled={loading}>
            {loading ? <span className="spinner-sm" /> : <Tags size={18} />}
            {loading ? "Analyzing…" : "Analyze Keywords"}
          </button>
        </div>

        <div className="scanner-results">
          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-icon">🏷️</div>
              <h3>No keywords yet</h3>
              <p>Upload a resume and job description to see the keyword gap analysis.</p>
            </div>
          )}
          {loading && (
            <div className="scanning-anim">
              <div className="scan-ring" />
              <p>Extracting keywords…</p>
            </div>
          )}
          {result && (
            <div className="results-stack">
              <div className="card kw-summary-row">
                <div className="kw-stat"><span className="kw-stat-num kw-green">{allJDKeywords.length - result.missing.length}</span><span>Matched</span></div>
                <div className="kw-stat"><span className="kw-stat-num kw-red">{result.missing.length}</span><span>Missing</span></div>
                <div className="kw-stat"><span className="kw-stat-num kw-purple">{result.match_pct}%</span><span>Coverage</span></div>
              </div>

              <div className="card">
                <h4 className="result-section-title" style={{color:"#ef4444"}}>❌ Missing Keywords</h4>
                <div className="tag-cloud">
                  {result.missing.map((k, i) => <span className="chip chip-danger" key={i}>{k}</span>)}
                </div>
              </div>

              <div className="card">
                <h4 className="result-section-title" style={{color:"#22c55e"}}>✅ Keywords Found in Resume</h4>
                <div className="tag-cloud">
                  {Object.values(result.resume_keywords).flat().map((k, i) => <span className="chip chip-success" key={i}>{k}</span>)}
                </div>
              </div>

              <div className="card">
                <h4 className="result-section-title">📊 By Category</h4>
                {CATEGORIES.map(cat => {
                  const jdKws = result.jd_keywords[cat] || [];
                  if (!jdKws.length) return null;
                  return (
                    <div key={cat} className="kw-category">
                      <p className="kw-cat-name">{cat}</p>
                      <div className="tag-cloud">
                        {jdKws.map(k => {
                          const has = result.resume_keywords[cat]?.includes(k);
                          return <span className={"chip " + (has ? "chip-success" : "chip-danger")} key={k}>{k}</span>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
