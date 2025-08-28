// lib/queries.ts
import { microcmsClient } from "./microcms";
import type { CatalogItem, Category, Product } from "./types";

type MicroCMSList<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

// --- 型ガード＆正規化 ---
const isCategoryArray = (v: unknown): v is Category[] => Array.isArray(v);
const isCategory = (v: unknown): v is Category =>
  !!v && typeof v === "object" && "id" in (v as Record<string, unknown>);

const toCategoryArray = (v: CatalogItem["categories"]): Category[] => {
  if (isCategoryArray(v)) return v;
  if (isCategory(v)) return [v];
  return [];
};

// --- API ---
export async function getCategories(): Promise<Category[]> {
  const res = await microcmsClient.get<MicroCMSList<Category>>({
    endpoint: "categories",
    queries: { limit: 50, orders: "order" },
  });
  return res.contents ?? [];
}

export async function getCatalog(): Promise<Product[]> {
  const res = await microcmsClient.get<MicroCMSList<CatalogItem>>({
    endpoint: "catalog",
    queries: { limit: 100, orders: "order,-publishedAt", depth: 1 },
  });

  return (res.contents ?? []).map<Product>((c) => {
    const cats = toCategoryArray(c.categories);

    return {
      id: c.catalogId || c.id,
      name: c.name,
      price: c.price,
      image: c.image?.url || "/images/placeholder.jpg",
      description: c.description,
      categories: cats,
    };
  });
}
