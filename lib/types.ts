// lib/types.ts
export type ImageAsset = { url: string; width: number; height: number };

export type Category = {
  id: string;
  name: string;
  order?: number;
  slug?: string;
};

export type CatalogItem = {
  id: string;
  catalogId: string;
  name: string;
  price: number;
  description?: string;
  description2?: string;
  image?: ImageAsset;
  images?: ImageAsset[];
  rank?: number;                 // ★ optional
  categories?: Category[] | Category | null;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description?: string;
  description2?: string;
  rank?: number;                 // ★ optional
  categories?: Category[];
};
