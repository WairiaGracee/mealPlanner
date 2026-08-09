import { blogPosts } from "../../data/blogPosts";
import SectionLabel from "../ui/SectionLabel";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";
import BlogCard from "./BlogCard";

export default function BlogPreview() {
  return (
    <section id="blog" className="px-6 pt-15 pb-20 md:px-12">
      <div className="flex items-end justify-between">
        <SectionLabel>From the weekly journal</SectionLabel>
        <Button variant="ghost" className="hidden px-0 sm:inline-flex">
          View all posts →
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {blogPosts.map((post, i) => (
          <ScrollReveal key={post.id} delayMs={i * 120}>
            <BlogCard post={post} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}