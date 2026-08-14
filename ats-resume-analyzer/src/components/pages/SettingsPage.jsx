import { useState } from "react";
import { Settings, User, Bell, Shield, Palette, Zap, Save } from "lucide-react";
import { useApp } from "../../context/AppContext";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "ai", label: "AI Settings", icon: Zap },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const { addToast, theme, toggleTheme } = useApp();
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "Akash Kumar", email: "akash@example.com", phone: "", bio: "" });
  const [notifs, setNotifs] = useState({ email: true, scan: true, jobs: false, weekly: true });
  const [aiModel, setAiModel] = useState("all-MiniLM-L6-v2");

  function save() {
    addToast({ title: "Settings Saved", message: "Your preferences have been updated.", type: "success" });
  }

  return (
    <main className="content page-fade">
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings</h2>
          <p className="page-subtitle">Manage your account, preferences, and AI configuration.</p>
        </div>
        <button className="btn btn-primary" onClick={save}><Save size={16} /> Save Changes</button>
      </div>

      <div className="settings-grid">
        {/* Sidebar tabs */}
        <div className="settings-tabs">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} className={"settings-tab" + (tab === t.id ? " active" : "")} onClick={() => setTab(t.id)}>
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="settings-content">
          {tab === "profile" && (
            <div className="card">
              <h3 className="card-title">Profile Information</h3>
              <div className="avatar-upload">
                <div className="avatar-circle">{profile.name[0]}</div>
                <button className="btn btn-ghost btn-sm" onClick={() => addToast({ title: "Avatar", message: "Avatar upload coming soon.", type: "info" })}>Change Photo</button>
              </div>
              <div className="form-grid" style={{ marginTop: 20 }}>
                <div className="form-group"><label>Full Name</label><input className="form-input" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} /></div>
                <div className="form-group"><label>Email</label><input className="form-input" type="email" value={profile.email} onChange={e => setProfile(p => ({...p, email: e.target.value}))} /></div>
                <div className="form-group"><label>Phone <span className="optional-badge">Optional</span></label><input className="form-input" placeholder="+1 (555) 000-0000" value={profile.phone} onChange={e => setProfile(p => ({...p, phone: e.target.value}))} /></div>
                <div className="form-group" style={{ gridColumn: "1/-1" }}>
                  <label>Bio <span className="optional-badge">Optional</span></label>
                  <textarea className="jd-textarea" rows={3} placeholder="Tell us about yourself..." value={profile.bio} onChange={e => setProfile(p => ({...p, bio: e.target.value}))} />
                </div>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="card">
              <h3 className="card-title">Notification Preferences</h3>
              {[
                { id: "email", label: "Email Notifications", desc: "Receive updates via email" },
                { id: "scan", label: "Scan Alerts", desc: "Get notified when a scan completes" },
                { id: "jobs", label: "New Job Matches", desc: "Daily digest of matching jobs" },
                { id: "weekly", label: "Weekly Summary", desc: "Weekly performance report" },
              ].map(n => (
                <div key={n.id} className="section-toggle" style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: 2 }}>{n.label}</p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{n.desc}</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={notifs[n.id]} onChange={() => setNotifs(p => ({ ...p, [n.id]: !p[n.id] }))} />
                    <span className="toggle-thumb" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {tab === "appearance" && (
            <div className="card">
              <h3 className="card-title">Appearance</h3>
              <div className="section-toggle" style={{ padding: "14px 0" }}>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 2 }}>Dark Mode</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>Toggle between light and dark theme</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
                  <span className="toggle-thumb" />
                </label>
              </div>
              <div style={{ marginTop: 20 }}>
                <p style={{ fontWeight: 600, marginBottom: 12 }}>Accent Color</p>
                <div style={{ display: "flex", gap: 12 }}>
                  {["#6C63FF", "#a855f7", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6"].map(c => (
                    <button key={c} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: "3px solid transparent", cursor: "pointer" }}
                      onClick={() => addToast({ title: "Accent Color", message: "Color customization coming soon.", type: "info" })} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "ai" && (
            <div className="card">
              <h3 className="card-title">AI Model Configuration</h3>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>Embedding Model</label>
                <select className="form-input" value={aiModel} onChange={e => setAiModel(e.target.value)}>
                  <option value="all-MiniLM-L6-v2">all-MiniLM-L6-v2 (Fast)</option>
                  <option value="all-mpnet-base-v2">all-mpnet-base-v2 (Accurate)</option>
                  <option value="paraphrase-multilingual">paraphrase-multilingual (Multilingual)</option>
                </select>
                <p className="form-hint">Used for resume ↔ job description semantic matching.</p>
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>LLM Provider</label>
                <select className="form-input">
                  <option>Gemini (Google)</option>
                  <option>OpenAI GPT-4</option>
                  <option>Local (Ollama)</option>
                </select>
                <p className="form-hint">Used for generating strengths, feedback, and recommendations.</p>
              </div>
              <div className="form-group">
                <label>Gemini API Key</label>
                <input className="form-input" type="password" placeholder="AIza..." />
                <p className="form-hint">Your API key is stored locally and never shared.</p>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="card">
              <h3 className="card-title">Security</h3>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label>Current Password</label>
                <input className="form-input" type="password" placeholder="••••••••" />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label>New Password</label>
                <input className="form-input" type="password" placeholder="••••••••" />
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>Confirm Password</label>
                <input className="form-input" type="password" placeholder="••••••••" />
              </div>
              <button className="btn btn-primary" onClick={() => addToast({ title: "Password Updated", message: "Your password has been changed.", type: "success" })}>
                Update Password
              </button>
              <div style={{ marginTop: 32, padding: "20px", background: "rgba(239,68,68,0.08)", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)" }}>
                <h4 style={{ color: "#ef4444", marginBottom: 8 }}>Danger Zone</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 12 }}>Permanently delete your account and all data.</p>
                <button className="btn" style={{ background: "#ef4444", color: "#fff" }}
                  onClick={() => addToast({ title: "Account Deletion", message: "Please contact support to delete your account.", type: "warning" })}>
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
