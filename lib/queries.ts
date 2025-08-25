import { microcmsClient } from "./microcms";
import type { CatalogItem, Category, Product } from "./types";

export async function getCategories(): Promise<Category[]> {
  const res = await microcmsClient.get<{ contents: Category[] }>({
    endpoint: "categories",
    queries: { limit: 50, orders: "order" },
  });
  return res.contents ?? [];
}

export async function getCatalog(): Promise<Product[]> {
  const res = await microcmsClient.get<{ contents: CatalogItem[] }>({
    endpoint: "catalog",
    queries: { limit: 100, orders: "order,-publishedAt", depth: 1 },
  });

  return (res.contents ?? []).map((c) => {
    // ← ここで配列に正規化
    const cats = Array.isArray((c as any).categories)
      ? ((c as any).categories as Category[])
      : (c as any).categories
      ? [((c as any).categories as Category)]
      : [];

    return {
      id: c.catalogId || c.id,
      name: c.name,
      price: c.price,
      image: c.image?.url || "/images/placeholder.jpg",
      description: c.description,
      categories: cats,
    } satisfies Product;
  });
}
