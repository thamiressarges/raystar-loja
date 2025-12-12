import { Banner } from "@/components/Banner";
import CategorySectionList from "@/components/products/CategorySectionList";
import Category from "@/components/Category";
import { getCategoriesWithProducts } from "@/services/product";

export default async function Home() {
  const allCategories = await getCategoriesWithProducts();
  return (
    <>
      <Banner />
      <Category categories={allCategories} />
      <CategorySectionList categories={allCategories} />
    </>
  );
}