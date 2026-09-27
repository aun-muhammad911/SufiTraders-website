import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Check,
  ChevronDown,
  MessageCircle,
  Minus,
  Palette,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";

import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { PHONE_WA } from "./chrome";
import { Reveal, TextReveal } from "./primitives";

const CART_STORAGE_KEY = "sufi-traders-cart";
const LEGACY_SHADE_STORAGE_KEY = "sufi-traders-selected-shades";
const WHATSAPP_PRODUCT_COLUMN_WIDTH = 24;
const GARNIER_COLOR_NATURALS_ID = "2c0f9449-47e8-498f-b9db-4221eb8c93e2";

type GarnierShade = {
  number: string;
  name: string;
  color: string;
};

const GARNIER_SHADE_CATEGORIES: Array<{
  name: string;
  accent: string;
  shades: GarnierShade[];
}> = [
  {
    name: "Blacks",
    accent: "#101010",
    shades: [
      { number: "1", name: "Natural Black", color: "#08090a" },
      { number: "2", name: "Soft Black", color: "#211719" },
    ],
  },
  {
    name: "Browns",
    accent: "#76502f",
    shades: [
      { number: "3", name: "Natural Dark Brown", color: "#241713" },
      { number: "3.3", name: "Coffee Brown Black", color: "#382018" },
      { number: "4", name: "Natural Brown", color: "#4a291b" },
      { number: "4.15", name: "Frosty Dark Mahogany", color: "#3a1b1b" },
      { number: "4.3", name: "Natural Golden Brown", color: "#6d351c" },
      { number: "4.7", name: "Dark Shiny Brown", color: "#492015" },
      { number: "5", name: "Light Brown", color: "#704229" },
      { number: "5.15", name: "Rich Chocolate", color: "#4b1f16" },
      { number: "5.3", name: "Light Golden Brown", color: "#6b351e" },
      { number: "5.2", name: "Creamy Coffee", color: "#61321f" },
      { number: "5.25", name: "Light Opal Mahogany Brown", color: "#4a1f2a" },
      { number: "6.7", name: "Pure Chocolate Brown", color: "#64252a" },
      { number: "7.7", name: "Deer Brown", color: "#9c6040" },
    ],
  },
  {
    name: "Reds",
    accent: "#9d1f27",
    shades: [
      { number: "3.6", name: "Deep Red Brown", color: "#46101b" },
      { number: "4.6", name: "Burgundy", color: "#6a1424" },
      { number: "6.66", name: "Intense Red", color: "#95142c" },
    ],
  },
  {
    name: "Blondes",
    accent: "#b68a53",
    shades: [
      { number: "6", name: "Natural Medium Blonde", color: "#7f604f" },
      { number: "6.1", name: "Dark Ash Blonde", color: "#6a5647" },
      { number: "6.3", name: "Golden Light Blonde", color: "#9f6b43" },
      { number: "6.34", name: "Chocolate", color: "#6d3e2a" },
      { number: "7", name: "Natural Blonde", color: "#a47d68" },
      { number: "7.1", name: "Natural Ash Blonde", color: "#967764" },
      { number: "7.3", name: "Natural Golden Blonde", color: "#b67538" },
    ],
  },
];

function findGarnierShade(number?: string) {
  if (!number) return undefined;
  return GARNIER_SHADE_CATEGORIES.flatMap((category) => category.shades).find(
    (shade) => shade.number === number,
  );
}

function productCartKey(productId: string, shadeNumber?: string) {
  return shadeNumber ? `${productId}::${shadeNumber}` : productId;
}

function parseProductCartKey(key: string) {
  const [productId, shadeNumber] = key.split("::");
  return { productId, shadeNumber };
}

function wrapTableCell(value: string, width: number) {
  const words = value.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (word.length > width) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }
      for (let index = 0; index < word.length; index += width) {
        lines.push(word.slice(index, index + width));
      }
      continue;
    }

    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length <= width) {
      currentLine = nextLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines.length > 0 ? lines : [""];
}

function createWhatsAppOrderTable(
  items: Array<{ product: Product; quantity: number; shadeLabel?: string }>,
) {
  const productHeading = "Product".padEnd(WHATSAPP_PRODUCT_COLUMN_WIDTH);
  const divider = `${"-".repeat(WHATSAPP_PRODUCT_COLUMN_WIDTH)}-+---------`;
  const rows = items.flatMap(({ product, quantity, shadeLabel }) =>
    wrapTableCell(
      `${product.name}${shadeLabel ? ` — Shade ${shadeLabel}` : ""}`,
      WHATSAPP_PRODUCT_COLUMN_WIDTH,
    ).map(
      (line, index) =>
        `${line.padEnd(WHATSAPP_PRODUCT_COLUMN_WIDTH)} | ${index === 0 ? String(quantity) : ""}`,
    ),
  );

  return ["```", `${productHeading} | Quantity`, divider, ...rows, "```"].join("\n");
}

