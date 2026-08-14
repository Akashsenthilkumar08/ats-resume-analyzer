import { useState } from "react";
import { Briefcase, ExternalLink, Heart, Star } from "lucide-react";
import { useApp } from "../../context/AppContext";

const DEMO_JOBS = [
  { id: 1, title: "Senior Frontend Engineer", company: "Stripe", location: "Remote", salary: "$150k–$190k", match: 91, tags: ["React", "TypeScript", "GraphQL"], saved: false },
  { id: 2, title: "Product Manager", company: "Google", location: "NYC", salary: "$140k–$180k", match: 87, tags: ["Product", "Agile", "Data"], saved: true },
  { id: 3, title: "Senior UX Designer", company: "Figma", location: "San Francisco", salary: "$130k–$170k", match: 73, tags: ["Figma", "Prototyping", "Research"], saved: false },
  { id: 4, title: "Backend Engineer", company: "Notion", location: "Hybrid", salary: "$120k–$160k", match: 58, tags: ["Node.js", "PostgreSQL", "Docker"], saved: false },
  { id: 5, title: "ML Engineer", company: "OpenAI", location: "Remote", salary: "$180k–$220k", match: 82, tags: ["Python", "PyTorch", "NLP"], saved: true },
  { id: 6, title: "DevOps Engineer", company: "Netflix", location: "Remote", salary: "$145k–$185k", match: 65, tags: ["AWS", "Kubernetes", "CI/CD"], saved: false },
  { id: 7, title: "Data Scientist", company: "Airbnb", location: "San Francisco", salary: "$135k–$175k", match: 79, tags: ["Python", "SQL", "ML"], saved: false },
  { id: 8, title: "Full Stack Engineer", company: "Vercel", location: "Remote", salary: "$125k–$165k", match: 88, tags: ["Next.js", "React", "TypeScript"], saved: false },
  { id: 9, title: "iOS Engineer", company: "Apple", location: "Cupertino", salary: "$155k–$195k", match: 44, tags: ["Swift", "SwiftUI", "Xcode"], saved: false },
  { id: 10, title: "Platform Engineer", company: "Cloudflare", location: "Remote", salary: "$140k–$180k", match: 71, tags: ["Go", "Rust", "Networking"], saved: false },
  { id: 11, title: "Growth Engineer", company: "Linear", location: "Remote", salary: "$120k–$160k", match: 85, tags: ["React", "Analytics", "A/B Testing"], saved: false },
  { id: 12, title: "Security Engineer", company: "GitHub", location: "Remote", salary: "$150k–$190k", match: 60, tags: ["Security", "Go", "Python"], saved: false },
];

const scoreColor = (s) => s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";
const scoreLabel = (s) => s >= 80 ? "Excellent" : s >= 60 ? "Good" : "Low";

export default function JobsPage() {
  const { addToast } = useApp();
  const [jobs, setJobs] = useState(DEMO_JOBS);
  const [filter, setFilter] = useState("all");

  function toggleSave(id) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, saved: !j.saved } : j));
    const job = jobs.find(j => j.id === id);
    addToast({ title: job?.saved ? "Removed" : "Saved!", message: job?.title, type: job?.saved ? "info" : "success" });
  }

  const filtered = filter === "saved" ? jobs.filter(j => j.saved) : filter === "high" ? jobs.filter(j => j.match >= 80) : jobs;

  return (
    <main className="content page-fade">
      <div className="page-header">
        <div>
          <h2 className="page-title">Job Matches</h2>
          <p className="page-subtitle">AI-matched job opportunities based on your resume profile.</p>
        </div>
        <div className="filter-tabs">
          {["all", "high", "saved"].map(f => (
            <button key={f} className={"filter-tab" + (filter === f ? " active" : "")} onClick={() => setFilter(f)}>
              {f === "all" ? `All (${jobs.length})` : f === "high" ? "High Match" : "Saved"}
            </button>
          ))}
        </div>
      </div>

      <div className="jobs-grid">
        {filtered.map(job => (
          <div key={job.id} className="job-card card">
            <div className="job-card-top">
              <div className="company-avatar">{job.company[0]}</div>
              <div className="job-info">
                <h3 className="job-title">{job.title}</h3>
                <p className="job-meta">{job.company} · {job.location}</p>
              </div>
              <button className={"icon-btn" + (job.saved ? " saved-btn" : "")} onClick={() => toggleSave(job.id)}>
                <Heart size={16} fill={job.saved ? "currentColor" : "none"} />
              </button>
            </div>
            <p className="job-salary">{job.salary}</p>
            <div className="job-match-bar">
              <div className="job-match-fill" style={{ width: `${job.match}%`, background: scoreColor(job.match) }} />
            </div>
            <div className="job-card-footer">
              <span className="match-label" style={{ color: scoreColor(job.match) }}>
                {job.match}% — {scoreLabel(job.match)}
              </span>
              <div className="tag-cloud">
                {job.tags.map(t => <span className="chip chip-sm chip-purple" key={t}>{t}</span>)}
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, width: "100%" }}
              onClick={() => addToast({ title: "Opening…", message: `${job.title} at ${job.company}`, type: "info" })}>
              <ExternalLink size={14} /> View Job
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
