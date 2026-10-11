import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Product } from "../services/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-500/40 hover:bg-slate-800"
    >
      <div className="mb-4 h-40 rounded-xl bg-gradient-to-br from-cyan-500/30 via-sky-500/20 to-slate-900" />
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
        {product.category?.name ?? "General"}
      </p>
      <h4 className="mt-3 text-xl font-semibold text-white">{product.title}</h4>
      <p className="mt-3 text-sm text-slate-300">{product.description}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xl font-bold text-white">${product.price}</span>
        <Link
          to={`/products/${product.slug}`}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-100 hover:border-cyan-400 hover:text-cyan-300"
        >
          View product
        </Link>
      </div>
    </motion.article>
  );
}
