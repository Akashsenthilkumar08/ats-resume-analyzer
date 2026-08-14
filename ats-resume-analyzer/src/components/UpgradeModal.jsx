import { useState, useEffect } from "react";
import { X, CheckCircle2, QrCode, Clock, ShieldCheck, RefreshCw, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";

const PLANS = [
  {
    id: "classic",
    name: "Classic Offer",
    price: "$20",
    period: "/month",
    inr: "₹1,650",
    desc: "Essential AI scan & optimization tools for job seekers.",
    features: [
      "20 Resume Scans per month",
      "Basic ATS Match & Keyword Analysis",
      "Standard AI Feedback",
      "Email Support"
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "$100",
    period: "/month",
    inr: "₹8,250",
    desc: "Full AI power with unlimited scans & cover letter generator.",
    features: [
      "Unlimited Resume Scans",
      "Advanced Sentence-Transformers Matching",
      "AI Cover Letter & Bullet Rewriter",
      "Application Tracker & Job Matcher",
      "Priority 24/7 Support"
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$200",
    period: "/month",
    inr: "₹16,500",
    desc: "For teams, agencies & high-volume recruiters.",
    features: [
      "Everything in Pro Plan",
      "Multi-user Team Access (10 Seats)",
      "Custom API Access & Integrations",
      "Dedicated Account Manager",
      "Custom AI Fine-tuning"
    ],
    popular: false,
  }
];

export default function UpgradeModal() {
  const { upgradeModalOpen, setUpgradeModalOpen, addToast } = useApp();
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]); // Default to Pro ($100)
  const [paymentStep, setPaymentStep] = useState("select"); // "select" | "qr"
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes (120 sec)
  const [timerActive, setTimerActive] = useState(false);

  // Handle 2-minute countdown
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  function close() {
    setUpgradeModalOpen(false);
    setPaymentStep("select");
    setTimerActive(false);
    setTimeLeft(120);
  }

  function startPayment(plan) {
    setSelectedPlan(plan);
    setPaymentStep("qr");
    setTimeLeft(120);
    setTimerActive(true);
  }

  function restartTimer() {
    setTimeLeft(120);
    setTimerActive(true);
    addToast({ title: "Timer Reset", message: "QR Code validity renewed for 2 minutes.", type: "info" });
  }

  function handleVerifyPayment() {
    close();
    addToast({
      title: "Payment Submitted!",
      message: `Your subscription to ${selectedPlan.name} (${selectedPlan.price}/mo) is being verified.`,
      type: "success"
    });
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  if (!upgradeModalOpen) return null;

  return (
    <div className={`modal-backdrop ${upgradeModalOpen ? "open" : ""}`} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="modal upgrade-modal-card" style={{ maxWidth: paymentStep === "qr" ? "520px" : "900px" }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="stat-icon stat-icon-purple" style={{ width: 36, height: 36 }}>
              <Zap size={20} />
            </div>
            <div>
              <h3 className="card-title" style={{ fontSize: "1.15rem" }}>
                {paymentStep === "qr" ? `Pay for ${selectedPlan.name}` : "Upgrade Your Plan"}
              </h3>
              <p className="card-desc" style={{ marginBottom: 0 }}>
                {paymentStep === "qr"
                  ? `Scan PhonePe QR code to complete your ${selectedPlan.price} payment.`
                  : "Unlock full AI resume analysis, optimization, and unlimited scans."}
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={close} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">

          {/* STEP 1: PLAN SELECTOR */}
          {paymentStep === "select" && (
            <div className="pricing-grid">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`pricing-card card ${plan.popular ? "popular" : ""}`}
                >
                  {plan.popular && <span className="popular-tag">Most Popular</span>}
                  
                  <h4 className="plan-name">{plan.name}</h4>
                  <p className="plan-desc">{plan.desc}</p>

                  <div className="plan-price-row">
                    <span className="plan-price">{plan.price}</span>
                    <span className="plan-period">{plan.period}</span>
                  </div>
                  <span className="plan-inr">Approx. {plan.inr} / month</span>

                  <ul className="plan-features">
                    {plan.features.map((feat, i) => (
                      <li key={i}>
                        <CheckCircle2 size={15} style={{ color: "var(--brand-light)", flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`btn ${plan.popular ? "btn-primary" : "btn-ghost"}`}
                    style={{ width: "100%", marginTop: "auto" }}
                    onClick={() => startPayment(plan)}
                  >
                    <QrCode size={16} />
                    Scan &amp; Pay {plan.price}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* STEP 2: PHONEPE QR CODE PAYMENT WITH 2-MIN TIMER */}
          {paymentStep === "qr" && (
            <div className="qr-payment-container">
              
              {/* Plan Summary Banner */}
              <div className="qr-plan-summary">
                <div>
                  <strong style={{ fontSize: "1rem" }}>{selectedPlan.name}</strong>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
                    Subscription Plan
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="qr-amount">{selectedPlan.price}</span>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                    ({selectedPlan.inr})
                  </p>
                </div>
              </div>

              {/* Countdown Timer Badge */}
              <div className={`qr-timer-badge ${timeLeft === 0 ? "expired" : ""}`}>
                <Clock size={16} />
                <span>
                  {timeLeft > 0 ? `QR Code valid for: ${formattedTime}` : "⚠️ QR Code Expired (2 min limit)"}
                </span>
              </div>

              {/* QR Image Box */}
              <div className="qr-image-wrapper">
                {timeLeft > 0 ? (
                  <img
                    src="/qr_code.png"
                    alt="PhonePe Payment QR Code"
                    className="qr-code-img"
                  />
                ) : (
                  <div className="qr-expired-overlay">
                    <p style={{ fontWeight: 700, color: "#ef4444", marginBottom: 8 }}>QR Code Expired</p>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 16 }}>
                      The 2-minute payment window has passed.
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={restartTimer}>
                      <RefreshCw size={14} /> Refresh QR Code
                    </button>
                  </div>
                )}
              </div>

              <div className="qr-instructions">
                <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 4 }}>
                  Scan &amp; Pay Using PhonePe / Any UPI App
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                  Open PhonePe, Google Pay, or Paytm → Scan QR → Complete Payment
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 16, width: "100%" }}>
                <button className="btn btn-ghost" onClick={() => setPaymentStep("select")}>
                  ← Back to Plans
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleVerifyPayment}
                  disabled={timeLeft === 0}
                >
                  <ShieldCheck size={16} /> I Have Paid {selectedPlan.price}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
