import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Product = {
  id: number;
  slug: string;
  title: string;
  description: string;
  image?: string | null;
  sku?: string;
  price: number;
  tags?: string[];
  category?: Category | null;
  published_at?: string;
};

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  photo?: string | null;
  published_at?: string;
  category?: Category | null;
};

type View =
  | "home"
  | "products"
  | "product"
  | "blog"
  | "blog-item"
  | "category-products"
  | "category-blog";

type PaginatedResponse<T> = {
  data?: T[];
  current_page?: number;
  last_page?: number;
  total?: number;
  category?: Category;
};

const API_BASE = "http://127.0.0.1:8000/api";
const ALL_CATEGORY_OPTION = "all";

const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: "AI Tools", slug: "ai-tools" },
  { id: 2, name: "Marketing", slug: "marketing" },
  { id: 3, name: "Productivity", slug: "productivity" },
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "ai-starter-kit",
    title: "AI Starter Kit",
    price: 49,
    category: FALLBACK_CATEGORIES[0],
    description:
      "A compact toolkit for founders building AI-powered product workflows.",
  },
  {
    id: 2,
    slug: "growth-analytics",
    title: "Growth Analytics",
    price: 89,
    category: FALLBACK_CATEGORIES[1],
    description:
      "Track product engagement, funnels, and conversion trends in one place.",
  },
  {
    id: 3,
    slug: "automation-suite",
    title: "Automation Suite",
    price: 129,
    category: FALLBACK_CATEGORIES[2],
    description:
      "Ship recurring operations with content, support, and sales automation.",
  },
  {
    id: 4,
    slug: "content-pilot",
    title: "Content Pilot",
    price: 69,
    category: FALLBACK_CATEGORIES[1],
    description:
      "Structure marketing plans with AI-assisted briefs, prompts, and publishing checks.",
  },
];

const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "ai-storefronts",
    title: "The new era of AI storefronts",
    excerpt:
      "How product teams are using AI to turn browsing into faster, more personal buying journeys.",
    content:
      "AI storefronts combine discovery, recommendations, and product education into a single journey. That means teams can surface the right offer earlier and keep buyers moving without friction.",
    category: FALLBACK_CATEGORIES[0],
  },
  {
    id: 2,
    slug: "content-to-commerce-flow",
    title: "Designing a faster content-to-commerce flow",
    excerpt:
      "The best digital experiences connect education, discovery, and checkout without friction.",
    content:
      "A strong content-to-commerce flow makes it easy for buyers to discover value, compare options, and convert without leaving the narrative they already trust.",
    category: FALLBACK_CATEGORIES[2],
  },
  {
    id: 3,
    slug: "backend-architecture-growth",
    title: "What backend architecture matters for growth",
    excerpt:
      "A practical guide to keeping APIs flexible as catalogs, content, and user data grow together.",
    content:
      "As teams create more product experiences, the backbone of the platform matters more than the interface. Good API design keeps content and commerce aligned as markets expand.",
    category: FALLBACK_CATEGORIES[1],
  },
  {
    id: 4,
    slug: "marketing-ops-automation",
    title: "Marketing ops automation that actually scales",
    excerpt:
      "Operational clarity and AI review loops help teams move faster without creating new bottlenecks.",
    content:
      "When automation is paired with clear ownership and review checkpoints, teams can add output without creating chaos. That balance is where speed becomes sustainable.",
    category: FALLBACK_CATEGORIES[1],
  },
];

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (slug: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-500/40 hover:bg-slate-800">
      <div className="mb-4 h-40 rounded-xl bg-gradient-to-br from-cyan-500/30 via-sky-500/20 to-slate-900" />
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
        {product.category?.name ?? "General"}
      </p>
      <h4 className="mt-3 text-xl font-semibold text-white">{product.title}</h4>
      <p className="mt-3 text-sm text-slate-300">{product.description}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xl font-bold text-white">${product.price}</span>
        <button
          type="button"
          onClick={() => onSelect(product.slug)}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-100 hover:border-cyan-400 hover:text-cyan-300"
        >
          View product
        </button>
      </div>
    </article>
  );
}