export function ProductCatalogue({
  products,
  brand,
  category,
}: {
  products: Product[];
  brand?: string;
  category?: string;
}) {
  const matchingProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (!brand || product.brand === brand) && (!category || product.category === category),
      ),
    [brand, category, products],
  );
  const categories = useMemo(
    () => Array.from(new Set(matchingProducts.map((product) => product.category))).sort(),
    [matchingProducts],
  );
  const [selectedCategory, setSelectedCategory] = useState(category ?? "All");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [shadeCardOpen, setShadeCardOpen] = useState(false);
  const [activeShadeCategory, setActiveShadeCategory] = useState("Blacks");
  const [pendingShades, setPendingShades] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as Record<string, number>;
        const savedShades = window.localStorage.getItem(LEGACY_SHADE_STORAGE_KEY);
        const legacyShades = savedShades ? (JSON.parse(savedShades) as Record<string, string>) : {};
        const legacyShade = legacyShades[GARNIER_COLOR_NATURALS_ID];
        const legacyQuantity = parsedCart[GARNIER_COLOR_NATURALS_ID];

        if (legacyShade && legacyQuantity) {
          parsedCart[productCartKey(GARNIER_COLOR_NATURALS_ID, legacyShade)] = legacyQuantity;
          delete parsedCart[GARNIER_COLOR_NATURALS_ID];
        }
        setCart(parsedCart);
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_SHADE_STORAGE_KEY);
    } finally {
      setCartReady(true);
    }
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, cartReady]);

  useEffect(() => {
    if (!shadeCardOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShadeCardOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [shadeCardOpen]);

  const visibleProducts =
    selectedCategory === "All"
      ? matchingProducts
      : matchingProducts.filter((product) => product.category === selectedCategory);
  const catalogueName = brand ?? category;
  const productsById = new Map(products.map((product) => [product.id, product]));
  const cartItems = Object.entries(cart).flatMap(([key, quantity]) => {
    if (quantity <= 0) return [];
    const { productId, shadeNumber } = parseProductCartKey(key);
    const product = productsById.get(productId);
    if (!product) return [];
    const shade = findGarnierShade(shadeNumber);
    return [
      {
        key,
        product,
        quantity,
        shadeLabel: shade ? `${shade.number} ${shade.name}` : undefined,
      },
    ];
  });
  const garnierShadeItems = cartItems.filter(
    (item) => item.product.id === GARNIER_COLOR_NATURALS_ID && item.shadeLabel,
  );
  const totalUnits = cartItems.reduce((total, item) => total + item.quantity, 0);

  const updateQuantity = (key: string, change: number) => {
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[key] ?? 0) + change);
      if (nextQuantity === 0) {
        const next = { ...current };
        delete next[key];
        return next;
      }
      return { ...current, [key]: nextQuantity };
    });
  };

  const openShadeSelector = () => {
    setPendingShades([]);
    setActiveShadeCategory("Blacks");
    setShadeCardOpen(true);
  };

  const addToCart = (productId: string) => {
    if (productId === GARNIER_COLOR_NATURALS_ID) {
      openShadeSelector();
      return;
    }
    updateQuantity(productId, 1);
  };

  const togglePendingShade = (shadeNumber: string) => {
    setPendingShades((current) =>
      current.includes(shadeNumber)
        ? current.filter((number) => number !== shadeNumber)
        : [...current, shadeNumber],
    );
  };

  const confirmGarnierShades = () => {
    if (pendingShades.length === 0) return;
    setCart((current) => {
      const next = { ...current };
      for (const shadeNumber of pendingShades) {
        const key = productCartKey(GARNIER_COLOR_NATURALS_ID, shadeNumber);
        next[key] = (next[key] ?? 0) + 1;
      }
      return next;
    });
    setShadeCardOpen(false);
  };

  const pendingGarnierShades = pendingShades
    .map((shadeNumber) => findGarnierShade(shadeNumber))
    .filter((shade): shade is GarnierShade => Boolean(shade));

  const whatsappOrder = [
    "*SUFI TRADERS — ORDER REQUEST*",
    "",
    "*Order Summary*",
    createWhatsAppOrderTable(cartItems),
    "",
    `*Different products:* ${cartItems.length}`,
    `*Total quantity:* ${totalUnits} units`,
    "",
    "*Customer Details*",
    "Name:",
    "Shop / Business:",
    "Delivery Area:",
    "",
    "Please confirm product availability, wholesale prices and the final invoice.",
  ].join("\n");
  const checkoutUrl = `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(whatsappOrder)}`;

  const versionedImageUrl = (product: Product) =>
    product.imageUrl.startsWith("/products/")
      ? `${product.imageUrl}${product.imageUrl.includes("?") ? "&" : "?"}v=${encodeURIComponent(product.updatedAt)}`
      : product.imageUrl;

  return (
    <section
      id="products"
      className={cn(
        "border-y border-hairline bg-secondary py-16 sm:py-24 lg:py-40",
        totalUnits > 0 && "pb-36 sm:pb-40 lg:pb-48",
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal className="eyebrow">Product catalogue</Reveal>
            <h2 className="mt-4 font-display text-[1.75rem] font-semibold leading-[1.1] text-navy sm:mt-6 sm:text-4xl lg:text-[3.4rem]">
              <TextReveal
                text={
                  catalogueName
                    ? `${catalogueName} products.`
                    : "Available lines, managed by our team."
                }
              />
            </h2>
          </div>
          <Reveal
            delay={0.1}
            className="text-sm leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9"
          >
            Browse currently published products, then send your quantities through our WhatsApp
            quotation form for availability and wholesale pricing.
          </Reveal>
        </div>

        {matchingProducts.length === 0 ? (
          <Reveal className="mt-9 border border-dashed border-hairline bg-background p-6 text-center sm:mt-14 sm:p-10">
            <Box size={30} className="mx-auto text-gold" />
            <h3 className="mt-5 font-display text-xl text-navy">No products published here yet</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
              Contact our team for current stock, pack sizes and wholesale availability in this
              range.
            </p>
            <a
              href="/#whatsapp-quote"
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-bold text-on-dark"
            >
              <MessageCircle size={16} /> Request current availability
            </a>
          </Reveal>
        ) : (
          <>
            <Reveal className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-12 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              {["All", ...categories].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors",
                    selectedCategory === category
                      ? "border-navy bg-navy text-on-dark"
                      : "border-hairline bg-background text-ink-soft hover:border-navy hover:text-navy",
                  )}
                >
                  {category}
                </button>
              ))}
            </Reveal>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <Reveal key={product.id} delay={(index % 4) * 0.04}>
                  <article className="group flex h-full flex-col border border-hairline bg-background p-2 [contain-intrinsic-size:auto_420px] [content-visibility:auto] transition-transform duration-500 hover:-translate-y-1 hover:shadow-lift sm:p-4">
                    <div className="grid aspect-square place-items-center overflow-hidden bg-secondary">
                      {product.imageUrl ? (
                        <img
                          src={versionedImageUrl(product)}
                          alt={`${product.name} by ${product.brand}`}
                          loading={index === 0 ? "eager" : "lazy"}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          decoding="async"
                          className="size-full object-contain object-center p-5 sm:p-8"
                        />
                      ) : (
                        <Box size={32} className="text-gold" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col px-1 pb-1 pt-3 sm:px-2 sm:pb-2 sm:pt-5">
                      <div className="flex flex-col items-start gap-1 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:text-[0.68rem] sm:tracking-[0.13em]">
                        <span>{product.brand}</span>
                        <span>{product.category}</span>
                      </div>
                      <h3 className="mt-2 font-display text-sm font-semibold leading-snug text-navy sm:mt-3 sm:text-lg">
                        {product.name}
                      </h3>
                      {(product.piecesPerBox || product.boxesPerCarton) && (
                        <p className="mt-2 text-xs font-semibold leading-relaxed text-gold">
                          {product.piecesPerBox && `${product.piecesPerBox} pieces / box`}
                          {product.piecesPerBox && product.boxesPerCarton && " · "}
                          {product.boxesPerCarton && `${product.boxesPerCarton} boxes / carton`}
                        </p>
                      )}
                      {product.description && (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                          {product.description}
                        </p>
                      )}
                      <div className="mt-auto pt-4 sm:pt-6">
                        {product.id === GARNIER_COLOR_NATURALS_ID ? (
                          <button
                            type="button"
                            onClick={openShadeSelector}
                            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-navy px-3 text-xs font-bold text-on-dark transition-colors hover:bg-navy-deep sm:min-h-11 sm:text-sm"
                          >
                            <Palette size={16} />
                            {garnierShadeItems.length > 0
                              ? `Add More Shades · ${garnierShadeItems.length} in cart`
                              : "Choose Shades"}
                          </button>
                        ) : (cart[product.id] ?? 0) === 0 ? (
                          <button
                            type="button"
                            onClick={() => addToCart(product.id)}
                            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-navy px-3 text-xs font-bold text-on-dark transition-colors hover:bg-navy-deep sm:min-h-11 sm:text-sm"
                          >
                            <ShoppingCart size={15} /> Add to Cart
                          </button>
                        ) : (
                          <div
                            className="grid min-h-10 grid-cols-[2.5rem_1fr_2.5rem] items-center overflow-hidden rounded-full border border-navy bg-background sm:min-h-11 sm:grid-cols-[2.75rem_1fr_2.75rem]"
                            aria-label={`Quantity for ${product.name}`}
                          >
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, -1)}
                              aria-label={`Decrease ${product.name} quantity`}
                              className="grid h-full place-items-center text-navy transition-colors hover:bg-secondary"
                            >
                              <Minus size={15} />
                            </button>
                            <span className="border-x border-hairline text-center text-sm font-bold text-navy">
                              {cart[product.id]}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, 1)}
                              aria-label={`Increase ${product.name} quantity`}
                              className="grid h-full place-items-center bg-navy text-on-dark transition-colors hover:bg-navy-deep"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>

      {shadeCardOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-navy-deep/85 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="garnier-shade-card-title"
          onClick={() => setShadeCardOpen(false)}
        >
          <div
            className="flex max-h-[96dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-background shadow-2xl sm:max-h-[92vh] sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-hairline px-4 py-3 sm:px-6 sm:py-4">
              <div>
                <p className="eyebrow text-gold">Garnier Color Naturals</p>
                <h2
                  id="garnier-shade-card-title"
                  className="mt-1 font-display text-xl font-semibold text-navy sm:text-2xl"
                >
                  Choose one or more shades
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShadeCardOpen(false)}
                aria-label="Close shade card"
                className="grid size-10 shrink-0 place-items-center rounded-full border border-hairline text-navy transition-colors hover:bg-secondary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto bg-secondary p-3 sm:p-6">
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center">
                {GARNIER_SHADE_CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => setActiveShadeCategory(category.name)}
                    className={cn(
                      "flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-bold transition-colors sm:text-sm",
                      activeShadeCategory === category.name
                        ? "border-navy bg-navy text-on-dark"
                        : "border-hairline bg-background text-ink-soft hover:border-navy hover:text-navy",
                    )}
                  >
                    <span
                      className="size-3 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: category.accent }}
                    />
                    {category.name}
                    <span className="opacity-60">({category.shades.length})</span>
                  </button>
                ))}
              </div>

              {GARNIER_SHADE_CATEGORIES.filter(
                (category) => category.name === activeShadeCategory,
              ).map((category) => (
                <div
                  key={category.name}
                  className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4"
                >
                  {category.shades.map((shade) => {
                    const selected = pendingShades.includes(shade.number);
                    return (
                      <button
                        key={shade.number}
                        type="button"
                        onClick={() => togglePendingShade(shade.number)}
                        aria-pressed={selected}
                        className={cn(
                          "relative flex min-h-32 flex-col items-center justify-center rounded-2xl border bg-background p-3 text-center transition-all sm:min-h-36",
                          selected
                            ? "border-forest ring-2 ring-forest/20"
                            : "border-hairline hover:-translate-y-0.5 hover:border-gold hover:shadow-sm",
                        )}
                      >
                        {selected && (
                          <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-forest text-on-dark">
                            <Check size={14} strokeWidth={3} />
                          </span>
                        )}
                        <span
                          className="relative mb-3 block size-14 rotate-45 overflow-hidden rounded-[55%_55%_55%_12%] shadow-md sm:size-16"
                          style={{
                            background: `linear-gradient(135deg, ${shade.color} 8%, color-mix(in srgb, ${shade.color}, white 28%) 48%, ${shade.color} 82%)`,
                          }}
                        >
                          <span className="absolute inset-x-1 top-4 h-px -rotate-12 bg-white/30" />
                          <span className="absolute inset-x-1 top-7 h-px -rotate-12 bg-white/20" />
                        </span>
                        <span className="text-sm font-black text-forest">{shade.number}</span>
                        <span className="mt-1 text-xs font-semibold leading-tight text-navy sm:text-sm">
                          {shade.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-hairline px-4 py-3 sm:px-6 sm:py-4">
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-soft">
                  Selected shades
                </p>
                <p className="mt-0.5 truncate text-sm font-bold text-navy">
                  {pendingGarnierShades.length > 0
                    ? `${pendingGarnierShades.length} selected · ${pendingGarnierShades.map((shade) => shade.number).join(", ")}`
                    : "Select one or more colors above"}
                </p>
              </div>
              <button
                type="button"
                onClick={confirmGarnierShades}
                disabled={pendingGarnierShades.length === 0}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-forest px-5 text-xs font-bold text-on-dark transition-colors hover:bg-navy disabled:cursor-not-allowed disabled:opacity-40 sm:px-6 sm:text-sm"
              >
                <Check size={16} />
                {pendingGarnierShades.length > 0
                  ? `Add ${pendingGarnierShades.length} ${pendingGarnierShades.length === 1 ? "Shade" : "Shades"}`
                  : "Select Shades"}
              </button>
            </div>
          </div>
        </div>
      )}

      {totalUnits > 0 && (
        <aside
          aria-label="Shopping cart"
          className="fixed inset-x-0 bottom-0 z-[80] px-2 pb-2 sm:px-4 sm:pb-4"
        >
          <div className="mx-auto max-w-4xl overflow-hidden border border-on-dark/15 bg-navy-deep text-on-dark shadow-[0_-16px_50px_rgba(7,29,62,0.28)]">
            {cartOpen && (
              <div className="max-h-[34vh] overflow-y-auto border-b border-on-dark/10 px-3 py-2.5 sm:max-h-[45vh] sm:px-6 sm:py-5">
                <div className="mb-2 flex items-center justify-between gap-4 sm:mb-3">
                  <div>
                    <p className="eyebrow text-gold">Your cart</p>
                    <p className="mt-1 hidden text-xs text-on-dark-soft sm:block">
                      Wholesale pricing will be confirmed on WhatsApp.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCart({})}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-on-dark-soft hover:text-on-dark"
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-on-dark/15 pb-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-on-dark-soft sm:hidden">
                  <span>Product</span>
                  <span className="w-[6.75rem] text-center">Quantity</span>
                </div>
                <div className="divide-y divide-on-dark/10">
                  {cartItems.map(({ key, product, quantity, shadeLabel }) => (
                    <div
                      key={key}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-1.5 sm:gap-4 sm:py-3"
                    >
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-xs font-semibold leading-tight text-on-dark sm:truncate sm:text-sm">
                          {product.name}
                        </p>
                        {shadeLabel && (
                          <p className="mt-0.5 text-[0.65rem] font-bold text-gold">
                            Shade {shadeLabel}
                          </p>
                        )}
                        <p className="mt-0.5 hidden text-[0.65rem] uppercase tracking-wider text-on-dark-soft sm:block">
                          {product.brand} · {product.category}
                        </p>
                      </div>
                      <div className="grid min-h-8 grid-cols-[2rem_2.75rem_2rem] items-center overflow-hidden rounded-full border border-on-dark/20 sm:min-h-9 sm:grid-cols-[2.25rem_2.5rem_2.25rem]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(key, -1)}
                          aria-label={`Decrease ${product.name}${shadeLabel ? ` shade ${shadeLabel}` : ""} quantity in cart`}
                          className="grid h-full place-items-center hover:bg-on-dark/10"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-center text-sm font-bold">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(key, 1)}
                          aria-label={`Increase ${product.name}${shadeLabel ? ` shade ${shadeLabel}` : ""} quantity in cart`}
                          className="grid h-full place-items-center bg-gold text-navy-deep"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-[1fr_auto] items-center gap-3 p-3 sm:grid-cols-[1fr_auto_auto] sm:gap-5 sm:p-4">
              <button
                type="button"
                onClick={() => setCartOpen((open) => !open)}
                aria-expanded={cartOpen}
                className="flex min-w-0 items-center gap-3 text-left"
              >
                <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-gold text-navy-deep sm:size-11">
                  <ShoppingCart size={18} />
                  <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-on-dark px-1 text-[0.6rem] font-black text-navy-deep">
                    {totalUnits}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">
                    {cartItems.length} {cartItems.length === 1 ? "product" : "products"} ·{" "}
                    {totalUnits} units
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-[0.65rem] font-semibold text-on-dark-soft">
                    {cartOpen ? "Hide cart" : "View cart"}
                    <ChevronDown
                      size={13}
                      className={cn("transition-transform", cartOpen && "rotate-180")}
                    />
                  </span>
                </span>
              </button>

              <span className="hidden text-xs text-on-dark-soft sm:block">No online payment</span>

              <a
                href={checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-xs font-black text-[#062b15] transition-transform hover:-translate-y-0.5 sm:px-6 sm:text-sm"
              >
                <MessageCircle size={16} />
                <span className="hidden sm:inline">Checkout on WhatsApp</span>
                <span className="sm:hidden">Checkout</span>
              </a>
            </div>
          </div>
        </aside>
      )}
    </section>
  );
}
