import {
  LayoutGrid, ScanLine, FileText, Briefcase,
  Sparkles, Tags, PenLine, MessageSquare,
  Activity, Settings, X, ChevronRight, Zap,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { NAV_ITEMS } from "../data/mockData";

const ICONS = {
  LayoutGrid, ScanLine, FileText, Briefcase,
  Sparkles, Tags, PenLine, MessageSquare,
  Activity, Settings,
};

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, activePage, setActivePage, setUpgradeModalOpen } = useApp();

  function handleNav(id) {
    setActivePage(id);
    setSidebarOpen(false);
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="10" fill="url(#lg1)" />
                <path d="M8 10h16M8 16h10M8 22h13" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="23" cy="21" r="4" fill="#fff" opacity=".9" />
                <path d="M21.5 21l1 1 2-2" stroke="#6C63FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="lg1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6C63FF" />
                    <stop offset="1" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">ResumeAI</span>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((section) => (
            <div className="nav-section" key={section.section}>
              <span className="nav-section-label">{section.section}</span>
              <ul>
                {section.links.map((link) => {
                  const Icon = ICONS[link.icon];
                  const isActive = activePage === link.id;
                  return (
                    <li key={link.id}>
                      <button
                        className={`nav-link ${isActive ? "active" : ""}`}
                        onClick={() => handleNav(link.id)}
                      >
                        <span className="nav-icon">
                          {Icon && <Icon size={17} />}
                        </span>
                        <span className="nav-label">{link.label}</span>
                        {link.badge && (
                          <span className="nav-badge">{link.badge}</span>
                        )}
                        {link.count != null && (
                          <span className="nav-count">{link.count}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer Upgrade Card */}
        <div className="sidebar-footer">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Zap size={18} />
            </div>
            <div className="upgrade-text">
              <strong>Upgrade to Pro</strong>
              <span>Unlimited scans & AI features</span>
            </div>
            <button
              className="upgrade-btn"
              onClick={() => setUpgradeModalOpen(true)}
            >
              Upgrade
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
