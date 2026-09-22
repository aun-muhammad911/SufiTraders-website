export const PRODUCT_CATEGORIES = [
  "Biscuits",
  "Personal Care",
  "Baby Care",
  "Hair Care",
  "Household",
  "FMCG Essentials",
] as const;

export const PRODUCT_BRANDS = [
  "Innovative Biscuits",
  "GSK Consumer Healthcare",
  "Sun-Brite",
  "Dabur",
  "Dabur Amla",
  "Herbion Naturals",
  "Molfix",
  "Garnier",
  "Loreal Pakistan",
] as const;

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  piecesPerBox: string;
  boxesPerCarton: string;
  sku: string;
  imageUrl: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export function normalizeProductInput(input: ProductInput): ProductInput {
  const clean = {
    name: input.name.trim().slice(0, 120),
    brand: input.brand.trim().slice(0, 120),
    category: input.category.trim().slice(0, 80),
    piecesPerBox: input.piecesPerBox.trim().slice(0, 40),
    boxesPerCarton: input.boxesPerCarton.trim().slice(0, 40),
    sku: input.sku.trim().slice(0, 80),
    imageUrl: input.imageUrl.trim().slice(0, 2_500_000),
    description: input.description.trim().slice(0, 600),
    active: Boolean(input.active),
  };

  if (!clean.name) throw new Error("Product name is required.");

  if (
    clean.brand &&
    !PRODUCT_BRANDS.includes(clean.brand as (typeof PRODUCT_BRANDS)[number])
  ) {
    throw new Error("Select a valid brand.");
  }

  if (clean.piecesPerBox && !/^[1-9]\d*$/.test(clean.piecesPerBox)) {
    throw new Error("Pieces per box must be a positive whole number.");
  }

  if (clean.boxesPerCarton && !/^[1-9]\d*$/.test(clean.boxesPerCarton)) {
    throw new Error("Boxes per carton must be a positive whole number.");
  }

  const isUploadedImage = /^data:image\/(jpeg|png|webp);base64,/i.test(clean.imageUrl);
  const isExistingProductImage = /^\/products\/[a-z0-9][a-z0-9._-]*$/i.test(clean.imageUrl);

  if (clean.imageUrl && !isUploadedImage && !isExistingProductImage) {
    throw new Error("Upload a JPG, PNG or WebP product image.");
  }

  if (clean.imageUrl.length > 2_500_000) throw new Error("Product image is too large.");

  return clean;
}
