import { useApp } from "../context/AppContext";
import { ACTIVITIES } from "../data/mockData";

const BG_COLORS = {
  purple: "rgba(108,99,255,0.15)",
  green:  "rgba(34,197,94,0.15)",
  blue:   "rgba(59,130,246,0.15)",
  orange: "rgba(249,115,22,0.15)",
  yellow: "rgba(234,179,8,0.15)",
};

export default function ActivityFeed() {
  const { addToast } = useApp();

  return (
    <div className="card activity-card">
      <div className="card-header">
        <div className="card-title-group">
          <h2 className="card-title">Recent Activity</h2>
          <span className="card-subtitle">What's been happening</span>
        </div>
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => addToast({ title: "Activity", message: "Full activity log coming soon.", type: "info" })}
        >
          See all
        </button>
      </div>

      <ul className="activity-list">
        {ACTIVITIES.map((item, i) => (
          <li
            key={item.id}
            className="activity-item"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div
              className="activity-icon"
              style={{ background: BG_COLORS[item.bg] || BG_COLORS.purple }}
            >
              {item.icon}
            </div>
            <div className="activity-body">
              <p className="activity-title">{item.title}</p>
              <p className="activity-desc">{item.desc}</p>
            </div>
            <span className="activity-time">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
