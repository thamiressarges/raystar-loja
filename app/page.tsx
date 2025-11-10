import SectionHeader from "@/components/products/SectionHeader";
import ProductGrid from "@/components/products/ProductGrid";
import ProductCard from "@/components/products/ProductCard";
import { Banner } from "@/components/Banner";
import Category from "@/components/Category";

export default function Home() {
  return (
    <>
      <Banner />

      < Category />

      <section className="container mx-auto px-4 py-8">
        <SectionHeader title="Blusas" href="/categoria/blusas" />
        <ProductGrid>
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </ProductGrid>
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader title="Saias" href="/categoria/saias" />
        <ProductGrid>
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </ProductGrid>
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader title="Bermudas" href="/categoria/bermudas" />
        <ProductGrid>
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </ProductGrid>
      </section>
    </>
  );
}
