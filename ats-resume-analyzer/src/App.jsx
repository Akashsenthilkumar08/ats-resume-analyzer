import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./components/Dashboard";
import ScannerPage from "./components/pages/ScannerPage";
import ResumesPage from "./components/pages/ResumesPage";
import JobsPage from "./components/pages/JobsPage";
import OptimizerPage from "./components/pages/OptimizerPage";
import KeywordsPage from "./components/pages/KeywordsPage";
import BuilderPage from "./components/pages/BuilderPage";
import CoverLetterPage from "./components/pages/CoverLetterPage";
import TrackerPage from "./components/pages/TrackerPage";
import SettingsPage from "./components/pages/SettingsPage";
import ToastContainer from "./components/ToastContainer";
import UploadModal from "./components/UploadModal";
import ScanOverlay from "./components/ScanOverlay";
import "../../ats-dashboard/styles.css";

const PAGE_MAP = {
  dashboard:  <Dashboard />,
  scanner:    <ScannerPage />,
  resumes:    <ResumesPage />,
  jobs:       <JobsPage />,
  optimizer:  <OptimizerPage />,
  keywords:   <KeywordsPage />,
  builder:    <BuilderPage />,
  cover:      <CoverLetterPage />,
  tracker:    <TrackerPage />,
  settings:   <SettingsPage />,
};

function AppContent() {
  const { activePage } = useApp();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-wrapper">
        <TopBar />
        {PAGE_MAP[activePage] ?? <Dashboard />}
      </div>
      <ToastContainer />
      <UploadModal />
      <ScanOverlay />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
