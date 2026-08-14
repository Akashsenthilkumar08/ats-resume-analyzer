import HeroCard from "./HeroCard";
import StatsGrid from "./StatsGrid";
import RecentScans from "./RecentScans";
import ActivityFeed from "./ActivityFeed";
import QuickActions from "./QuickActions";

export default function Dashboard() {
  return (
    <main className="content">
      <HeroCard />
      <StatsGrid />
      <section className="two-col-grid">
        <RecentScans />
        <div className="right-col">
          <ActivityFeed />
        </div>
      </section>
      <QuickActions />
    </main>
  );
}
