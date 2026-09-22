export type Catalog = {
  id: string;
  title: string;
  brand: string;
  description: string;
  fileUrl: string;
  coverUrl?: string;
  fileSize?: string;
  updatedAt: string;
};

/**
 * Public catalogue manifest.
 *
 * Catalogue PDFs belong in /public/catalogs. Add one entry here for each file;
 * the catalogue page will automatically create its downloadable card.
 */
export const CATALOGS: Catalog[] = [
  {
    id: "dabur-vatika-product-catalog-2026",
    title: "Dabur Vatika Product Catalog",
    brand: "Dabur Vatika",
    description:
      "Browse the complete Vatika hair oils, shampoos, conditioners and everyday care range.",
    fileUrl: "/catalogs/vatika-product-catalog-2026.pdf",
    coverUrl: "/catalogs/vatika-product-catalog-cover.webp",
    fileSize: "30.7 MB",
    updatedAt: "September 2026",
  },
  {
    id: "herbion-gastril-product-catalog-2026",
    title: "Herbion Gastril Product Catalog",
    brand: "Herbion Naturals",
    description: "Explore the Gastril Plus digestive tablets range, including bottles and jars.",
    fileUrl: "/catalogs/gastril-product-catalog-2026.pdf",
    coverUrl: "/catalogs/gastril-product-catalog-cover.webp",
    fileSize: "13.9 MB",
    updatedAt: "September 2026",
  },
  {
    id: "innovative-biscuits-product-catalogue",
    title: "Innovative Biscuits Product Catalogue",
    brand: "Innovative Biscuits",
    description:
      "Browse Innovative biscuits, cookies, wafers, chocolate snacks and the complete product range.",
    fileUrl: "/catalogs/innovative-biscuits-product-catalogue.pdf",
    coverUrl: "/catalogs/innovative-biscuits-product-catalogue-cover.webp",
    fileSize: "15.1 MB",
    updatedAt: "September 2026",
  },
  {
    id: "sunbrite-product-catalogue",
    title: "Sunbrite Product Catalogue",
    brand: "Sunbrite",
    description:
      "Explore Sunbrite and Sun Right cleaning essentials, scourers, sponges, gloves and household accessories.",
    fileUrl: "/catalogs/sunbrite-product-catalogue.pdf",
    coverUrl: "/catalogs/sunbrite-product-catalogue-cover.webp",
    fileSize: "23.3 MB",
    updatedAt: "September 2026",
  },
  {
    id: "loreal-pakistan-product-catalogue",
    title: "L'Oréal Pakistan Product Catalogue",
    brand: "Loreal Pakistan",
    description:
      "Explore L'Oréal hair care, conditioners, treatments and selected skin care products.",
    fileUrl: "/catalogs/loreal-pakistan-product-catalogue.pdf",
    coverUrl: "/catalogs/loreal-pakistan-product-catalogue-cover.webp",
    fileSize: "10.2 MB",
    updatedAt: "September 2026",
  },
  {
    id: "molfix-product-catalogue",
    title: "Molfix Product Catalogue",
    brand: "Molfix",
    description:
      "Browse Molfix diapers and wipes along with Hayat's family and household hygiene essentials.",
    fileUrl: "/catalogs/molfix-product-catalogue.pdf",
    coverUrl: "/catalogs/molfix-product-catalogue-cover.webp",
    fileSize: "11.9 MB",
    updatedAt: "September 2026",
  },
  {
    id: "garnier-product-catalogue",
    title: "Garnier Product Catalogue",
    brand: "Garnier",
    description: "Explore Garnier personal care, skin care and hair care products.",
    fileUrl: "/catalogs/garnier-product-catalogue.pdf",
    coverUrl: "/catalogs/garnier-product-catalogue-cover.webp",
    fileSize: "38.5 MB",
    updatedAt: "September 2026",
  },
  {
    id: "fmcg-essentials-product-catalogue",
    title: "FMCG Essentials Product Catalogue",
    brand: "FMCG Essentials",
    description:
      "Browse the Horlicks, Complan, Mentos and Fruit-tella product range available from Sufi Traders.",
    fileUrl: "/catalogs/fmcg-essentials-product-catalogue.pdf",
    coverUrl: "/catalogs/fmcg-essentials-product-catalogue-cover.webp",
    fileSize: "12.0 MB",
    updatedAt: "September 2026",
  },
];
