import { ScanLine, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function HeroCard() {
  const { setScanOverlayOpen, setUploadModalOpen } = useApp();

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

      {/* Video Container (Replaces right side card) */}
      <div className="hero-visual">
        <div className="hero-video-wrapper">
          <video
            src="/video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="hero-video"
          />
        </div>
      </div>
    </section>
  );
}
