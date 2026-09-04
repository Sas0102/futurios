import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import DashboardShowcase from "@/components/home/DashBoardShowcase";
import VoiceAnalyticsStory from "@/components/home/VoiceAnalyticsStory";
import VideoHeroFeatureCard from "@/components/home/VideoHeroFeatureCard";



export default function Home() {
  return (
    <main
      className="
        min-h-screen
        bg-black
        text-white
        overflow-x-clip
      "
    >

      {/* Navbar */}
      <Navbar />


      {/* Hero */}
      <Hero />


      {/* Dashboard Preview Animation */}
      <DashboardShowcase />



      {/* AI Analytics Story  */}          
      <VoiceAnalyticsStory />
      


      {/* Video Hero Feature Card */}
      <VideoHeroFeatureCard  />




    </main>
  );
}
