import { useState } from "react";
import { FileText, Trash2, Download, Eye, MoreVertical, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";

const DEMO_RESUMES = [
  { id: 1, name: "Software_Engineer_v3.pdf", size: "124 KB", modified: "Aug 10, 2026", score: 91, ext: "PDF" },
  { id: 2, name: "Product_Manager_Resume.pdf", size: "98 KB", modified: "Aug 9, 2026", score: 87, ext: "PDF" },
  { id: 3, name: "UX_Designer_Portfolio.docx", size: "210 KB", modified: "Aug 8, 2026", score: 73, ext: "DOC" },
];

export default function ResumesPage() {
  const { addToast, setUploadModalOpen } = useApp();
  const [resumes, setResumes] = useState(DEMO_RESUMES);
  const [hoverId, setHoverId] = useState(null);

  function deleteResume(id) {
    setResumes(prev => prev.filter(r => r.id !== id));
    addToast({ title: "Deleted", message: "Resume removed.", type: "info" });
  }

  const scoreColor = (s) => s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <main className="content page-fade">
      <div className="page-header">
        <div>
          <h2 className="page-title">My Resumes</h2>
          <p className="page-subtitle">Manage and review all your uploaded resumes.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setUploadModalOpen(true)}>
          <Plus size={16} /> Upload New
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No resumes yet</h3>
          <p>Upload your first resume to get started.</p>
          <button className="btn btn-primary" onClick={() => setUploadModalOpen(true)}>Upload Resume</button>
        </div>
      ) : (
        <div className="resumes-grid">
          {resumes.map(r => (
            <div
              key={r.id}
              className={"resume-card card" + (hoverId === r.id ? " hovered" : "")}
              onMouseEnter={() => setHoverId(r.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <div className="resume-card-top">
                <div className={"file-ext-badge ext-" + r.ext.toLowerCase()}>{r.ext}</div>
                <div className="resume-score" style={{ color: scoreColor(r.score) }}>{r.score}%</div>
              </div>
              <div className="resume-card-body">
                <p className="resume-name">{r.name}</p>
                <p className="resume-meta">{r.size} · {r.modified}</p>
              </div>
              <div className="resume-card-actions">
                <button className="icon-btn" title="Preview" onClick={() => addToast({ title: "Preview", message: r.name, type: "info" })}>
                  <Eye size={15} />
                </button>
                <button className="icon-btn" title="Download" onClick={() => addToast({ title: "Download", message: r.name + " downloaded.", type: "success" })}>
                  <Download size={15} />
                </button>
                <button className="icon-btn icon-btn-danger" title="Delete" onClick={() => deleteResume(r.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {/* Add new card */}
          <div className="resume-card card resume-card-add" onClick={() => setUploadModalOpen(true)}>
            <Plus size={32} className="add-icon" />
            <p>Upload Resume</p>
          </div>
        </div>
      )}
    </main>
  );
}
