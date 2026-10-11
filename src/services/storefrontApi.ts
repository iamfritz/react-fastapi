export * from "./types";

import {
  API_BASE,
  FALLBACK_CATEGORIES,
  type BlogPost,
  type Category,
  type PaginatedResponse,
  type Product,
} from "./types";
import { blogApi } from "./blogApi";
import { productApi } from "./productApi";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export const storefrontApi = {
  getCategories: async (): Promise<Category[]> => {
    const data = await fetchJson<Category[]>(`${API_BASE}/categories`);
    return data.length ? data : FALLBACK_CATEGORIES;
  },

  getProducts: async (
    page = 1,
    category?: string,
  ): Promise<PaginatedResponse<Product>> => {
    return productApi.getProducts(page, category);
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    return productApi.getProductBySlug(slug);
  },

  getBlogPosts: async (
    page = 1,
    category?: string,
  ): Promise<PaginatedResponse<BlogPost>> => {
    return blogApi.getBlogPosts(page, category);
  },

  getBlogBySlug: async (slug: string): Promise<BlogPost | null> => {
    return blogApi.getBlogBySlug(slug);
  },
};
