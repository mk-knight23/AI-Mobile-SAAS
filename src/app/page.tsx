import { Header } from "@/components/layout/header";
import { LandingHero } from "@/components/home/landing-hero";
import { RecentProjects } from "@/components/home/recent-projects";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <LandingHero />
      <RecentProjects />
    </main>
  );
}
