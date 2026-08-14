import { useState } from "react";
import { Activity, Plus, Trash2, ExternalLink, ChevronDown } from "lucide-react";
import { useApp } from "../../context/AppContext";

const STATUS_OPTIONS = ["Applied", "Phone Screen", "Interview", "Offer", "Rejected", "Withdrawn"];
const STATUS_COLORS = {
  "Applied": "#6C63FF",
  "Phone Screen": "#f59e0b",
  "Interview": "#22c55e",
  "Offer": "#10b981",
  "Rejected": "#ef4444",
  "Withdrawn": "#6b7280",
};

const DEMO_APPS = [
  { id: 1, company: "Stripe", role: "Senior Frontend Engineer", applied: "Aug 10", status: "Interview", notes: "Technical round scheduled for Aug 15" },
  { id: 2, company: "Google", role: "Product Manager", applied: "Aug 9", status: "Phone Screen", notes: "HR call done, waiting for technical" },
  { id: 3, company: "Figma", role: "Senior UX Designer", applied: "Aug 8", status: "Applied", notes: "Applied via LinkedIn" },
  { id: 4, company: "Notion", role: "Backend Engineer", applied: "Aug 5", status: "Rejected", notes: "Not selected after coding round" },
  { id: 5, company: "OpenAI", role: "ML Engineer", applied: "Aug 3", status: "Offer", notes: "Offer received! Deciding by Aug 20" },
];

export default function TrackerPage() {
  const { addToast } = useApp();
  const [apps, setApps] = useState(DEMO_APPS);
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [newApp, setNewApp] = useState({ company: "", role: "", applied: "", status: "Applied", notes: "" });

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => ({ ...acc, [s]: apps.filter(a => a.status === s).length }), {});
  const filteredApps = filter === "All" ? apps : apps.filter(a => a.status === filter);

  function changeStatus(id, status) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    addToast({ title: "Updated", message: `Status changed to ${status}`, type: "success" });
  }

  function deleteApp(id) {
    setApps(prev => prev.filter(a => a.id !== id));
    addToast({ title: "Removed", message: "Application removed.", type: "info" });
  }

  function addApp() {
    if (!newApp.company || !newApp.role) { addToast({ title: "Required", message: "Enter company and role.", type: "warning" }); return; }
    setApps(prev => [...prev, { ...newApp, id: Date.now(), applied: newApp.applied || "Today" }]);
    setNewApp({ company: "", role: "", applied: "", status: "Applied", notes: "" });
    setShowAdd(false);
    addToast({ title: "Added!", message: `${newApp.company} application tracked.`, type: "success" });
  }

  return (
    <main className="content page-fade">
      <div className="page-header">
        <div>
          <h2 className="page-title">Application Tracker</h2>
          <p className="page-subtitle">Track all your job applications in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(s => !s)}>
          <Plus size={16} /> Add Application
        </button>
      </div>

      {/* Kanban-style status summary */}
      <div className="tracker-summary">
        {["All", ...STATUS_OPTIONS].map(s => (
          <button key={s} className={"tracker-chip" + (filter === s ? " active" : "")}
            style={filter === s && s !== "All" ? { borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] } : {}}
            onClick={() => setFilter(s)}>
            {s} <span className="tracker-count">{s === "All" ? apps.length : statusCounts[s] || 0}</span>
          </button>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 className="card-title">New Application</h3>
          <div className="form-grid">
            <div className="form-group"><label>Company</label><input className="form-input" placeholder="Google" value={newApp.company} onChange={e => setNewApp(p => ({...p, company: e.target.value}))} /></div>
            <div className="form-group"><label>Role</label><input className="form-input" placeholder="Engineer" value={newApp.role} onChange={e => setNewApp(p => ({...p, role: e.target.value}))} /></div>
            <div className="form-group"><label>Date Applied</label><input className="form-input" type="date" value={newApp.applied} onChange={e => setNewApp(p => ({...p, applied: e.target.value}))} /></div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-input" value={newApp.status} onChange={e => setNewApp(p => ({...p, status: e.target.value}))}>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}><label>Notes</label><input className="form-input" placeholder="Optional notes..." value={newApp.notes} onChange={e => setNewApp(p => ({...p, notes: e.target.value}))} /></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button className="btn btn-primary" onClick={addApp}>Add</button>
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="tracker-table">
          <thead>
            <tr>
              <th>Company</th><th>Role</th><th>Applied</th><th>Status</th><th>Notes</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No applications matching this filter.</td></tr>
            )}
            {filteredApps.map(app => (
              <tr key={app.id}>
                <td><strong>{app.company}</strong></td>
                <td>{app.role}</td>
                <td>{app.applied}</td>
                <td>
                  <select
                    className="status-select"
                    value={app.status}
                    style={{ color: STATUS_COLORS[app.status] }}
                    onChange={e => changeStatus(app.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="notes-cell">{app.notes || "—"}</td>
                <td>
                  <button className="icon-btn icon-btn-danger" onClick={() => deleteApp(app.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
