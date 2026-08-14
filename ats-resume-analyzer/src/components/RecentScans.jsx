import { RefreshCw, ExternalLink, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";
import { RECENT_SCANS } from "../data/mockData";

function ScoreBadge({ score }) {
  if (score >= 80) return <span className="score-badge score-badge-high">▲ {score}%</span>;
  if (score >= 65) return <span className="score-badge score-badge-mid">▲ {score}%</span>;
  return <span className="score-badge score-badge-low">▼ {score}%</span>;
}

export default function RecentScans() {
  const { addToast } = useApp();

  return (
    <div className="card recent-scans-card">
      <div className="card-header">
        <div className="card-title-group">
          <h2 className="card-title">Recent Resume Scans</h2>
          <span className="card-subtitle">Your latest analysis results</span>
        </div>
        <div className="card-actions">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => addToast({ title: "Refreshed", message: "Scan data refreshed.", type: "info" })}
          >
            <RefreshCw size={13} />
            Refresh
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => addToast({ title: "Scans", message: "Full scan history coming soon.", type: "info" })}
          >
            View All
          </button>
        </div>
      </div>

      <div className="scan-table-wrap">
        <table className="scan-table">
          <thead>
            <tr>
              <th>Resume</th>
              <th>Position</th>
              <th>Match</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_SCANS.map((scan) => (
              <tr key={scan.id}>
                <td>
                  <div className="scan-resume-name">
                    <div className="resume-thumb">
                      <FileText size={12} />
                    </div>
                    <div className="resume-name-col">
                      <span className="resume-filename">{scan.name}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="scan-job">{scan.jobTitle}</div>
                  <div className="scan-company">{scan.company}</div>
                </td>
                <td><ScoreBadge score={scan.score} /></td>
                <td><span className="scan-date">{scan.date}</span></td>
                <td>
                  <button
                    className="btn-report"
                    onClick={() =>
                      addToast({
                        title: "View Report",
                        message: `Opening report for ${scan.name}`,
                        type: "info",
                      })
                    }
                  >
                    <ExternalLink size={11} style={{ display: "inline", marginRight: 4 }} />
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
