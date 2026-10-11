import {
  ALL_CATEGORY_OPTION,
  API_BASE,
  FALLBACK_CATEGORIES,
  type BlogPost,
  type PaginatedResponse,
} from "./types";

export const FALLBACK_BLOG_POSTS: BlogPost[] = [
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
];

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export const blogApi = {
  getBlogPosts: async (
    page = 1,
    category?: string,
  ): Promise<PaginatedResponse<BlogPost>> => {
    const endpoint =
      category && category !== ALL_CATEGORY_OPTION
        ? `${API_BASE}/categories/${category}/blog?page=${page}`
        : `${API_BASE}/blog?page=${page}`;

    const data = await fetchJson<PaginatedResponse<BlogPost>>(endpoint);
    return {
      ...data,
      data: data.data?.length ? data.data : FALLBACK_BLOG_POSTS,
      last_page: data.last_page ?? 1,
    };
  },

  getBlogBySlug: async (slug: string): Promise<BlogPost | null> => {
    const data = await fetchJson<BlogPost>(`${API_BASE}/blog/${slug}`);
    return data ?? null;
  },
};
