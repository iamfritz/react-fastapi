import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28rem] text-cyan-400">
              Admin
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">Laravel AI</h1>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/admin"
              className="font-medium text-slate-200 hover:text-cyan-300"
            >
              Overview
            </Link>
            <Link
              to="/admin/products"
              className="font-medium text-slate-200 hover:text-cyan-300"
            >
              Products
            </Link>
            <Link
              to="/admin/blog"
              className="font-medium text-slate-200 hover:text-cyan-300"
            >
              Blog
            </Link>
            <Link
              to="/admin/settings"
              className="font-medium text-slate-200 hover:text-cyan-300"
            >
              Settings
            </Link>
            <Link
              to="/"
              className="font-medium text-cyan-300 hover:text-cyan-200"
            >
              Public site
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
