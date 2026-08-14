import { useState, useRef } from "react";
import { MessageSquare, CloudUpload, Copy, Download } from "lucide-react";
import { useApp } from "../../context/AppContext";

const TONES = ["Professional", "Enthusiastic", "Concise", "Creative", "Formal"];

export default function CoverLetterPage() {
  const { addToast } = useApp();
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [tone, setTone] = useState("Professional");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [generating, setGenerating] = useState(false);
  const [letter, setLetter] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  async function generate() {
    if (!jd.trim() && !file) {
      addToast({ title: "Required", message: "Provide a resume or job description.", type: "warning" });
      return;
    }
    setGenerating(true);
    setLetter("");
    await new Promise(r => setTimeout(r, 2500));
    const demoLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${role || "Software Engineer"} position at ${company || "your company"}. With a proven track record in building scalable web applications and a deep passion for crafting exceptional user experiences, I am confident that my skills and experiences make me an ideal candidate for this role.

Throughout my career, I have developed expertise in React, TypeScript, and Node.js, delivering high-impact features that serve millions of users. At my previous company, I led the redesign of a core product feature that increased user engagement by 34% and reduced page load time by 45%.

What excites me most about ${company || "your company"} is the commitment to innovation and engineering excellence. I thrive in collaborative, fast-paced environments where I can contribute to meaningful products while continuously growing as an engineer.

I would love the opportunity to discuss how my background aligns with your team's goals. Thank you for considering my application.

${tone === "Enthusiastic" ? "I am incredibly excited about this opportunity and look forward to hearing from you!" : "I look forward to the opportunity to discuss my candidacy further."}

Best regards,
[Your Name]`;
    setLetter(demoLetter);
    setGenerating(false);
    addToast({ title: "Cover Letter Ready!", message: "AI-generated cover letter is ready.", type: "success" });
  }

  function copy() {
    navigator.clipboard.writeText(letter);
    addToast({ title: "Copied!", message: "Cover letter copied to clipboard.", type: "success" });
  }

  return (
    <main className="content page-fade">
      <div className="page-header">
        <div>
          <h2 className="page-title">Cover Letter Generator</h2>
          <p className="page-subtitle">AI writes a tailored, compelling cover letter for any job in seconds.</p>
        </div>
      </div>

      <div className="scanner-grid">
        <div className="scanner-inputs">
          <div className="card">
            <h3 className="card-title">Resume <span className="optional-badge">optional</span></h3>
            <div
              className={"dropzone" + (dragging ? " drag-over" : "")}
              style={{ padding: "20px", minHeight: "80px" }}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
              <CloudUpload size={28} className="dropzone-icon" />
              {file ? <p><strong>✓ {file.name}</strong></p> : <p style={{margin:0}}>Drop resume (optional)</p>}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3 className="card-title">Job Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Company Name</label>
                <input className="form-input" placeholder="Google" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Role / Position</label>
                <input className="form-input" placeholder="Senior Engineer" value={role} onChange={e => setRole(e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label>Job Description</label>
              <textarea className="jd-textarea" rows={5} placeholder="Paste job description..." value={jd} onChange={e => setJd(e.target.value)} />
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3 className="card-title">Tone</h3>
            <div className="tone-tabs">
              {TONES.map(t => (
                <button key={t} className={"tone-tab" + (tone === t ? " active" : "")} onClick={() => setTone(t)}>{t}</button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 16 }} onClick={generate} disabled={generating}>
            {generating ? <span className="spinner-sm" /> : <MessageSquare size={18} />}
            {generating ? "Generating…" : "Generate Cover Letter"}
          </button>
        </div>

        <div className="scanner-results">
          {!letter && !generating && (
            <div className="empty-state">
              <div className="empty-icon">✉️</div>
              <h3>No cover letter yet</h3>
              <p>Fill in the job details and click Generate to create your cover letter.</p>
            </div>
          )}
          {generating && (
            <div className="scanning-anim">
              <div className="scan-ring" />
              <p>Writing your cover letter…</p>
              <p className="scan-steps">Analyzing job → Crafting narrative → Polishing tone</p>
            </div>
          )}
          {letter && (
            <div className="card" style={{ position: "relative" }}>
              <div className="card-header-row" style={{ marginBottom: 16 }}>
                <h3 className="card-title">Generated Cover Letter</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={copy}><Copy size={14} /> Copy</button>
                  <button className="btn btn-primary btn-sm" onClick={() => addToast({ title: "Download", message: "Cover letter downloaded as .docx", type: "success" })}>
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
              <div className="cover-letter-preview">
                {letter.split("\n").map((line, i) => (
                  <p key={i} style={{ marginBottom: line ? "8px" : "16px" }}>{line || "\u00a0"}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
