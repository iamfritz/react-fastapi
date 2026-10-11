export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  slug: string;
  title: string;
  description: string;
  image?: string | null;
  price: number;
  tags?: string[];
  category?: Category | null;
  published_at?: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  photo?: string | null;
  published_at?: string;
  category?: Category | null;
};

export type PaginatedResponse<T> = {
  data?: T[];
  current_page?: number;
  last_page?: number;
  total?: number;
  category?: Category;
};

export const API_BASE = "http://127.0.0.1:8000/api";
export const ALL_CATEGORY_OPTION = "all";

export const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: "AI Tools", slug: "ai-tools" },
  { id: 2, name: "Marketing", slug: "marketing" },
  { id: 3, name: "Productivity", slug: "productivity" },
];
