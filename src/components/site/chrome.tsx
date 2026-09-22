import { useEffect, useState } from "react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { m, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Brands", href: "/#brands" },
  { label: "Products", href: "/products" },
  { label: "Catalogs", href: "/catalogs" },
  { label: "Get Quote", href: "/#whatsapp-quote" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/#contact" },
];

export const PHONE_DISPLAY = "+92 300 7440323";
export const PHONE_TEL = "+923007440323";
export const PHONE_WA = "923007440323";
export const ADDRESS = "Jamke Road, Jalalpur Ghumman, Daska, Punjab, Pakistan";
export const MAP_URL = "https://maps.app.goo.gl/XxcWXqaKoLgKkLUm6";
export const MAP_DIRECTIONS_URL = MAP_URL;
export const HOURS = "9:00 AM – 7:00 PM";

function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <a
      href="/#top"
      className="group flex items-baseline gap-2"
      aria-label="Sufi Traders — back to top"
    >
      <span
        className={cn(
          "font-display text-lg font-semibold tracking-[-0.04em]",
          tone === "light" ? "text-on-dark" : "text-navy",
        )}
      >
        Sufi Traders
      </span>
      <span className="h-1.5 w-1.5 rounded-full bg-gold transition-transform duration-500 group-hover:scale-150" />
    </a>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tone = scrolled ? "dark" : "light";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] transition-[background,backdrop-filter,border] duration-500",
        scrolled ? "glass-nav" : "glass-nav-dark",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-12"
      >
        <Wordmark tone={tone} />

        <ul className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={cn(
                  "link-underline text-[0.8rem] font-semibold tracking-wide transition-colors",
                  tone === "light"
                    ? "text-on-dark-soft hover:text-on-dark"
                    : "text-ink-soft hover:text-navy",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={`tel:${PHONE_TEL}`}
            className={cn(
              "text-[0.8rem] font-semibold tracking-wide",
              tone === "light" ? "text-on-dark" : "text-navy",
            )}
          >
            {PHONE_DISPLAY}
          </a>
          <a
            href="/#whatsapp-quote"
            className="rounded-full bg-gold px-5 py-2.5 text-[0.78rem] font-bold tracking-wide text-navy-deep transition-transform duration-300 hover:-translate-y-0.5"
          >
            Get Quote
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={cn(
            "grid size-10 place-items-center rounded-full border sm:size-11 lg:hidden",
            tone === "light" ? "border-on-dark/25 text-on-dark" : "border-hairline text-navy",
          )}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden bg-background lg:hidden"
          >
            <ul className="flex flex-col px-4 pb-5 pt-1 sm:px-6 sm:pb-6 sm:pt-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center border-b border-hairline font-display text-lg text-navy sm:min-h-14 sm:text-xl"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function FloatingActions() {
  return (
    <>
      <a
        href="/#whatsapp-quote"
        aria-label="Request a quotation on WhatsApp"
        className="fixed bottom-20 right-4 z-[65] grid size-12 place-items-center rounded-full bg-forest text-on-dark shadow-lift transition-transform duration-300 hover:scale-105 sm:bottom-24 sm:right-5 sm:size-14 md:bottom-8"
      >
        <MessageCircle size={22} />
      </a>

      <a
        href={`tel:${PHONE_TEL}`}
        className="fixed inset-x-0 bottom-0 z-[64] flex min-h-13 items-center justify-center gap-2 bg-navy text-sm font-bold tracking-wide text-on-dark md:hidden"
      >
        <Phone size={16} /> Call {PHONE_DISPLAY}
      </a>
    </>
  );
}

export function Footer() {
  return (
    <footer className="grain-navy pb-20 pt-14 text-on-dark sm:pb-24 sm:pt-20 md:pb-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Wordmark tone="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-on-dark-soft">
              FMCG distribution and wholesale supply, built on dependable service and long-term
              business relationships.
            </p>
          </div>

          <nav aria-label="Quick links">
            <h3 className="eyebrow text-on-dark-soft">Quick Links</h3>
            <ul className="mt-5 space-y-3 text-sm text-on-dark-soft">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a className="link-underline hover:text-on-dark" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="eyebrow text-on-dark-soft">Brands</h3>
            <ul className="mt-5 space-y-3 text-sm text-on-dark-soft">
              <li>Innovative Biscuits</li>
              <li>GSK Consumer Healthcare</li>
              <li>Sunbright</li>
              <li>Dabur Amla</li>
              <li>Herbion Naturals</li>
              <li>Molfix</li>
              <li>Garnier</li>
              <li>Loreal Pakistan</li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="eyebrow text-on-dark-soft">Contact</h3>
            <address className="mt-5 space-y-3 text-sm not-italic text-on-dark-soft">
              <p>
                <a
                  className="link-underline hover:text-on-dark"
                  href={MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  {ADDRESS}
                </a>
              </p>
              <p>
                <a className="link-underline hover:text-on-dark" href={`tel:${PHONE_TEL}`}>
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p>{HOURS}</p>
            </address>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-on-dark/10 pt-5 text-xs text-on-dark-soft sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <p>© {new Date().getFullYear()} Sufi Traders. All rights reserved.</p>
          <a href="/#contact" className="link-underline hover:text-on-dark">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
