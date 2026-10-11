import { useEffect, useState } from "react";
import { API_BASE } from "../services/types";

type ProductFormState = {
  id?: number;
  title: string;
  slug: string;
  sku: string;
  price: string;
  description: string;
  image: string;
  category_id: string;
  status: string;
};

type BlogFormState = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  photo: string;
  status: string;
};

type SiteSettingsForm = {
  site_name: string;
  site_title: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  contact_email: string;
  contact_phone: string;
};

type ProductRow = {
  id?: number;
  title: string;
  slug: string;
  sku: string;
  price?: number;
  status?: string;
  description?: string;
  image?: string;
  category?: { id?: number; name?: string; slug?: string } | null;
};

type BlogRow = {
  id?: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  photo?: string;
  status?: string;
};

const emptyProductForm: ProductFormState = {
  title: "",
  slug: "",
  sku: "",
  price: "",
  description: "",
  image: "",
  category_id: "",
  status: "draft",
};

const emptyBlogForm: BlogFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  photo: "",
  status: "draft",
};

const emptySettingsForm: SiteSettingsForm = {
  site_name: "Laravel AI",
  site_title: "Laravel AI FastAPI",
  tagline: "Launch smarter digital experiences.",
  logo_url: "",
  favicon_url: "",
  primary_color: "#22d3ee",
  secondary_color: "#0f172a",
  contact_email: "hello@laravelai.dev",
  contact_phone: "+1 555 013 1900",
};

async function fetchJson<T>(url: string, method = "GET", body?: object) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.detail?.message || data?.message || "Request failed");
  }

  return (await response.json()) as T;
}

