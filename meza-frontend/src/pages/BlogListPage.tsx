import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SectionLabel from "../components/ui/SectionLabel";
import ScrollReveal from "../components/ui/ScrollReveal";
import BlogCard from "../components/landing/BlogCard";
import { blogPosts } from "../data/blogPosts";

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />

      <section className="px-6 pb-8 pt-4 md:px-12">
        <SectionLabel>From the weekly journal</SectionLabel>
        <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">The journal</h1>
        <p className="mt-3 max-w-2xl text-sm text-inkMuted">
          Notes on eating well with Kenyan food: nutrition, health and budgeting.
        </p>
      </section>

      <section className="px-6 pb-20 md:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {blogPosts.map((post, i) => (
            <ScrollReveal key={post.id} delayMs={i * 120}>
              <BlogCard post={post} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}