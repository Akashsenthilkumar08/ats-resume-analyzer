import { useEffect, useState } from "react";
import {
  ScanLine, CheckCircle2, Briefcase, Sparkles, TrendingUp,
} from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";
import { STATS } from "../data/mockData";

const ICONS = { ScanLine, CheckCircle2, Briefcase, Sparkles };

const COLOR_CLASSES = {
  purple: "stat-icon-purple",
  green:  "stat-icon-green",
  blue:   "stat-icon-blue",
  orange: "stat-icon-orange",
};

function StatCard({ stat, index }) {
  const [loaded, setLoaded] = useState(false);
  const count = useCountUp(stat.value, 1500, 300 + index * 120);
  const Icon = ICONS[stat.icon];

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600 + index * 100);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div className={`stat-card skeleton-wrapper ${loaded ? "loaded" : ""}`}>
      <div className="skeleton-overlay" />
      <div className={`stat-icon ${COLOR_CLASSES[stat.color]}`}>
        {Icon && <Icon size={20} />}
      </div>
      <div className="stat-body">
        <span className="stat-label">{stat.label}</span>
        <div className="stat-value-row">
          <span className="stat-value">{count}</span>
          {stat.suffix && <span className="stat-suffix">{stat.suffix}</span>}
        </div>
        <span className={`stat-change ${stat.trend === "up" ? "stat-up" : "stat-down"}`}>
          <TrendingUp size={11} style={{ display: "inline", marginRight: 4 }} />
          {stat.change}
        </span>
      </div>
    </div>
  );
}

export default function StatsGrid() {
  return (
    <section className="stats-grid">
      {STATS.map((stat, i) => (
        <StatCard key={stat.id} stat={stat} index={i} />
      ))}
    </section>
  );
}
