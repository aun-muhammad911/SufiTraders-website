import { createFileRoute } from "@tanstack/react-router";

import { Footer, Nav } from "@/components/site/chrome";
import { ProductCatalogue } from "@/components/site/product-catalogue";
import { ScrollProgress } from "@/components/site/primitives";
import { getPublicProducts } from "@/lib/product-functions";

const SITE_URL = "https://sufidistribution.com";

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>) => ({
    brand: typeof search.brand === "string" ? search.brand : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  loader: () => getPublicProducts(),
  head: () => ({
    meta: [
      { title: "Products | Sufi Traders" },
      {
        name: "description",
        content: "Browse FMCG products distributed by Sufi Traders in Daska, Punjab.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/products` }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const products = Route.useLoaderData();
  const { brand, category } = Route.useSearch();

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main className="pt-16 sm:pt-[72px]">
        <ProductCatalogue products={products} brand={brand} category={category} />
      </main>
      <Footer />
    </>
  );
}
