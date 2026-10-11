import { Link } from "react-router-dom";

export function Header() {
  return (
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
        </nav>
      </div>
    </header>
  );
}
