import { getCatalog, getCategories } from "@/lib/queries";
import Home from "@/components/Home";

export const revalidate = 60;

export default async function Page() {
  const [products, categories] = await Promise.all([getCatalog(), getCategories()]);
  return <Home products={products} categories={categories} />;
}
