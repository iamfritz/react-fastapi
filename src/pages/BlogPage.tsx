import { BlogCard } from "../components/BlogCard";
import type { BlogPost, Category } from "../services/types";

export function BlogPage({
  posts,
  categories,
  currentPage,
  lastPage,
  activeCategory,
  onSelectCategory,
  onPageChange,
}: {
  posts: BlogPost[];
  categories: Category[];
  currentPage: number;
  lastPage: number;
  activeCategory: string | null;
  onSelectCategory: (slug: string) => void;
  onPageChange: (page: number) => void;
}) {
  const selectedCategory = activeCategory ?? "all";

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
          Insights
        </p>
        <h2 className="mt-3 text-4xl font-bold text-white">Blog</h2>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Ideas, product notes, and practical lessons from building digital
          experiences for modern commerce and AI products.
        </p>
      </section>

      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          aria-pressed={selectedCategory === "all"}
          onClick={() => onSelectCategory("all")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            selectedCategory === "all"
              ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
              : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"
          }`}
        >
          All
        </button>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.slug;

          return (
            <button
              key={category.slug}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectCategory(category.slug)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                isSelected
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                  : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <p className="text-sm text-slate-300">
          Page {currentPage} of {lastPage}
        </p>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))}
          disabled={currentPage >= lastPage}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </main>
  );
}
