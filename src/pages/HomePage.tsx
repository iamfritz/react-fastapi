import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BlogCard } from "../components/BlogCard";
import { ProductCard } from "../components/ProductCard";
import type { BlogPost, Product } from "../services/types";

export function HomePage({
  products,
  blogPosts,
}: {
  products: Product[];
  blogPosts: BlogPost[];
}) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            FastAPI + PostgreSQL
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Launch your next digital storefront with confidence.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Connect a Laravel-ready backend to a modern React frontend and
            unlock product, blog, and catalog experiences with a single API
            strategy.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/products"
              className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Explore catalog
            </Link>
            <Link
              to={blogPosts[0] ? `/blog/${blogPosts[0].slug}` : "/blog"}
              className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-100 transition hover:border-slate-500"
            >
              View insights
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/20"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Platform
          </p>
          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Products</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {products.length}
              </p>
            </div>
            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Categories</p>
              <p className="mt-2 text-3xl font-bold text-white">{3}</p>
            </div>
            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">API health</p>
              <p className="mt-2 text-3xl font-bold text-emerald-400">OK</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
              Featured
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Popular products
            </h3>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
          >
            See all
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
              Insights
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Latest blog posts
            </h3>
          </div>
          <Link
            to="/blog"
            className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
          >
            Read more
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
