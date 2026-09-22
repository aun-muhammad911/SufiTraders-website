import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  Box,
  Check,
  CheckCircle2,
  Edit3,
  ExternalLink,
  ImagePlus,
  Inbox,
  LoaderCircle,
  LogOut,
  PackagePlus,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  addProduct,
  editProduct,
  getAdminDashboard,
  loginAdmin,
  logoutAdmin,
  removeProduct,
  updateEnquiryResolution,
} from "@/lib/product-functions";
import type { Enquiry } from "@/lib/enquiries";
import {
  PRODUCT_BRANDS,
  PRODUCT_CATEGORIES,
  type Product,
  type ProductInput,
} from "@/lib/products";

const EMPTY_PRODUCT: ProductInput = {
  name: "",
  brand: "",
  category: "",
  piecesPerBox: "",
  boxesPerCarton: "",
  sku: "",
  imageUrl: "",
  description: "",
  active: true,
};

export const Route = createFileRoute("/products-admin")({
  loader: () => getAdminDashboard(),
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Product Admin | Sufi Traders" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminPage() {
  const data = Route.useLoaderData();
  return data.authenticated ? (
    <Dashboard products={data.products} enquiries={data.enquiries} />
  ) : (
    <Login />
  );
}

function Login() {
  const router = useRouter();
  const login = useServerFn(loginAdmin);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      await login({ data: { password: String(form.get("password") ?? "") } });
      toast.success("Signed in successfully.");
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-secondary px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
          <ArrowLeft size={16} /> Back to website
        </Link>

        <section className="mt-10 border border-hairline bg-background p-7 shadow-lift sm:p-10">
          <div className="grid size-12 place-items-center rounded-full bg-navy text-gold">
            <ShieldCheck size={22} />
          </div>
          <p className="eyebrow mt-8">Protected access</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-navy">Website admin</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Sign in to manage products and review business enquiries received from the website.
          </p>

          <form onSubmit={onSubmit} className="mt-8">
            <label htmlFor="admin-password" className="eyebrow block">
              Admin password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="mt-3 h-12 w-full border-0 border-b border-hairline bg-transparent text-base text-navy outline-none focus:border-navy"
            />
            <button
              type="submit"
              disabled={busy}
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-navy px-6 text-sm font-bold text-on-dark transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-5 text-xs leading-relaxed text-ink-soft">
            Use the private admin password configured for this website.
          </p>
        </section>
      </div>
    </main>
  );
}

