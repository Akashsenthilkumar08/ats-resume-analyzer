import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AppContext = createContext(null);

let toastId = 0;

export function AppProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [toasts, setToasts] = useState([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [scanOverlayOpen, setScanOverlayOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Sync theme to html element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const addToast = useCallback(({ message, title, type = "info", duration = 4000 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 350);
    }, duration);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  }, []);

  const value = {
    theme,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen,
    activePage,
    setActivePage,
    toasts,
    addToast,
    dismissToast,
    uploadModalOpen,
    setUploadModalOpen,
    scanOverlayOpen,
    setScanOverlayOpen,
    upgradeModalOpen,
    setUpgradeModalOpen,
    notifOpen,
    setNotifOpen,
    profileOpen,
    setProfileOpen,
    isSubscribed,
    setIsSubscribed,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