export function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogRow[]>([]);
  const [productForm, setProductForm] =
    useState<ProductFormState>(emptyProductForm);
  const [blogForm, setBlogForm] = useState<BlogFormState>(emptyBlogForm);
  const [settings, setSettings] = useState<SiteSettingsForm>(emptySettingsForm);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Ready");

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [productData, postData, settingData] = await Promise.all([
        fetchJson<ProductRow[]>(`${API_BASE}/products-admin`),
        fetchJson<BlogRow[]>(`${API_BASE}/posts`),
        fetchJson<SiteSettingsForm>(`${API_BASE}/admin/settings`),
      ]);

      setProducts(productData);
      setBlogPosts(postData);
      setSettings({ ...emptySettingsForm, ...settingData });
      setStatusMessage("Dashboard synced");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = {
      title: productForm.title,
      slug: productForm.slug,
      sku: productForm.sku,
      price: Number(productForm.price || 0),
      description: productForm.description,
      image: productForm.image,
      category_id: productForm.category_id
        ? Number(productForm.category_id)
        : null,
      status: productForm.status,
      tags: [],
    };

    try {
      if (productForm.id) {
        await fetchJson(
          `${API_BASE}/products-admin/${productForm.id}`,
          "PUT",
          payload,
        );
        setStatusMessage("Product updated");
      } else {
        await fetchJson(`${API_BASE}/products-admin`, "POST", payload);
        setStatusMessage("Product created");
      }
      setProductForm(emptyProductForm);
      await loadDashboard();
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Could not save product",
      );
    }
  }

  async function submitBlog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = {
      title: blogForm.title,
      slug: blogForm.slug,
      excerpt: blogForm.excerpt,
      content: blogForm.content,
      photo: blogForm.photo,
      status: blogForm.status,
    };

    try {
      if (blogForm.id) {
        await fetchJson(
          `${API_BASE}/posts-admin/${blogForm.id}`,
          "PUT",
          payload,
        );
        setStatusMessage("Blog post updated");
      } else {
        await fetchJson(`${API_BASE}/posts-admin`, "POST", payload);
        setStatusMessage("Blog post created");
      }
      setBlogForm(emptyBlogForm);
      await loadDashboard();
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Could not save blog post",
      );
    }
  }

  async function submitSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await fetchJson(`${API_BASE}/admin/settings`, "PUT", settings);
      setStatusMessage("Settings saved");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Could not save settings",
      );
    }
  }

  function editProduct(product: ProductRow) {
    setProductForm({
      id: product.id,
      title: product.title || "",
      slug: product.slug || "",
      sku: product.sku || "",
      price: String(product.price ?? 0),
      description: product.description || "",
      image: product.image || "",
      category_id: product.category?.id ? String(product.category.id) : "",
      status: product.status || "draft",
    });
  }

  function editBlog(post: BlogRow) {
    setBlogForm({
      id: post.id,
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      photo: post.photo || "",
      status: post.status || "draft",
    });
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
            Admin
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white">
            Store dashboard
          </h1>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          {loading ? "Loading" : "Live"}
        </span>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Products</p>
          <p className="mt-3 text-3xl font-bold text-white">
            {products.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Blog posts</p>
          <p className="mt-3 text-3xl font-bold text-white">
            {blogPosts.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Status</p>
          <p className="mt-3 text-lg font-semibold text-cyan-300">
            {statusMessage}
          </p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              Manage products
            </h2>
            <button
              type="button"
              onClick={() => setProductForm(emptyProductForm)}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"
            >
              New
            </button>
          </div>

          <form onSubmit={submitProduct} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={productForm.title}
                onChange={(e) =>
                  setProductForm({ ...productForm, title: e.target.value })
                }
                placeholder="Product title"
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              />
              <input
                value={productForm.slug}
                onChange={(e) =>
                  setProductForm({ ...productForm, slug: e.target.value })
                }
                placeholder="slug"
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              />
              <input
                value={productForm.sku}
                onChange={(e) =>
                  setProductForm({ ...productForm, sku: e.target.value })
                }
                placeholder="SKU"
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              />
              <input
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
                placeholder="Price"
                type="number"
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              />
            </div>

            <textarea
              value={productForm.description}
              onChange={(e) =>
                setProductForm({ ...productForm, description: e.target.value })
              }
              placeholder="Description"
              rows={4}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
            />

            <div className="grid gap-4 md:grid-cols-3">
              <input
                value={productForm.image}
                onChange={(e) =>
                  setProductForm({ ...productForm, image: e.target.value })
                }
                placeholder="Image URL"
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              />
              <input
                value={productForm.category_id}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    category_id: e.target.value,
                  })
                }
                placeholder="Category ID"
                type="number"
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              />
              <select
                value={productForm.status}
                onChange={(e) =>
                  setProductForm({ ...productForm, status: e.target.value })
                }
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950"
            >
              {productForm.id ? "Update product" : "Create product"}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            {products.map((product) => (
              <div
                key={product.id ?? product.slug}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 p-3"
              >
                <div>
                  <p className="font-semibold text-white">{product.title}</p>
                  <p className="text-sm text-slate-400">{product.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editProduct(product)}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!product.id) return;
                      await fetchJson(
                        `${API_BASE}/products-admin/${product.id}`,
                        "DELETE",
                      );
                      await loadDashboard();
                      setStatusMessage("Product deleted");
                    }}
                    className="rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Manage blog</h2>
            <button
              type="button"
              onClick={() => setBlogForm(emptyBlogForm)}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"
            >
              New
            </button>
          </div>

          <form onSubmit={submitBlog} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={blogForm.title}
                onChange={(e) =>
                  setBlogForm({ ...blogForm, title: e.target.value })
                }
                placeholder="Blog title"
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              />
              <input
                value={blogForm.slug}
                onChange={(e) =>
                  setBlogForm({ ...blogForm, slug: e.target.value })
                }
                placeholder="slug"
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              />
            </div>

            <input
              value={blogForm.photo}
              onChange={(e) =>
                setBlogForm({ ...blogForm, photo: e.target.value })
              }
              placeholder="Featured image URL"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
            />

            <textarea
              value={blogForm.excerpt}
              onChange={(e) =>
                setBlogForm({ ...blogForm, excerpt: e.target.value })
              }
              placeholder="Excerpt"
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
            />

            <textarea
              value={blogForm.content}
              onChange={(e) =>
                setBlogForm({ ...blogForm, content: e.target.value })
              }
              placeholder="Content"
              rows={6}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
            />

            <div className="flex items-center gap-4">
              <select
                value={blogForm.status}
                onChange={(e) =>
                  setBlogForm({ ...blogForm, status: e.target.value })
                }
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>

              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950"
              >
                {blogForm.id ? "Update post" : "Create post"}
              </button>
            </div>
          </form>

          <div className="mt-6 space-y-3">
            {blogPosts.map((post) => (
              <div
                key={post.id ?? post.slug}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 p-3"
              >
                <div>
                  <p className="font-semibold text-white">{post.title}</p>
                  <p className="text-sm text-slate-400">{post.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editBlog(post)}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!post.id) return;
                      await fetchJson(
                        `${API_BASE}/posts-admin/${post.id}`,
                        "DELETE",
                      );
                      await loadDashboard();
                      setStatusMessage("Blog post deleted");
                    }}
                    className="rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-5 text-2xl font-semibold text-white">
          Global settings
        </h2>
        <form onSubmit={submitSettings} className="grid gap-4 md:grid-cols-2">
          <input
            value={settings.site_name}
            onChange={(e) =>
              setSettings({ ...settings, site_name: e.target.value })
            }
            placeholder="Site name"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          />
          <input
            value={settings.site_title}
            onChange={(e) =>
              setSettings({ ...settings, site_title: e.target.value })
            }
            placeholder="Site title"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          />
          <input
            value={settings.tagline}
            onChange={(e) =>
              setSettings({ ...settings, tagline: e.target.value })
            }
            placeholder="Tagline"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 md:col-span-2"
          />
          <input
            value={settings.logo_url}
            onChange={(e) =>
              setSettings({ ...settings, logo_url: e.target.value })
            }
            placeholder="Logo URL"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          />
          <input
            value={settings.favicon_url}
            onChange={(e) =>
              setSettings({ ...settings, favicon_url: e.target.value })
            }
            placeholder="Favicon URL"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          />
          <input
            value={settings.primary_color}
            onChange={(e) =>
              setSettings({ ...settings, primary_color: e.target.value })
            }
            placeholder="Primary color"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          />
          <input
            value={settings.secondary_color}
            onChange={(e) =>
              setSettings({ ...settings, secondary_color: e.target.value })
            }
            placeholder="Secondary color"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          />
          <input
            value={settings.contact_email}
            onChange={(e) =>
              setSettings({ ...settings, contact_email: e.target.value })
            }
            placeholder="Contact email"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          />
          <input
            value={settings.contact_phone}
            onChange={(e) =>
              setSettings({ ...settings, contact_phone: e.target.value })
            }
            placeholder="Contact phone"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950"
            >
              Save settings
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
