export const NAV_ITEMS = [
  {
    section: "Main",
    links: [
      { id: "dashboard", label: "Dashboard", icon: "LayoutGrid", badge: "New" },
      { id: "scanner",   label: "Resume Scanner", icon: "ScanLine" },
      { id: "resumes",   label: "My Resumes",     icon: "FileText", count: 3 },
      { id: "jobs",      label: "Job Matches",    icon: "Briefcase", count: 12 },
    ],
  },
  {
    section: "Tools",
    links: [
      { id: "optimizer", label: "Resume Optimizer", icon: "Sparkles" },
      { id: "keywords",  label: "Keywords",         icon: "Tags" },
      { id: "builder",   label: "Resume Builder",   icon: "PenLine" },
      { id: "cover",     label: "Cover Letter",     icon: "MessageSquare" },
    ],
  },
  {
    section: "Track",
    links: [
      { id: "tracker",  label: "Application Tracker", icon: "Activity", count: 5 },
      { id: "settings", label: "Settings",             icon: "Settings" },
    ],
  },
];

export const STATS = [
  {
    id: "scanned",
    label: "Resumes Scanned",
    value: 24,
    suffix: "",
    change: "+3 this week",
    trend: "up",
    icon: "ScanLine",
    color: "purple",
  },
  {
    id: "score",
    label: "Avg Match Score",
    value: 78,
    suffix: "%",
    change: "+5% from last month",
    trend: "up",
    icon: "CheckCircle2",
    color: "green",
  },
  {
    id: "jobs",
    label: "Jobs Matched",
    value: 12,
    suffix: "",
    change: "+4 new matches",
    trend: "up",
    icon: "Briefcase",
    color: "blue",
  },
  {
    id: "improvements",
    label: "Improvements Made",
    value: 47,
    suffix: "",
    change: "+8 this week",
    trend: "up",
    icon: "Sparkles",
    color: "orange",
  },
];

export const RECENT_SCANS = [
  {
    id: 1,
    name: "Software_Engineer_v3.pdf",
    ext: "PDF",
    jobTitle: "Senior Frontend Engineer",
    company: "Stripe",
    score: 91,
    date: "Aug 10, 2026",
  },
  {
    id: 2,
    name: "Product_Manager_Resume.pdf",
    ext: "PDF",
    jobTitle: "Product Manager",
    company: "Google",
    score: 87,
    date: "Aug 9, 2026",
  },
  {
    id: 3,
    name: "UX_Designer_Portfolio.docx",
    ext: "DOC",
    jobTitle: "Senior UX Designer",
    company: "Figma",
    score: 73,
    date: "Aug 8, 2026",
  },
  {
    id: 4,
    name: "Backend_Engineer_v2.pdf",
    ext: "PDF",
    jobTitle: "Backend Engineer",
    company: "Notion",
    score: 58,
    date: "Aug 7, 2026",
  },
  {
    id: 5,
    name: "Data_Scientist_Resume.pdf",
    ext: "PDF",
    jobTitle: "ML Engineer",
    company: "OpenAI",
    score: 82,
    date: "Aug 6, 2026",
  },
];

export const ACTIVITIES = [
  {
    id: 1,
    icon: "🔍",
    bg: "purple",
    title: "Resume scanned",
    desc: "Software_Engineer_v3.pdf vs Stripe JD",
    time: "2 minutes ago",
  },
  {
    id: 2,
    icon: "📈",
    bg: "green",
    title: "Match score improved",
    desc: "Product_Manager_Resume.pdf +12%",
    time: "1 hour ago",
  },
  {
    id: 3,
    icon: "💼",
    bg: "blue",
    title: "New job matched",
    desc: "Product Manager at Stripe — 87% match",
    time: "3 hours ago",
  },
  {
    id: 4,
    icon: "✏️",
    bg: "orange",
    title: "Resume updated",
    desc: "UX_Designer_Portfolio.docx — 5 changes",
    time: "Yesterday",
  },
  {
    id: 5,
    icon: "⭐",
    bg: "yellow",
    title: "Keyword optimized",
    desc: "Added 8 missing ATS keywords",
    time: "2 days ago",
  },
];

export const NOTIFICATIONS = [
  {
    id: 1,
    unread: true,
    text: "Your resume matched 87% for",
    highlight: "Senior Designer at Google",
    time: "2 min ago",
  },
  {
    id: 2,
    unread: true,
    text: "AI optimization complete —",
    highlight: "+12% score improvement",
    time: "1 hour ago",
  },
  {
    id: 3,
    unread: true,
    text: "New job match found:",
    highlight: "Product Manager at Stripe",
    time: "3 hours ago",
  },
  {
    id: 4,
    unread: false,
    text: "Resume",
    highlight: "Software_Engineer_v2.pdf",
    time: "Yesterday",
    suffix: "uploaded successfully",
  },
];
