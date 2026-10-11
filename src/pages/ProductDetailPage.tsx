import { Link, useParams } from "react-router-dom";
import { useStorefront } from "../context/StorefrontContext";
import { useEffect, useState } from "react";
import { productApi } from "../services/productApi";
import type { Product } from "../services/types";

export function ProductDetailPage() {
  const { productSlug } = useParams();
  const { products } = useStorefront();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function load() {
      if (!productSlug) {
        setProduct(null);
        return;
      }

      const found = products.find((item) => item.slug === productSlug);
      if (found) {
        setProduct(found);
        return;
      }

      const remote = await productApi
        .getProductBySlug(productSlug)
        .catch(() => null);
      setProduct(remote);
    }

    void load();
  }, [productSlug, products]);

  if (!product) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-slate-300">
        Product not found.
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link
        to="/products"
        className="mb-6 inline-block text-sm font-medium text-cyan-300 hover:text-cyan-200"
      >
        ← Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="h-96 rounded-3xl bg-gradient-to-br from-cyan-500/25 via-sky-500/15 to-slate-900" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            {product.category?.name ?? "General"}
          </p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {product.title}
          </h2>
          <p className="mt-4 text-3xl font-semibold text-white">
            ${product.price}
          </p>
          <p className="mt-5 text-slate-300">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {(product.tags ?? ["featured", "catalog"]).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="mt-8 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Add to cart
          </button>
        </div>
      </div>
    </main>
  );
}
