import { ScanLine, Upload, Search, Sparkles, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

const ACTIONS = [
  {
    icon: <ScanLine size={22} />,
    colorClass: "qa-icon-purple",
    title: "Scan Resume",
    subtitle: "AI-powered ATS check",
    action: "scan",
  },
  {
    icon: <Upload size={22} />,
    colorClass: "qa-icon-blue",
    title: "Upload Resume",
    subtitle: "PDF, DOCX supported",
    action: "upload",
  },
  {
    icon: <Search size={22} />,
    colorClass: "qa-icon-green",
    title: "Find Jobs",
    subtitle: "Browse matched positions",
    action: "jobs",
  },
  {
    icon: <Sparkles size={22} />,
    colorClass: "qa-icon-orange",
    title: "Optimize Resume",
    subtitle: "Boost your match score",
    action: "optimize",
  },
];

export default function QuickActions() {
  const { setScanOverlayOpen, setUploadModalOpen, addToast } = useApp();

  function handleAction(action) {
    if (action === "scan") { setScanOverlayOpen(true); return; }
    if (action === "upload") { setUploadModalOpen(true); return; }
    addToast({
      title: "Coming Soon",
      message: `${action.charAt(0).toUpperCase() + action.slice(1)} feature coming soon.`,
      type: "info",
    });
  }

  return (
    <section className="card quick-actions-card">
      <div className="card-header">
        <div className="card-title-group">
          <h2 className="card-title">Quick Actions</h2>
          <span className="card-subtitle">Jump right in</span>
        </div>
      </div>

      <div className="quick-actions-grid">
        {ACTIONS.map((a) => (
          <button
            key={a.action}
            className="quick-action-btn"
            onClick={() => handleAction(a.action)}
          >
            <div className={`qa-icon ${a.colorClass}`}>{a.icon}</div>
            <div className="qa-text">
              <strong>{a.title}</strong>
              <span>{a.subtitle}</span>
            </div>
            <ChevronRight size={15} className="qa-arrow" />
          </button>
        ))}
      </div>
    </section>
  );
}
