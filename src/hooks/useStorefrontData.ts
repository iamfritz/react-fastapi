import { useEffect, useMemo, useState } from "react";
import { blogApi, FALLBACK_BLOG_POSTS } from "../services/blogApi";
import { productApi, FALLBACK_PRODUCTS } from "../services/productApi";
import { storefrontApi } from "../services/storefrontApi";
import {
  ALL_CATEGORY_OPTION,
  FALLBACK_CATEGORIES,
  type BlogPost,
  type Category,
  type Product,
} from "../services/types";

export function useStorefrontData() {
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(FALLBACK_BLOG_POSTS);
  const [productPage, setProductPage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const [productLastPage, setProductLastPage] = useState(1);
  const [blogLastPage, setBlogLastPage] = useState(1);
  const [activeProductCategory, setActiveProductCategory] = useState<
    string | null
  >(null);
  const [activeBlogCategory, setActiveBlogCategory] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const nextCategories = await storefrontApi.getCategories();
        setCategories(nextCategories);
      } catch {
        setCategories(FALLBACK_CATEGORIES);
      }
    }

    void loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const data = await productApi.getProducts(
          productPage,
          activeProductCategory ?? undefined,
        );
        setProducts(data.data ?? FALLBACK_PRODUCTS);
        setProductLastPage(data.last_page ?? 1);
      } catch {
        setProducts(FALLBACK_PRODUCTS);
        setProductLastPage(1);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProducts();
  }, [productPage, activeProductCategory]);

  useEffect(() => {
    async function loadBlogPosts() {
      setIsLoading(true);
      try {
        const data = await blogApi.getBlogPosts(
          blogPage,
          activeBlogCategory ?? undefined,
        );
        setBlogPosts(data.data ?? FALLBACK_BLOG_POSTS);
        setBlogLastPage(data.last_page ?? 1);
      } catch {
        setBlogPosts(FALLBACK_BLOG_POSTS);
        setBlogLastPage(1);
      } finally {
        setIsLoading(false);
      }
    }

    void loadBlogPosts();
  }, [blogPage, activeBlogCategory]);

  return useMemo(
    () => ({
      categories,
      products,
      blogPosts,
      productPage,
      productLastPage,
      blogPage,
      blogLastPage,
      activeProductCategory,
      activeBlogCategory,
      isLoading,
      setProductPage,
      setBlogPage,
      setActiveProductCategory,
      setActiveBlogCategory,
    }),
    [
      categories,
      products,
      blogPosts,
      productPage,
      productLastPage,
      blogPage,
      blogLastPage,
      activeProductCategory,
      activeBlogCategory,
      isLoading,
    ],
  );
}

export function categoryFilterLabel(category: string | null) {
  if (!category || category === ALL_CATEGORY_OPTION) {
    return "All";
  }

  return category.replace(/-/g, " ");
}
