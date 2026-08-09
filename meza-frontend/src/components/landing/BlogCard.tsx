import type { BlogPost } from "../../types";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex flex-col border-t border-gold/15 pt-6">
      <span className="eyebrow">{post.tag}</span>
      <h3 className="mt-3 font-display text-xl text-cream transition-colors group-hover:text-gold">
        {post.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-cream/70">
        {post.excerpt}
      </p>
      <div className="mt-4 flex gap-3 font-mono text-xs uppercase tracking-wide text-muted">
        <span>{post.date}</span>
        <span aria-hidden="true">·</span>
        <span>{post.readTime}</span>
      </div>
    </article>
  );
}