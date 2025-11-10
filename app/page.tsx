import { products } from "@/data/products";
import SectionHeader from "@/components/products/SectionHeader";
import ProductGrid from "@/components/products/ProductGrid";
import ProductCard from "@/components/products/ProductCard";
import { Banner } from "@/components/Banner";

export default function Home() {
  const byCategory = (cat: typeof products[number]["category"]) =>
    products.filter(p => p.category === cat);

  return (
    <>
      <Banner />

      <section className="container mx-auto px-4 py-8">
        <SectionHeader title="Blusas" href="/categoria/blusas" />
        <ProductGrid>
          {byCategory("Blusas").map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ProductGrid>
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader title="Saias" href="/categoria/saias" />
        <ProductGrid>
          {byCategory("Saias").map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ProductGrid>
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader title="Bermudas" href="/categoria/bermudas" />
        <ProductGrid>
          {byCategory("Bermudas").map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ProductGrid>
      </section>
    </>
  );
}
