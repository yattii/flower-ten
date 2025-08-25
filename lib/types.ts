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
  image?: ImageAsset;
  categories?: Category[];
};

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  categories: Category[];
};
