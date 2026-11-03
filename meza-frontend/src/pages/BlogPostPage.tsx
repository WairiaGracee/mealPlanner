import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import SectionLabel from "../components/ui/SectionLabel";
import BlogCard from "../components/landing/BlogCard";
import { blogPosts } from "../data/blogPosts";

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-offwhite">
        <Navbar />
        <section className="mx-auto max-w-xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-ink">We couldn't find that post</h1>
          <p className="mt-3 text-sm text-inkMuted">It may have moved or been removed.</p>
          <Button className="mt-6" onClick={() => navigate("/blog")}>
            See all posts
          </Button>
        </section>
        <Footer />
      </div>
    );
  }

  const others = blogPosts.filter((p) => p.id !== post.id);

  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />

      <article className="mx-auto max-w-3xl px-6 pb-16 pt-4 md:px-12">
        <button
          onClick={() => navigate("/blog")}
          className="text-sm text-inkMuted transition-colors hover:text-forest"
        >
          ← All posts
        </button>

        <div className="mt-6">
          <SectionLabel>{post.tag}</SectionLabel>
        </div>
        <h1 className="mt-4 font-display text-3xl leading-tight text-ink md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-wide text-inkMuted/70">
          {post.date} · {post.readTime}
        </p>

        {post.image && (
          <img
            src={post.image}
            alt=""
            className="mt-8 h-64 w-full rounded-2xl object-cover md:h-96"
          />
        )}

        <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-ink/85">
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <p className="mt-10 border-t border-line pt-5 text-xs text-inkMuted">
          This article is general information, not medical advice. If you have a health
          condition, please talk to your doctor or a dietitian.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button onClick={() => navigate("/register")}>Get your weekly plan</Button>
          <Button variant="outline" onClick={() => navigate("/blog")}>
            Read more posts
          </Button>
        </div>
      </article>

      {others.length > 0 && (
        <section className="px-6 pb-20 md:px-12">
          <h2 className="font-display text-2xl text-ink">More from the journal</h2>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            {others.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}