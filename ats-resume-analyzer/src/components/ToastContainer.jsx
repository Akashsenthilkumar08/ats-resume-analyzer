import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const CONFIG = {
  success: { Icon: CheckCircle,    label: "Success", color: "var(--green)" },
  error:   { Icon: XCircle,        label: "Error",   color: "var(--red)"   },
  info:    { Icon: Info,            label: "Info",    color: "var(--blue)"  },
  warning: { Icon: AlertTriangle,   label: "Warning", color: "var(--orange)"},
};

function Toast({ toast }) {
  const { dismissToast } = useApp();
  const { Icon } = CONFIG[toast.type] || CONFIG.info;

  return (
    <div className={`toast toast-${toast.type} ${toast.dismissing ? "dismissing" : ""}`}>
      <div className="toast-icon">
        <Icon size={17} style={{ color: CONFIG[toast.type]?.color }} />
      </div>
      <div className="toast-body">
        {toast.title && <p className="toast-title">{toast.title}</p>}
        {toast.message && <p className="toast-msg">{toast.message}</p>}
      </div>
      <button className="toast-close" onClick={() => dismissToast(toast.id)}>
        <X size={13} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}
