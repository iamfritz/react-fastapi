import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    global.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes("/categories")) {
        return {
          ok: true,
          json: async () => [
            { id: 1, name: "AI Tools", slug: "ai-tools" },
            { id: 2, name: "Marketing", slug: "marketing" },
          ],
        } as Response;
      }

      if (url.includes("/products?page=1")) {
        return {
          ok: true,
          json: async () => ({
            data: [
              {
                id: 1,
                slug: "ai-starter-kit",
                title: "AI Starter Kit",
                price: 49,
                category: { id: 1, name: "AI Tools", slug: "ai-tools" },
                description: "Starter toolkit",
              },
            ],
            current_page: 1,
            last_page: 1,
          }),
        } as Response;
      }

      if (url.includes("/products/category/marketing?page=1")) {
        return {
          ok: true,
          json: async () => ({
            data: [
              {
                id: 2,
                slug: "growth-analytics",
                title: "Growth Analytics",
                price: 89,
                category: { id: 2, name: "Marketing", slug: "marketing" },
                description: "Marketing analytics toolkit",
              },
            ],
            current_page: 1,
            last_page: 1,
          }),
        } as Response;
      }

      if (url.includes("/blog?page=1")) {
        return {
          ok: true,
          json: async () => ({
            data: [
              {
                id: 1,
                slug: "ai-storefronts",
                title: "The new era of AI storefronts",
                excerpt: "AI storefronts are changing how teams convert.",
                category: { id: 1, name: "AI Tools", slug: "ai-tools" },
              },
            ],
            current_page: 1,
            last_page: 1,
          }),
        } as Response;
      }

      return {
        ok: false,
        status: 404,
        json: async () => ({}),
      } as Response;
    });
  });

  it("renders the platform title and CTA", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /laravel ai fastapi/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /explore catalog/i }),
    ).toBeInTheDocument();
  });

  it("shows the blog navigation link", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: /blog/i })).toBeInTheDocument();
  });

  it("marks the selected product category filter as active", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("link", { name: /products/i }));
    fireEvent.click(await screen.findByRole("button", { name: /marketing/i }));

    const marketingButton = screen.getByRole("button", { name: /marketing/i });
    expect(marketingButton).toHaveAttribute("aria-pressed", "true");
    expect(marketingButton.className).toContain("text-cyan-300");
  });

  it("shows the admin dashboard entry from the main navigation", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: /admin/i })).toBeInTheDocument();
  });
});
