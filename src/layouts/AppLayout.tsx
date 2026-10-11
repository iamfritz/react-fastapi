import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-left">
            <p className="text-xs uppercase tracking-[0.28rem] text-cyan-400">
              Laravel AI
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">
              Laravel AI FastAPI
            </h1>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/"
              className="font-medium text-slate-200 hover:text-cyan-300"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="font-medium text-slate-200 hover:text-cyan-300"
            >
              Products
            </Link>
            <Link
              to="/blog"
              className="font-medium text-slate-200 hover:text-cyan-300"
            >
              Blog
            </Link>
            <Link
              to="/admin"
              className="font-medium text-cyan-300 hover:text-cyan-200"
            >
              Admin
            </Link>
            <button className="rounded-full border border-cyan-500 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20">
              Browse products
            </button>
          </nav>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.main>
    </div>
  );
}