function BlogCard({
  post,
  onSelect,
}: {
  post: BlogPost;
  onSelect: (slug: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-500/40 hover:bg-slate-800">
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
        <button
          type="button"
          onClick={() => onSelect(post.slug)}
          className="font-medium text-cyan-300 hover:text-cyan-200"
        >
          Read article
        </button>
      </div>
    </article>
  );
}

function HomePage({
  products,
  blogPosts,
  onOpenProducts,
  onOpenProduct,
  onOpenBlog,
}: {
  products: Product[];
  blogPosts: BlogPost[];
  onOpenProducts: () => void;
  onOpenProduct: (slug: string) => void;
  onOpenBlog: (slug: string) => void;
}) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
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
            <button
              type="button"
              onClick={onOpenProducts}
              className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Explore catalog
            </button>
            <button
              type="button"
              onClick={() => onOpenBlog(blogPosts[0]?.slug ?? "")}
              className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-100 transition hover:border-slate-500"
            >
              View insights
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/20">
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
              <p className="mt-2 text-3xl font-bold text-white">
                {FALLBACK_CATEGORIES.length}
              </p>
            </div>
            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">API health</p>
              <p className="mt-2 text-3xl font-bold text-emerald-400">OK</p>
            </div>
          </div>
        </div>
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
          <button
            type="button"
            onClick={onOpenProducts}
            className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
          >
            See all
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onOpenProduct}
            />
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
          <button
            type="button"
            onClick={() => onOpenBlog(blogPosts[0]?.slug ?? "")}
            className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
          >
            Read more
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={post} onSelect={onOpenBlog} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductsPage({
  products,
  categories,
  currentPage,
  lastPage,
  activeCategory,
  onSelectProduct,
  onSelectCategory,
  onPageChange,
}: {
  products: Product[];
  categories: Category[];
  currentPage: number;
  lastPage: number;
  activeCategory: string | null;
  onSelectProduct: (slug: string) => void;
  onSelectCategory: (slug: string) => void;
  onPageChange: (page: number) => void;
}) {
  const selectedCategory = activeCategory ?? ALL_CATEGORY_OPTION;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
            Catalog
          </p>
          <h2 className="mt-2 text-4xl font-bold text-white">All products</h2>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          aria-pressed={selectedCategory === ALL_CATEGORY_OPTION}
          onClick={() => onSelectCategory(ALL_CATEGORY_OPTION)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            selectedCategory === ALL_CATEGORY_OPTION
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
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
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

function ProductDetailPage({
  product,
  onBack,
}: {
  product: Product | null;
  onBack: () => void;
}) {
  if (!product) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-slate-300">
        Product not found.
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-medium text-cyan-300 hover:text-cyan-200"
      >
        ← Back to products
      </button>

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

function BlogPage({
  posts,
  categories,
  currentPage,
  lastPage,
  activeCategory,
  onSelectPost,
  onSelectCategory,
  onPageChange,
}: {
  posts: BlogPost[];
  categories: Category[];
  currentPage: number;
  lastPage: number;
  activeCategory: string | null;
  onSelectPost: (slug: string) => void;
  onSelectCategory: (slug: string) => void;
  onPageChange: (page: number) => void;
}) {
  const selectedCategory = activeCategory ?? ALL_CATEGORY_OPTION;

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
          aria-pressed={selectedCategory === ALL_CATEGORY_OPTION}
          onClick={() => onSelectCategory(ALL_CATEGORY_OPTION)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            selectedCategory === ALL_CATEGORY_OPTION
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
          <BlogCard key={post.id} post={post} onSelect={onSelectPost} />
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

function BlogDetailPage({
  post,
  onBack,
}: {
  post: BlogPost | null;
  onBack: () => void;
}) {
  if (!post) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-slate-300">
        Blog post not found.
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-medium text-cyan-300 hover:text-cyan-200"
      >
        ← Back to blog
      </button>

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

function App() {
  const [view, setView] = useState<View>("home");
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [productPage, setProductPage] = useState(1);
  const [productLastPage, setProductLastPage] = useState(1);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(
    null,
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(FALLBACK_BLOG_POSTS);
  const [blogPage, setBlogPage] = useState(1);
  const [blogLastPage, setBlogLastPage] = useState(1);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [activeProductCategory, setActiveProductCategory] = useState<
    string | null
  >(null);
  const [activeBlogCategory, setActiveBlogCategory] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchJson<Category[]>(`${API_BASE}/categories`);
        if (data.length) setCategories(data);
      } catch {
        setCategories(FALLBACK_CATEGORIES);
      }
    }

    void loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const url =
          activeProductCategory && activeProductCategory !== "all"
            ? `${API_BASE}/products/category/${activeProductCategory}?page=${productPage}`
            : `${API_BASE}/products?page=${productPage}`;

        const data = await fetchJson<PaginatedResponse<Product>>(url);
        const nextProducts = data.data ?? FALLBACK_PRODUCTS;
        setProducts(nextProducts);
        setProductLastPage(data.last_page ?? 1);
      } catch {
        setProducts(FALLBACK_PRODUCTS);
        setProductLastPage(1);
      }
    }

    if (view === "products" || view === "category-products") {
      void loadProducts();
    }
  }, [view, activeProductCategory, productPage]);

  useEffect(() => {
    async function loadBlogPosts() {
      try {
        const url =
          activeBlogCategory && activeBlogCategory !== "all"
            ? `${API_BASE}/categories/${activeBlogCategory}/blog?page=${blogPage}`
            : `${API_BASE}/blog?page=${blogPage}`;

        const data = await fetchJson<PaginatedResponse<BlogPost>>(url);
        const nextPosts = data.data ?? FALLBACK_BLOG_POSTS;
        setBlogPosts(nextPosts);
        setBlogLastPage(data.last_page ?? 1);
      } catch {
        setBlogPosts(FALLBACK_BLOG_POSTS);
        setBlogLastPage(1);
      }
    }

    if (view === "blog" || view === "category-blog") {
      void loadBlogPosts();
    }
  }, [view, activeBlogCategory, blogPage]);

  useEffect(() => {
    async function loadProductDetail() {
      if (!selectedProductSlug) {
        setSelectedProduct(null);
        return;
      }

      try {
        const data = await fetchJson<Product>(
          `${API_BASE}/products/${selectedProductSlug}`,
        );
        setSelectedProduct(data);
      } catch {
        const fallback =
          FALLBACK_PRODUCTS.find((item) => item.slug === selectedProductSlug) ??
          null;
        setSelectedProduct(fallback);
      }
    }

    if (view === "product") {
      void loadProductDetail();
    }
  }, [view, selectedProductSlug]);

  useEffect(() => {
    async function loadBlogDetail() {
      if (!selectedBlogSlug) {
        setSelectedBlog(null);
        return;
      }

      try {
        const data = await fetchJson<BlogPost>(
          `${API_BASE}/blog/${selectedBlogSlug}`,
        );
        setSelectedBlog(data);
      } catch {
        const fallback =
          FALLBACK_BLOG_POSTS.find((item) => item.slug === selectedBlogSlug) ??
          null;
        setSelectedBlog(fallback);
      }
    }

    if (view === "blog-item") {
      void loadBlogDetail();
    }
  }, [view, selectedBlogSlug]);

  const goHome = () => {
    setView("home");
    setSelectedProductSlug(null);
    setSelectedBlogSlug(null);
  };

  const goProducts = () => {
    setActiveProductCategory(null);
    setProductPage(1);
    setView("products");
  };

  const openProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setView("product");
  };

  const openCategoryProducts = (slug: string) => {
    setActiveProductCategory(slug === ALL_CATEGORY_OPTION ? null : slug);
    setProductPage(1);
    setView(slug === ALL_CATEGORY_OPTION ? "products" : "category-products");
  };

  const goBlog = () => {
    setActiveBlogCategory(null);
    setBlogPage(1);
    setView("blog");
  };

  const openBlogPost = (slug: string) => {
    setSelectedBlogSlug(slug);
    setView("blog-item");
  };

  const openCategoryBlog = (slug: string) => {
    setActiveBlogCategory(slug === ALL_CATEGORY_OPTION ? null : slug);
    setBlogPage(1);
    setView(slug === ALL_CATEGORY_OPTION ? "blog" : "category-blog");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <button type="button" onClick={goHome} className="text-left">
            <p className="text-xs uppercase tracking-[0.28rem] text-cyan-400">
              Laravel AI
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">
              Laravel AI FastAPI
            </h1>
          </button>

          <nav className="flex items-center gap-4 text-sm">
            <a
              href="#home"
              onClick={(event) => {
                event.preventDefault();
                goHome();
              }}
              className="font-medium text-slate-200 hover:text-cyan-300"
            >
              Home
            </a>
            <a
              href="#products"
              onClick={(event) => {
                event.preventDefault();
                goProducts();
              }}
              className="font-medium text-slate-200 hover:text-cyan-300"
            >
              Products
            </a>
            <a
              href="#blog"
              onClick={(event) => {
                event.preventDefault();
                goBlog();
              }}
              className="font-medium text-slate-200 hover:text-cyan-300"
            >
              Blog
            </a>
            <button className="rounded-full border border-cyan-500 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20">
              Browse products
            </button>
          </nav>
        </div>
      </header>

      {view === "home" && (
        <HomePage
          products={products}
          blogPosts={blogPosts}
          onOpenProducts={goProducts}
          onOpenProduct={openProduct}
          onOpenBlog={openBlogPost}
        />
      )}

      {(view === "products" || view === "category-products") && (
        <ProductsPage
          products={products}
          categories={categories}
          currentPage={productPage}
          lastPage={productLastPage}
          activeCategory={activeProductCategory}
          onSelectProduct={openProduct}
          onSelectCategory={openCategoryProducts}
          onPageChange={setProductPage}
        />
      )}

      {view === "product" && (
        <ProductDetailPage product={selectedProduct} onBack={goProducts} />
      )}

      {(view === "blog" || view === "category-blog") && (
        <BlogPage
          posts={blogPosts}
          categories={categories}
          currentPage={blogPage}
          lastPage={blogLastPage}
          activeCategory={activeBlogCategory}
          onSelectPost={openBlogPost}
          onSelectCategory={openCategoryBlog}
          onPageChange={setBlogPage}
        />
      )}

      {view === "blog-item" && (
        <BlogDetailPage post={selectedBlog} onBack={goBlog} />
      )}
    </div>
  );
}

export default App;
