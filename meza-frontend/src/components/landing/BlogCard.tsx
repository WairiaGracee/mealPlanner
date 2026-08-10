import type { BlogPost } from "../../types";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-visible rounded-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Photo */}
      <div className="relative h-56 overflow-hidden rounded-2xl">
        {post.image ? (
          <img
            src={post.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-forest-light" />
        )}
      </div>

      {/* Overlapping content card */}
      <div className="relative z-10 -mt-16 mx-4 flex-1 rounded-xl bg-paper p-6 shadow-md">
        <span className="eyebrow">{post.tag}</span>
        <h3 className="mt-3 font-display text-xl text-ink transition-colors group-hover:text-forest">
          {post.title}
        </h3>
        <div className="mt-3 font-mono text-xs uppercase tracking-wide text-inkMuted/70">
          {post.date}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-inkMuted">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}