import { useCallback, useState } from "react";
import {
  Menu, Search, Bell, Sun, Moon, ChevronDown,
  User, CreditCard, Settings, Key, LogOut, X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useClickOutside } from "../hooks/useClickOutside";
import { NOTIFICATIONS } from "../data/mockData";

export default function TopBar() {
  const {
    theme, toggleTheme,
    setSidebarOpen,
    notifOpen, setNotifOpen,
    profileOpen, setProfileOpen,
    setUpgradeModalOpen,
    addToast,
  } = useApp();

  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unreadCount = notifs.filter((n) => n.unread).length;

  const notifRef = useClickOutside(useCallback(() => setNotifOpen(false), [setNotifOpen]));
  const profileRef = useClickOutside(useCallback(() => setProfileOpen(false), [setProfileOpen]));

  function clearNotifications() {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
    addToast({ title: "Cleared", message: "All notifications marked as read.", type: "success" });
  }

  return (
    <header className="topbar">
      {/* Left */}
      <div className="topbar-left">
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="breadcrumb">
          <span className="breadcrumb-home">ResumeAI</span>
          <ChevronDown size={14} className="breadcrumb-sep" style={{ transform: "rotate(-90deg)" }} />
          <span className="breadcrumb-current">Dashboard</span>
        </div>
      </div>

      {/* Search */}
      <div className="topbar-search">
        <div className="search-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search resumes, jobs, keywords…"
          />
          <kbd className="search-kbd">⌘K</kbd>
        </div>
      </div>

      {/* Right */}
      <div className="topbar-right">
        {/* Theme toggle */}
        <button className="topbar-btn theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* Notifications */}
        <div className="notif-wrapper" ref={notifRef}>
          <button
            className="topbar-btn notif-btn"
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          <div className={`notif-panel ${notifOpen ? "open" : ""}`}>
            <div className="notif-header">
              <span>Notifications</span>
              <button onClick={clearNotifications}>Clear all</button>
            </div>
            <div className="notif-list">
              {notifs.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${n.unread ? "notif-unread" : ""}`}
                  onClick={() => setNotifs((prev) =>
                    prev.map((x) => x.id === n.id ? { ...x, unread: false } : x)
                  )}
                >
                  <div className={`notif-dot ${n.unread ? "" : "notif-dot-read"}`} />
                  <div className="notif-content">
                    <p>
                      {n.text} <strong>{n.highlight}</strong>
                      {n.suffix && ` ${n.suffix}`}
                    </p>
                    <span>{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="profile-wrapper" ref={profileRef}>
          <button
            className={`profile-btn ${profileOpen ? "open" : ""}`}
            onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
            aria-label="User profile"
          >
            <div className="avatar">AK</div>
            <div className="profile-info">
              <span className="profile-name">Akash Kumar</span>
              <span className="profile-plan">Pro Plan</span>
            </div>
            <ChevronDown size={14} className="profile-chevron" />
          </button>

          <div className={`profile-panel ${profileOpen ? "open" : ""}`}>
            <div className="profile-panel-header">
              <div className="avatar avatar-lg">AK</div>
              <div>
                <p className="pp-name">Akash Kumar</p>
                <p className="pp-email">akash@example.com</p>
                <span
                  className="pp-badge"
                  style={{ cursor: "pointer" }}
                  onClick={() => { setUpgradeModalOpen(true); setProfileOpen(false); }}
                >
                  Pro Plan (Upgrade)
                </span>
              </div>
            </div>
            <hr className="panel-divider" />
            <ul className="panel-menu">
              {[
                { icon: <User size={15} />, label: "My Profile", action: () => addToast({ title: "My Profile", message: "Profile settings opened.", type: "info" }) },
                { icon: <CreditCard size={15} />, label: "Billing & Upgrade", action: () => setUpgradeModalOpen(true) },
                { icon: <Settings size={15} />, label: "Preferences", action: () => addToast({ title: "Preferences", message: "Preferences opened.", type: "info" }) },
                { icon: <Key size={15} />, label: "API Keys", action: () => addToast({ title: "API Keys", message: "API key settings opened.", type: "info" }) },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      item.action();
                      setProfileOpen(false);
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <hr className="panel-divider" />
            <button
              className="signout-btn"
              onClick={() => {
                addToast({ title: "Signed Out", message: "You have been signed out successfully.", type: "success" });
                setProfileOpen(false);
              }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
