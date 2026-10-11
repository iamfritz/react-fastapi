import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { blogApi } from "../services/blogApi";
import type { BlogPost } from "../services/types";

export function BlogDetailPage() {
  const { blogSlug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function load() {
      if (!blogSlug) {
        setPost(null);
        return;
      }

      const remote = await blogApi.getBlogBySlug(blogSlug).catch(() => null);
      setPost(remote);
    }

    void load();
  }, [blogSlug]);

  if (!post) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-slate-300">
        Blog post not found.
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        to="/blog"
        className="mb-6 inline-block text-sm font-medium text-cyan-300 hover:text-cyan-200"
      >
        ← Back to blog
      </Link>

      <div className="rounded-3xl bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-slate-900 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          {post.category?.name ?? "Insights"}
        </p>
        <h2 className="mt-3 text-4xl font-bold text-white">{post.title}</h2>
        <p className="mt-4 text-sm text-slate-400">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString()
            : "Recently published"}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
        <p>{post.content ?? post.excerpt}</p>
      </div>
    </main>
  );
}
