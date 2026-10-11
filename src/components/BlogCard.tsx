import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { BlogPost } from "../services/types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-500/40 hover:bg-slate-800"
    >
      <div className="mb-4 h-40 rounded-xl bg-gradient-to-br from-sky-500/20 via-cyan-500/20 to-slate-900" />
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
        {post.category?.name ?? "Insights"}
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-white">{post.title}</h3>
      <p className="mt-3 text-sm text-slate-300">{post.excerpt}</p>
      <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
        <span>
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString()
            : "New article"}
        </span>
        <Link
          to={`/blog/${post.slug}`}
          className="font-medium text-cyan-300 hover:text-cyan-200"
        >
          Read article
        </Link>
      </div>
    </motion.article>
  );
}
