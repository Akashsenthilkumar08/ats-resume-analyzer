import { ScanLine, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";

const SCORE_DETAILS = [
  { label: "Keywords",   pct: 91 },
  { label: "Skills",     pct: 78 },
  { label: "Format",     pct: 85 },
  { label: "Experience", pct: 82 },
];

const CIRCUMFERENCE = 2 * Math.PI * 52; // r=52

export default function HeroCard() {
  const { setScanOverlayOpen, setUploadModalOpen } = useApp();
  const score = 87;
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <section className="hero-card">
      <div className="hero-bg-blob hero-blob-1" />
      <div className="hero-bg-blob hero-blob-2" />

      {/* Text */}
      <div className="hero-text">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot" />
          AI-Powered Analysis
        </div>
        <h1 className="hero-title">
          Optimize your resume for{" "}
          <span className="gradient-text">every opportunity</span>
        </h1>
        <p className="hero-subtitle">
          Analyze your resume against job descriptions and discover exactly
          what you need to improve. Land more interviews with precision AI insights.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => setScanOverlayOpen(true)}>
            <ScanLine size={18} />
            Scan New Resume
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => setUploadModalOpen(true)}>
            <FileText size={18} />
            View My Resumes
          </button>
        </div>
      </div>

      {/* Score Visual */}
      <div className="hero-visual">
        <div className="hero-score-card">
          {/* Ring */}
          <div className="score-ring-wrap">
            <svg className="score-ring" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <circle className="ring-bg" cx="60" cy="60" r="52" />
              <circle
                className="ring-fill"
                cx="60"
                cy="60"
                r="52"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                stroke="url(#ringGrad)"
              />
              <text x="60" y="56" textAnchor="middle" className="score-num">{score}</text>
              <text x="60" y="72" textAnchor="middle" className="score-pct">Match %</text>
            </svg>
          </div>

          {/* Bar Details */}
          <div className="score-details">
            {SCORE_DETAILS.map((d) => (
              <div className="score-row" key={d.label}>
                <span className="score-label">{d.label}</span>
                <div className="score-bar">
                  <div className="score-bar-fill" style={{ width: `${d.pct}%` }} />
                </div>
                <span>{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
