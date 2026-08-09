import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/landing/Hero";
import SampleMealPlans from "../components/landing/SampleMealPlans";
import ImpactStats from "../components/landing/ImpactStats";
import TabbedShowcase from "../components/landing/TabbedShowcase";
import HowItWorks from "../components/landing/HowItWorks";
import BlogPreview from "../components/landing/BlogPreview";
import Testimonials from "../components/landing/Testimonials";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <Hero />
      <SampleMealPlans />
      <ImpactStats />
      <TabbedShowcase />
      <HowItWorks />
      <Testimonials />
      <BlogPreview />
      <Footer />
    </div>
  );
}