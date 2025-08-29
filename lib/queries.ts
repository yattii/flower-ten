// lib/queries.ts
import { microcmsClient } from "./microcms";
import type { CatalogItem, Category, Product } from "./types";

type MicroCMSList<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

const isCategoryArray = (v: unknown): v is Category[] => Array.isArray(v);
const isCategory = (v: unknown): v is Category =>
  !!v && typeof v === "object" && "id" in (v as Record<string, unknown>);

const toCategoryArray = (v: CatalogItem["categories"]): Category[] => {
  if (isCategoryArray(v)) return v;
  if (isCategory(v)) return [v];
  return [];
};

const withParams = (url?: string, w = 1600, q = 85) =>
  url ? `${url}?fm=webp&w=${w}&q=${q}` : undefined;

export async function getCategories(): Promise<Category[]> {
  const res = await microcmsClient.get<MicroCMSList<Category>>({
    endpoint: "categories",
    queries: { limit: 100, orders: "order", fields: "id,name,order,slug" },
  });
  return res.contents ?? [];
}

export async function getCatalog(): Promise<Product[]> {
  const res = await microcmsClient.get<MicroCMSList<CatalogItem>>({
    endpoint: "catalog",
    queries: {
      limit: 100,
      depth: 1,
      orders: "order,-publishedAt",
    },
  });

  return (res.contents ?? []).map<Product>((c) => {
    const cats = toCategoryArray(c.categories);
    const mainUrl = withParams(c.image?.url, 1000, 85) ?? "/images/placeholder.jpg";
    const gallery = [
      withParams(c.image?.url, 1600, 85),
      ...(c.images?.map((i) => withParams(i?.url, 1600, 85)) ?? []),
    ].filter(Boolean) as string[];
    const images = Array.from(new Set(gallery));

    return {
      id: c.catalogId || c.id,
      name: c.name,
      price: c.price,
      image: mainUrl,
      images,
      description: c.description,
      description2: c.description2,
      rank: c.rank,          // ★ optional のまま受け渡し
      categories: cats,
    };
  });
}
