import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import DashboardShowcase from "@/components/home/DashBoardShowcase";
import VoiceAnalyticsStory from "@/components/home/VoiceAnalyticsStory";
import MorningBriefingStory from "@/components/home/MorningBriefingStory";


export default function Home() {
  return (
    <main
      className="
        min-h-screen
        bg-black
        text-white
        overflow-x-hidden
      "
    >

      {/* Navbar */}
      <Navbar />


      {/* Hero */}
      <Hero />


      {/* Dashboard Preview Animation */}
      <DashboardShowcase />


      {/* AI Analytics Story */}
      <VoiceAnalyticsStory />


      {/* Morning Briefing Scroll Story */}
      <MorningBriefingStory />


    </main>
  );
}