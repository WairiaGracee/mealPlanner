import { blogPosts } from "../../data/blogPosts";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";
import BlogCard from "./BlogCard";

export default function BlogPreview() {
  const navigate = useNavigate();
  return (
    <section id="blog" className="bg-offwhite px-6 py-20 md:px-12">
      <div className="flex items-end justify-between">
        <h2 className="mt-4 font-display text-4xl text-forest-deep md:text-5xl text-center">
            From The Weekly Journal
        </h2>
        <Button variant="ghost" className="hidden px-0 sm:inline-flex" onClick={() => navigate("/blog")}>
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