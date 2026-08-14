import { useState } from "react";
import { PenLine, Copy, Download, Plus, Trash2, GripVertical } from "lucide-react";
import { useApp } from "../../context/AppContext";

const TEMPLATES = ["Modern", "Classic", "Minimal", "Creative", "Executive"];
const SECTIONS = [
  { id: "contact", label: "Contact Info", required: true },
  { id: "summary", label: "Professional Summary", required: false },
  { id: "experience", label: "Work Experience", required: true },
  { id: "education", label: "Education", required: true },
  { id: "skills", label: "Skills", required: false },
  { id: "projects", label: "Projects", required: false },
  { id: "certifications", label: "Certifications", required: false },
  { id: "languages", label: "Languages", required: false },
];

export default function BuilderPage() {
  const { addToast } = useApp();
  const [template, setTemplate] = useState("Modern");
  const [enabled, setEnabled] = useState(["contact", "summary", "experience", "education", "skills", "projects"]);
  const [form, setForm] = useState({ name: "", title: "", email: "", phone: "", summary: "" });

  function toggleSection(id) {
    setEnabled(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  }

  function handleExport() {
    addToast({ title: "Export", message: "Resume exported as PDF (demo).", type: "success" });
  }

  return (
    <main className="content page-fade">
      <div className="page-header">
        <div>
          <h2 className="page-title">Resume Builder</h2>
          <p className="page-subtitle">Build a clean, ATS-friendly resume from scratch.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => addToast({ title: "Preview", message: "Live preview coming soon.", type: "info" })}>
            Preview
          </button>
          <button className="btn btn-primary" onClick={handleExport}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="builder-grid">
        {/* Left: Settings */}
        <div className="builder-settings">
          <div className="card">
            <h3 className="card-title">Template</h3>
            <div className="template-grid">
              {TEMPLATES.map(t => (
                <button key={t} className={"template-btn" + (template === t ? " active" : "")} onClick={() => setTemplate(t)}>
                  <div className="template-thumb">
                    <div className="thumb-line" style={{ width: "60%" }} />
                    <div className="thumb-line" style={{ width: "40%" }} />
                    <div className="thumb-line" />
                    <div className="thumb-line" style={{ width: "80%" }} />
                  </div>
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <h3 className="card-title">Sections</h3>
            <p className="card-desc">Toggle sections to include in your resume</p>
            {SECTIONS.map(s => (
              <div key={s.id} className="section-toggle">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <GripVertical size={14} style={{ color: "var(--text-muted)", cursor: "grab" }} />
                  <span>{s.label}</span>
                  {s.required && <span className="optional-badge">Required</span>}
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={enabled.includes(s.id)} onChange={() => !s.required && toggleSection(s.id)} disabled={s.required} />
                  <span className="toggle-thumb" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="builder-form">
          <div className="card">
            <h3 className="card-title">Personal Info</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-input" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Job Title</label>
                <input className="form-input" placeholder="Senior Frontend Engineer" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input className="form-input" placeholder="john@example.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input className="form-input" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
              </div>
            </div>
          </div>

          {enabled.includes("summary") && (
            <div className="card" style={{ marginTop: 16 }}>
              <h3 className="card-title">Professional Summary</h3>
              <textarea className="jd-textarea" rows={4} placeholder="Write a compelling 2-3 sentence summary..." value={form.summary} onChange={e => setForm(f => ({...f, summary: e.target.value}))} />
            </div>
          )}

          {enabled.includes("experience") && (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-header-row">
                <h3 className="card-title">Work Experience</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => addToast({ title: "Add", message: "Experience entry form coming soon.", type: "info" })}>
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="empty-state-sm">
                <p>No experience entries yet. Click Add to get started.</p>
              </div>
            </div>
          )}

          {enabled.includes("skills") && (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-header-row">
                <h3 className="card-title">Skills</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => addToast({ title: "Add Skill", message: "Skill added.", type: "success" })}>
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="tag-cloud">
                {["React", "TypeScript", "Node.js"].map(k => (
                  <span className="chip chip-purple" key={k}>{k} <button style={{background:"none",border:"none",cursor:"pointer",color:"inherit"}} onClick={() => addToast({title:"Removed",message:k,type:"info"})}>×</button></span>
                ))}
              </div>
            </div>
          )}

          <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 20 }} onClick={() => addToast({ title: "Saved!", message: "Resume draft saved.", type: "success" })}>
            Save Draft
          </button>
        </div>
      </div>
    </main>
  );
}
