import { createContext, useContext, type ReactNode } from "react";
import { useStorefrontData } from "../hooks/useStorefrontData";
import type { BlogPost, Category, Product } from "../services/types";

export type StorefrontContextValue = {
  categories: Category[];
  products: Product[];
  blogPosts: BlogPost[];
  productPage: number;
  productLastPage: number;
  blogPage: number;
  blogLastPage: number;
  isLoading: boolean;
  setProductPage: (page: number) => void;
  setBlogPage: (page: number) => void;
  setActiveProductCategory: (category: string | null) => void;
  setActiveBlogCategory: (category: string | null) => void;
  activeProductCategory: string | null;
  activeBlogCategory: string | null;
};

const StorefrontContext = createContext<StorefrontContextValue | undefined>(
  undefined,
);

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const storefront = useStorefrontData();

  return (
    <StorefrontContext.Provider value={storefront}>
      {children}
    </StorefrontContext.Provider>
  );
}

// Keep the context hook alongside its provider; it is not a Fast Refresh component.
// eslint-disable-next-line react-refresh/only-export-components
export function useStorefront() {
  const context = useContext(StorefrontContext);

  if (!context) {
    throw new Error("useStorefront must be used within a StorefrontProvider");
  }

  return context;
}
