import {
  ALL_CATEGORY_OPTION,
  API_BASE,
  FALLBACK_CATEGORIES,
  type PaginatedResponse,
  type Product,
} from "./types";

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "ai-starter-kit",
    title: "AI Starter Kit",
    price: 49,
    category: FALLBACK_CATEGORIES[0],
    description:
      "A compact toolkit for founders building AI-powered product workflows.",
    tags: ["AI", "Workflow", "Startup"],
  },
  {
    id: 2,
    slug: "growth-analytics",
    title: "Growth Analytics",
    price: 89,
    category: FALLBACK_CATEGORIES[1],
    description:
      "Track product engagement, funnels, and conversion trends in one place.",
    tags: ["Marketing", "Analytics", "Dashboard"],
  },
  {
    id: 3,
    slug: "automation-suite",
    title: "Automation Suite",
    price: 129,
    category: FALLBACK_CATEGORIES[2],
    description:
      "Ship recurring operations with content, support, and sales automation.",
    tags: ["Automation", "Operations", "Scale"],
  },
];

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export const productApi = {
  getProducts: async (
    page = 1,
    category?: string,
  ): Promise<PaginatedResponse<Product>> => {
    const endpoint =
      category && category !== ALL_CATEGORY_OPTION
        ? `${API_BASE}/products/category/${category}?page=${page}`
        : `${API_BASE}/products?page=${page}`;

    const data = await fetchJson<PaginatedResponse<Product>>(endpoint);
    return {
      ...data,
      data: data.data?.length ? data.data : FALLBACK_PRODUCTS,
      last_page: data.last_page ?? 1,
    };
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    const data = await fetchJson<Product>(`${API_BASE}/products/${slug}`);
    return data ?? null;
  },
};
