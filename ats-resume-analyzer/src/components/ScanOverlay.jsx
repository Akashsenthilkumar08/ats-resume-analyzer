import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useApp } from "../context/AppContext";

const STEPS = [
  { label: "Parsing resume structure…" },
  { label: "Extracting keywords & skills…" },
  { label: "Matching against job description…" },
  { label: "Running ATS compatibility check…" },
  { label: "Generating improvement suggestions…" },
];

export default function ScanOverlay() {
  const { scanOverlayOpen, setScanOverlayOpen, addToast } = useApp();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!scanOverlayOpen) {
      // reset on close
      setProgress(0);
      setCurrentStep(0);
      setDone(false);
      return;
    }

    let pct = 0;
    let stepIdx = 0;
    const interval = setInterval(() => {
      pct += 4;
      setProgress(pct);
      const newStep = Math.floor((pct / 100) * STEPS.length);
      setCurrentStep(Math.min(newStep, STEPS.length - 1));

      if (pct >= 100) {
        clearInterval(interval);
        setDone(true);
        setTimeout(() => {
          setScanOverlayOpen(false);
          addToast({
            title: "Scan Complete! 🎉",
            message: "Your resume scored 87% — 3 improvements suggested.",
            type: "success",
          });
        }, 800);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [scanOverlayOpen, setScanOverlayOpen, addToast]);

  return (
    <div className={`scan-overlay ${scanOverlayOpen ? "open" : ""}`}>
      <div className="scan-modal">
        {!done ? (
          <>
            <div className="scan-spinner" />
            <h3>Analyzing Your Resume</h3>
            <p>Our AI is scanning your resume against the job description…</p>
            <div className="scan-progress-bar">
              <div className="scan-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="scan-progress-label">{progress}%</span>

            <div className="scan-steps">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`scan-step ${i < currentStep ? "done" : i === currentStep ? "active" : ""}`}
                >
                  <div className="step-dot">
                    {i < currentStep && (
                      <svg viewBox="0 0 10 10" width="8" height="8">
                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="scan-done">
            <div className="scan-done-icon">✅</div>
            <h3>Analysis Complete!</h3>
            <p>Finalizing your report…</p>
          </div>
        )}
      </div>
    </div>
  );
}
