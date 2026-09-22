import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

import type { Product, ProductInput } from "./products";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");
const TEMP_FILE = path.join(DATA_DIR, "products.tmp.json");

let sqlClient: ReturnType<typeof postgres> | undefined;
let schemaReady: Promise<void> | undefined;

function getSql() {
  const url = process.env["DATABASE_URL"]?.trim();
  if (!url) return undefined;
  sqlClient ??= postgres(url, { max: 5, idle_timeout: 20 });
  return sqlClient;
}

async function ensurePostgresSchema() {
  const sql = getSql();
  if (!sql) return;

  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        category TEXT NOT NULL,
        pieces_per_box TEXT NOT NULL DEFAULT '',
        boxes_per_carton TEXT NOT NULL DEFAULT '',
        sku TEXT NOT NULL DEFAULT '',
        image_url TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS products_active_category_idx
      ON products (active, category)
    `;
  })();

  await schemaReady;
}

function mapRow(row: Record<string, unknown>): Product {
  return {
    id: String(row["id"]),
    name: String(row["name"]),
    brand: String(row["brand"]),
    category: String(row["category"]),
    piecesPerBox: String(row["pieces_per_box"] ?? ""),
    boxesPerCarton: String(row["boxes_per_carton"] ?? ""),
    sku: String(row["sku"] ?? ""),
    imageUrl: String(row["image_url"] ?? ""),
    description: String(row["description"] ?? ""),
    active: Boolean(row["active"]),
    createdAt: new Date(String(row["created_at"])).toISOString(),
    updatedAt: new Date(String(row["updated_at"])).toISOString(),
  };
}

async function readLocalProducts(): Promise<Product[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const contents = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(contents) as unknown;
    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeLocalProducts([]);
      return [];
    }
    throw error;
  }
}

async function writeLocalProducts(products: Product[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(TEMP_FILE, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  await rename(TEMP_FILE, DATA_FILE);
}

export async function listProducts(options: { publicOnly?: boolean } = {}): Promise<Product[]> {
  const sql = getSql();
  if (sql) {
    await ensurePostgresSchema();
    const rows = options.publicOnly
      ? await sql`SELECT * FROM products WHERE active = TRUE ORDER BY category, brand, name`
      : await sql`SELECT * FROM products ORDER BY updated_at DESC, name`;
    return rows.map((row) => mapRow(row));
  }

  const products = await readLocalProducts();
  return products
    .filter((product) => !options.publicOnly || product.active)
    .sort((a, b) =>
      options.publicOnly
        ? `${a.category}${a.brand}${a.name}`.localeCompare(`${b.category}${b.brand}${b.name}`)
        : b.updatedAt.localeCompare(a.updatedAt),
    );
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const now = new Date().toISOString();
  const product: Product = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  const sql = getSql();
  if (sql) {
    await ensurePostgresSchema();
    await sql`
      INSERT INTO products (
        id, name, brand, category, pieces_per_box, boxes_per_carton, sku, image_url, description,
        active, created_at, updated_at
      ) VALUES (
        ${product.id}, ${product.name}, ${product.brand}, ${product.category},
        ${product.piecesPerBox}, ${product.boxesPerCarton}, ${product.sku},
        ${product.imageUrl}, ${product.description},
        ${product.active}, ${product.createdAt}, ${product.updatedAt}
      )
    `;
    return product;
  }

  const products = await readLocalProducts();
  products.push(product);
  await writeLocalProducts(products);
  return product;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const updatedAt = new Date().toISOString();
  const sql = getSql();
  if (sql) {
    await ensurePostgresSchema();
    const rows = await sql`
      UPDATE products SET
        name = ${input.name},
        brand = ${input.brand},
        category = ${input.category},
        pieces_per_box = ${input.piecesPerBox},
        boxes_per_carton = ${input.boxesPerCarton},
        sku = ${input.sku},
        image_url = ${input.imageUrl},
        description = ${input.description},
        active = ${input.active},
        updated_at = ${updatedAt}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows[0]) throw new Error("Product not found.");
    return mapRow(rows[0]);
  }

  const products = await readLocalProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) throw new Error("Product not found.");
  const product = { ...products[index]!, ...input, updatedAt };
  products[index] = product;
  await writeLocalProducts(products);
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const sql = getSql();
  if (sql) {
    await ensurePostgresSchema();
    await sql`DELETE FROM products WHERE id = ${id}`;
    return;
  }

  const products = await readLocalProducts();
  await writeLocalProducts(products.filter((product) => product.id !== id));
}
