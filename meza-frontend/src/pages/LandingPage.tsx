import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/landing/Hero";
import SampleMealPlans from "../components/landing/SampleMealPlans";
import ImpactStats from "../components/landing/ImpactStats";
import ThreePhoneShowcase from "../components/landing/ThreePhoneShowCase";
import HowItWorks from "../components/landing/HowItWorks";
import BlogPreview from "../components/landing/BlogPreview";
import Testimonials from "../components/landing/Testimonials";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />
      <Hero />
      <SampleMealPlans />
      <ImpactStats />
      <ThreePhoneShowcase />
      <HowItWorks />
      <Testimonials />
      <BlogPreview />
      <Footer />
    </div>
  );
}