function Dashboard({ products, enquiries }: { products: Product[]; enquiries: Enquiry[] }) {
  const router = useRouter();
  const logout = useServerFn(logoutAdmin);
  const add = useServerFn(addProduct);
  const edit = useServerFn(editProduct);
  const remove = useServerFn(removeProduct);
  const updateResolution = useServerFn(updateEnquiryResolution);
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    await router.invalidate();
  };

  const onSave = async (product: ProductInput) => {
    setBusy(true);
    try {
      if (editing === "new") {
        await add({ data: { product } });
        toast.success("Product added to the catalogue.");
      } else if (editing) {
        await edit({ data: { id: editing.id, product } });
        toast.success("Product updated.");
      }
      setEditing(null);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Product could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (product: Product) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await remove({ data: { id: product.id } });
      toast.success("Product deleted.");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Product could not be deleted.");
    } finally {
      setBusy(false);
    }
  };

  const onLogout = async () => {
    await logout();
    await refresh();
  };

  const onResolve = async (enquiry: Enquiry) => {
    setBusy(true);
    try {
      await updateResolution({ data: { id: enquiry.id, resolved: true } });
      toast.success("Enquiry moved to resolved.");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enquiry could not be resolved.");
    } finally {
      setBusy(false);
    }
  };

  const activeCount = products.filter((product) => product.active).length;
  const openEnquiries = enquiries.filter((enquiry) => enquiry.status !== "resolved");
  const resolvedCount = enquiries.length - openEnquiries.length;

  return (
    <main className="min-h-screen bg-secondary">
      <header className="border-b border-hairline bg-background">
        <div className="mx-auto flex min-h-20 max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-12">
          <div>
            <p className="eyebrow">Sufi Traders</p>
            <h1 className="mt-1 font-display text-xl font-semibold text-navy">Website admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-hairline px-4 text-xs font-bold text-navy"
            >
              View website <ExternalLink size={14} />
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy px-4 text-xs font-bold text-on-dark"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-12 lg:py-14">
        <section>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Customer messages</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-navy sm:text-4xl">
                Business enquiries
              </h2>
              <p className="mt-3 text-sm text-ink-soft">
                {openEnquiries.length} open {openEnquiries.length === 1 ? "enquiry" : "enquiries"}
              </p>
            </div>
            <Link
              to="/enquiries-resolved"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-hairline bg-background px-5 text-sm font-bold text-navy transition-colors hover:border-navy"
            >
              <CheckCircle2 size={16} /> Resolved ({resolvedCount})
            </Link>
          </div>

          {openEnquiries.length === 0 ? (
            <div className="mt-8 grid min-h-48 place-items-center border border-dashed border-hairline bg-background p-8 text-center">
              <div>
                <Inbox size={32} className="mx-auto text-gold" />
                <h3 className="mt-4 font-display text-lg text-navy">Inbox is clear</h3>
                <p className="mt-2 text-sm text-ink-soft">
                  New business enquiries submitted on the website will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {openEnquiries.map((enquiry) => (
                <article
                  key={enquiry.id}
                  className="border border-hairline bg-background p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-navy">
                        {enquiry.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-gold">{enquiry.business}</p>
                    </div>
                    <time className="text-xs text-ink-soft" dateTime={enquiry.createdAt}>
                      {new Date(enquiry.createdAt).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <a
                      className="font-semibold text-navy hover:text-forest"
                      href={`tel:${enquiry.phone}`}
                    >
                      {enquiry.phone}
                    </a>
                    {enquiry.email && (
                      <a
                        className="font-semibold text-navy hover:text-forest"
                        href={`mailto:${enquiry.email}`}
                      >
                        {enquiry.email}
                      </a>
                    )}
                  </div>
                  <p className="mt-5 whitespace-pre-wrap border-t border-hairline pt-4 text-sm leading-relaxed text-ink-soft">
                    {enquiry.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => onResolve(enquiry)}
                    disabled={busy}
                    className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-forest px-4 text-xs font-bold text-on-dark transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    <CheckCircle2 size={15} /> Mark as resolved
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="my-12 border-t border-hairline sm:my-16" />

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Catalogue management</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy sm:text-4xl">
              Products
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              {products.length} total · {activeCount} visible on website
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-bold text-navy-deep transition-transform hover:-translate-y-0.5"
          >
            <PackagePlus size={17} /> Add product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="mt-10 grid min-h-72 place-items-center border border-dashed border-hairline bg-background p-8 text-center">
            <div>
              <Box size={34} className="mx-auto text-gold" />
              <h3 className="mt-5 font-display text-xl text-navy">No products yet</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Add your first product to publish the catalogue.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-10 overflow-x-auto border border-hairline bg-background">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline bg-secondary text-xs uppercase tracking-[0.14em] text-ink-soft">
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Packing / SKU</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-hairline last:border-0">
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-4">
                        <div className="grid size-12 shrink-0 place-items-center overflow-hidden bg-secondary">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt="" className="size-full object-cover" />
                          ) : (
                            <Box size={20} className="text-gold" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-navy">{product.name}</div>
                          <div className="mt-1 text-xs text-ink-soft">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-sm text-ink-soft">{product.category}</td>
                    <td className="px-5 py-5 text-sm text-ink-soft">
                      <div>
                        {product.piecesPerBox
                          ? `${product.piecesPerBox} pieces / box`
                          : "No box quantity"}
                      </div>
                      <div className="mt-1 text-xs">
                        {product.boxesPerCarton
                          ? `${product.boxesPerCarton} boxes / carton`
                          : "No carton quantity"}
                      </div>
                      <div className="mt-1 text-xs">{product.sku || "No SKU"}</div>
                    </td>
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                          product.active ? "bg-forest/10 text-forest" : "bg-secondary text-ink-soft"
                        }`}
                      >
                        {product.active && <Check size={12} />}
                        {product.active ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditing(product)}
                          aria-label={`Edit ${product.name}`}
                          className="grid size-10 place-items-center rounded-full border border-hairline text-navy hover:border-navy"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(product)}
                          disabled={busy}
                          aria-label={`Delete ${product.name}`}
                          className="grid size-10 place-items-center rounded-full border border-hairline text-red-700 hover:border-red-700 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <ProductEditor
          product={editing === "new" ? undefined : editing}
          busy={busy}
          onClose={() => setEditing(null)}
          onSave={onSave}
        />
      )}
    </main>
  );
}

function ProductEditor({
  product,
  busy,
  onClose,
  onSave,
}: {
  product?: Product | undefined;
  busy: boolean;
  onClose: () => void;
  onSave: (product: ProductInput) => Promise<void>;
}) {
  const [form, setForm] = useState<ProductInput>(product ?? EMPTY_PRODUCT);
  const [imageBusy, setImageBusy] = useState(false);
  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onImageSelected = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be smaller than 8 MB.");
      return;
    }

    setImageBusy(true);
    try {
      set("imageUrl", await optimizeProductImage(file));
      toast.success("Product image added.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image could not be added.");
    } finally {
      setImageBusy(false);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-end bg-navy-deep/55 backdrop-blur-sm sm:items-stretch">
      <button
        type="button"
        aria-label="Close product editor"
        className="absolute inset-0"
        onClick={onClose}
      />
      <aside className="relative z-10 max-h-[92vh] w-full overflow-y-auto bg-background p-6 shadow-lift sm:max-h-none sm:max-w-xl sm:p-9 lg:p-11">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow">{product ? "Edit product" : "New product"}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-navy">
              {product?.name || "Add catalogue item"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-hairline text-navy"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-8 grid gap-6">
          <EditorField
            label="Product name"
            value={form.name}
            onChange={(value) => set("name", value)}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow">Brand</span>
              <select
                value={form.brand}
                onChange={(event) => set("brand", event.target.value)}
                className="mt-3 h-12 w-full border-0 border-b border-hairline bg-transparent text-base text-navy outline-none focus:border-navy"
              >
                <option value="">
                  No brand
                </option>
                {PRODUCT_BRANDS.map((brand) => (
                  <option key={brand}>{brand}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow">Category</span>
              <select
                value={form.category}
                onChange={(event) => set("category", event.target.value)}
                className="mt-3 h-12 w-full border-0 border-b border-hairline bg-transparent text-base text-navy outline-none focus:border-navy"
              >
                <option value="">No category</option>
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <EditorField
              label="Pieces per box"
              value={form.piecesPerBox}
              type="number"
              required={false}
              placeholder="e.g. 24"
              onChange={(value) => set("piecesPerBox", value)}
            />
            <EditorField
              label="Boxes per carton"
              value={form.boxesPerCarton}
              type="number"
              required={false}
              placeholder="e.g. 6"
              onChange={(value) => set("boxesPerCarton", value)}
            />
            <EditorField
              label="SKU (optional)"
              value={form.sku}
              required={false}
              onChange={(value) => set("sku", value)}
            />
          </div>

          <div>
            <span className="eyebrow block">Product image (optional)</span>
            <div className="mt-3 overflow-hidden border border-dashed border-hairline bg-secondary">
              {form.imageUrl ? (
                <div className="relative aspect-[4/3]">
                  <img
                    src={form.imageUrl}
                    alt="Product preview"
                    className="size-full object-contain p-4"
                  />
                  <button
                    type="button"
                    onClick={() => set("imageUrl", "")}
                    className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-navy text-on-dark shadow-lift"
                    aria-label="Remove product image"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ) : (
                <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center px-6 py-8 text-center">
                  {imageBusy ? (
                    <LoaderCircle size={28} className="animate-spin text-gold" />
                  ) : (
                    <ImagePlus size={30} className="text-gold" />
                  )}
                  <span className="mt-4 font-semibold text-navy">
                    {imageBusy ? "Optimizing image…" : "Choose product picture"}
                  </span>
                  <span className="mt-2 text-xs leading-relaxed text-ink-soft">
                    Upload from device or gallery · JPG, PNG or WebP · Maximum 8 MB
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={imageBusy}
                    onChange={(event) => onImageSelected(event.target.files?.[0])}
                    className="sr-only"
                  />
                </label>
              )}
            </div>
            {form.imageUrl && (
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-navy">
                <ImagePlus size={15} /> Replace picture
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={imageBusy}
                  onChange={(event) => onImageSelected(event.target.files?.[0])}
                  className="sr-only"
                />
              </label>
            )}
          </div>
          <label className="block">
            <span className="eyebrow">Description (optional)</span>
            <textarea
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
              rows={4}
              className="mt-3 w-full resize-none border-0 border-b border-hairline bg-transparent pb-3 text-base text-navy outline-none focus:border-navy"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-6 border-y border-hairline py-5">
            <span>
              <span className="block font-semibold text-navy">Published</span>
              <span className="mt-1 block text-xs text-ink-soft">
                Show this product on the public website.
              </span>
            </span>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => set("active", event.target.checked)}
              className="size-5 accent-[var(--navy)]"
            />
          </label>

          <button
            type="submit"
            disabled={busy || imageBusy}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-navy px-7 text-sm font-bold text-on-dark transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            <Save size={16} /> {busy ? "Saving…" : "Save product"}
          </button>
        </form>
      </aside>
    </div>
  );
}

async function optimizeProductImage(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("This image could not be read."));
      element.src = objectUrl;
    });

    const maxDimension = 1200;
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing is not available in this browser.");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, width, height);

    let output = canvas.toDataURL("image/webp", 0.82);
    if (output.length > 2_500_000) output = canvas.toDataURL("image/jpeg", 0.72);
    if (output.length > 2_500_000) {
      throw new Error("Image is still too large after optimization. Choose a smaller picture.");
    }
    return output;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function EditorField({
  label,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        min={type === "number" ? "0" : undefined}
        required={required}
        placeholder={placeholder}
        className="mt-3 h-12 w-full border-0 border-b border-hairline bg-transparent text-base text-navy outline-none placeholder:text-muted-foreground focus:border-navy"
      />
    </label>
  );
}
