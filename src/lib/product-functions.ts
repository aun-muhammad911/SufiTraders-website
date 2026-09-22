import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";

import { normalizeProductInput, type ProductInput } from "./products";
import { normalizeEnquiryInput } from "./enquiries";

const COOKIE_NAME = "st_admin_session";
const SESSION_MESSAGE = "sufi-traders-admin-session-v1";
const encoder = new TextEncoder();
const enquiryAttempts = new Map<string, number[]>();

function getAdminPassword() {
  const configured = process.env["ADMIN_PASSWORD"]?.trim();
  if (configured) return configured;
  if (process.env["NODE_ENV"] === "production") {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }
  return "sufi-admin";
}

function getSessionSecret() {
  const configured = process.env["ADMIN_SESSION_SECRET"]?.trim();
  if (configured) return configured;
  if (process.env["NODE_ENV"] === "production") {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }
  return "local-development-session-secret-change-on-vps";
}

function timingSafeEqual(left: string, right: string) {
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }
  return difference === 0;
}

function toBase64Url(bytes: Uint8Array) {
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function createSessionToken() {
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getSigningKey(),
    encoder.encode(SESSION_MESSAGE),
  );
  return toBase64Url(new Uint8Array(signature));
}

async function isValidSessionToken(token: string) {
  try {
    return await crypto.subtle.verify(
      "HMAC",
      await getSigningKey(),
      fromBase64Url(token),
      encoder.encode(SESSION_MESSAGE),
    );
  } catch {
    return false;
  }
}

function readCookie(name: string) {
  const cookie = getRequest().headers.get("cookie") ?? "";
  const entry = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : undefined;
}

async function isAdmin() {
  const token = readCookie(COOKIE_NAME);
  return token ? isValidSessionToken(token) : false;
}

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Your admin session has expired. Please sign in again.");
}

function setAdminCookie(token: string, maxAge: number) {
  const secure = process.env["NODE_ENV"] === "production" ? "; Secure" : "";
  setResponseHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure}`,
  );
}

function validateLogin(data: unknown) {
  const password = String((data as { password?: unknown })?.password ?? "");
  if (!password || password.length > 200) throw new Error("Enter a valid password.");
  return { password };
}

function validateProductMutation(data: unknown) {
  const input = data as { id?: unknown; product?: Partial<ProductInput> };
  const product = input.product ?? {};
  return {
    id: typeof input.id === "string" ? input.id : undefined,
    product: normalizeProductInput({
      name: String(product.name ?? ""),
      brand: String(product.brand ?? ""),
      category: String(product.category ?? ""),
      piecesPerBox: String(product.piecesPerBox ?? ""),
      boxesPerCarton: String(product.boxesPerCarton ?? ""),
      sku: String(product.sku ?? ""),
      imageUrl: String(product.imageUrl ?? ""),
      description: String(product.description ?? ""),
      active: product.active !== false,
    }),
  };
}

function validateEnquirySubmission(data: unknown) {
  const input = data as Record<string, unknown>;
  if (String(input["website"] ?? "").trim()) throw new Error("This enquiry could not be sent.");
  return normalizeEnquiryInput({
    name: String(input["name"] ?? ""),
    business: String(input["business"] ?? ""),
    phone: String(input["phone"] ?? ""),
    email: String(input["email"] ?? ""),
    message: String(input["message"] ?? ""),
  });
}

function enforceEnquiryRateLimit() {
  const request = getRequest();
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientKey = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const windowStart = now - 10 * 60 * 1_000;
  const recentAttempts = (enquiryAttempts.get(clientKey) ?? []).filter(
    (timestamp) => timestamp > windowStart,
  );
  if (recentAttempts.length >= 5) {
    throw new Error("Too many enquiries. Please wait a few minutes and try again.");
  }
  recentAttempts.push(now);
  enquiryAttempts.set(clientKey, recentAttempts);
}

export const getPublicProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { listProducts } = await import("./products.server");
  return listProducts({ publicOnly: true });
});

export const getAdminDashboard = createServerFn({ method: "GET" }).handler(async () => {
  const authenticated = await isAdmin();
  if (!authenticated) return { authenticated: false as const, products: [], enquiries: [] };
  const { listProducts } = await import("./products.server");
  const { listEnquiries } = await import("./enquiries.server");
  const [products, enquiries] = await Promise.all([listProducts(), listEnquiries()]);
  return { authenticated: true as const, products, enquiries };
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator(validateEnquirySubmission)
  .handler(async ({ data }) => {
    enforceEnquiryRateLimit();
    const { createEnquiry } = await import("./enquiries.server");
    const enquiry = await createEnquiry(data);
    return { success: true, id: enquiry.id };
  });

export const updateEnquiryResolution = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const input = data as { id?: unknown; resolved?: unknown };
    return { id: String(input.id ?? ""), resolved: input.resolved === true };
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!data.id) throw new Error("Enquiry id is required.");
    const { setEnquiryResolution } = await import("./enquiries.server");
    return setEnquiryResolution(data.id, data.resolved);
  });

export const loginAdmin = createServerFn({ method: "POST" })
  .validator(validateLogin)
  .handler(async ({ data }) => {
    if (!timingSafeEqual(data.password, getAdminPassword())) {
      throw new Error("Incorrect admin password.");
    }
    setAdminCookie(await createSessionToken(), 60 * 60 * 8);
    return { success: true };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  setAdminCookie("", 0);
  return { success: true };
});

export const addProduct = createServerFn({ method: "POST" })
  .validator(validateProductMutation)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { createProduct } = await import("./products.server");
    return createProduct(data.product);
  });

export const editProduct = createServerFn({ method: "POST" })
  .validator(validateProductMutation)
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!data.id) throw new Error("Product id is required.");
    const { updateProduct } = await import("./products.server");
    return updateProduct(data.id, data.product);
  });

export const removeProduct = createServerFn({ method: "POST" })
  .validator((data: unknown) => ({ id: String((data as { id?: unknown })?.id ?? "") }))
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!data.id) throw new Error("Product id is required.");
    const { deleteProduct } = await import("./products.server");
    await deleteProduct(data.id);
    return { success: true };
  });
