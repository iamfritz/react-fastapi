import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./public/components/Layout";
import { HomePage } from "./public/pages/HomePage";
import { ProductsPage } from "./public/pages/ProductsPage";
import { ProductDetailPage } from "./public/pages/ProductDetailPage";
import { BlogPage } from "./public/pages/BlogPage";
import { BlogDetailPage } from "./public/pages/BlogDetailPage";
import { AdminApp } from "./admin/AdminApp";
import { StorefrontProvider, useStorefront } from "./context/StorefrontContext";

function AppRoutes() {
  const {
    products,
    blogPosts,
    categories,
    productPage,
    blogPage,
    productLastPage,
    blogLastPage,
    activeProductCategory,
    activeBlogCategory,
    setProductPage,
    setBlogPage,
    setActiveProductCategory,
    setActiveBlogCategory,
  } = useStorefront();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage products={products} blogPosts={blogPosts} />
          </Layout>
        }
      />
      <Route
        path="/products"
        element={
          <Layout>
            <ProductsPage
              products={products}
              categories={categories}
              currentPage={productPage}
              lastPage={productLastPage}
              activeCategory={activeProductCategory}
              onSelectCategory={(slug) => {
                setActiveProductCategory(slug === "all" ? null : slug);
                setProductPage(1);
              }}
              onPageChange={setProductPage}
            />
          </Layout>
        }
      />
      <Route
        path="/products/:productSlug"
        element={
          <Layout>
            <ProductDetailPage />
          </Layout>
        }
      />
      <Route
        path="/blog"
        element={
          <Layout>
            <BlogPage
              posts={blogPosts}
              categories={categories}
              currentPage={blogPage}
              lastPage={blogLastPage}
              activeCategory={activeBlogCategory}
              onSelectCategory={(slug) => {
                setActiveBlogCategory(slug === "all" ? null : slug);
                setBlogPage(1);
              }}
              onPageChange={setBlogPage}
            />
          </Layout>
        }
      />
      <Route
        path="/blog/:blogSlug"
        element={
          <Layout>
            <BlogDetailPage />
          </Layout>
        }
      />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <StorefrontProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StorefrontProvider>
  );
}
