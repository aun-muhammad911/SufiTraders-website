import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

import heroImg768 from "@/assets/hero-warehouse-768w.webp";
import heroImg1280 from "@/assets/hero-warehouse-1280w.webp";
import heroImg1920 from "@/assets/hero-warehouse-optimized.webp";

const EASE = [0.19, 1, 0.22, 1] as const;

const FLOATING_BRANDS = [
  { name: "Innovative Biscuits", x: "72%", y: "18%", d: 0 },
  { name: "GSK", x: "88%", y: "42%", d: 1.2 },
  { name: "Herbion Naturals", x: "72%", y: "50%", d: 1.7 },
  { name: "Dabur Amla", x: "68%", y: "66%", d: 2.1 },
  { name: "Molfix", x: "84%", y: "80%", d: 0.6 },
];

const TRUST = [
  { k: "Since", v: "2001" },
  { k: "Brands", v: "08" },
  { k: "Coverage", v: "Daska & Surrounding" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate min-h-[calc(100svh-3.25rem)] overflow-hidden bg-navy-deep sm:min-h-dvh"
    >
      <m.div style={{ y: imgY }} className="absolute inset-0 -z-10 scale-110">
        <m.img
          src={heroImg1920}
          srcSet={`${heroImg768} 768w, ${heroImg1280} 1280w, ${heroImg1920} 1920w`}
          sizes="110vw"
          alt="Pallet racking and a forklift moving stock inside a modern FMCG distribution warehouse"
          width={1920}
          height={1280}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: EASE }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,color-mix(in_oklab,var(--navy-deep)_92%,transparent)_0%,color-mix(in_oklab,var(--navy-deep)_62%,transparent)_48%,color-mix(in_oklab,var(--navy-deep)_28%,transparent)_100%)]" />
      </m.div>

      {/* floating brand chips */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {FLOATING_BRANDS.map((b) => (
          <m.span
            key={b.name}
            className="absolute rounded-full border border-on-dark/20 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-on-dark-soft backdrop-blur-sm"
            style={{ left: b.x, top: b.y }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.9, y: [0, -14, 0] }}
            transition={{
              opacity: { duration: 1.2, delay: 1.2 + b.d * 0.15 },
              y: { duration: 9 + b.d, repeat: Infinity, ease: "easeInOut", delay: b.d },
            }}
          >
            {b.name}
          </m.span>
        ))}
      </div>

      <m.div
        style={{ y: contentY, opacity: fade }}
        className="mx-auto flex min-h-[calc(100svh-3.25rem)] max-w-[1400px] flex-col justify-end px-4 pb-8 pt-24 sm:min-h-dvh sm:px-6 sm:pb-28 sm:pt-36 lg:px-12 lg:pb-24"
      >
        <m.p
          className="eyebrow text-gold"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: EASE }}
        >
          FMCG Distribution · Daska, Punjab
        </m.p>

        <h1 className="mt-4 max-w-5xl font-display text-[2.2rem] font-semibold leading-[1.02] text-on-dark sm:mt-6 sm:text-6xl lg:text-[5.2rem]">
          {"Sufi Traders — Trusted FMCG Distributor in Daska".split(" ").map((w, i) => (
            <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
              <m.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, delay: 1.05 + i * 0.05, ease: EASE }}
              >
                {w}
                {"\u00A0"}
              </m.span>
            </span>
          ))}
        </h1>

        <m.p
          className="mt-5 max-w-xl text-[0.92rem] leading-relaxed text-on-dark-soft sm:mt-8 sm:text-base lg:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6, ease: EASE }}
        >
          Supplying retailers, wholesalers and businesses across Daska and surrounding areas with
          trusted consumer brands, dependable distribution and professional service.
        </m.p>

        <m.div
          className="mt-6 grid grid-cols-2 items-center gap-2 sm:mt-10 sm:flex sm:flex-wrap sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.75, ease: EASE }}
        >
          <a
            href="#contact"
            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold px-4 text-xs font-bold tracking-wide text-navy-deep transition-transform duration-300 hover:-translate-y-0.5 sm:min-h-12 sm:gap-3 sm:px-7 sm:text-sm"
          >
            Contact Us
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
          <a
            href="#brands"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-on-dark/30 px-4 text-xs font-semibold tracking-wide text-on-dark transition-colors duration-300 hover:bg-on-dark/10 sm:min-h-12 sm:gap-3 sm:px-7 sm:text-sm"
          >
            Explore Brands
          </a>
        </m.div>

        <m.dl
          className="mt-7 grid grid-cols-3 gap-3 border-t border-on-dark/15 pt-5 sm:mt-16 sm:flex sm:flex-wrap sm:gap-x-14 sm:gap-y-6 sm:pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.9 }}
        >
          {TRUST.map((t) => (
            <div key={t.k}>
              <dt className="eyebrow text-on-dark-soft">{t.k}</dt>
              <dd
                className={`mt-1 font-display leading-tight text-on-dark sm:mt-2 sm:text-2xl ${
                  t.k === "Coverage" ? "text-[0.95rem]" : "text-xl"
                }`}
              >
                {t.v}
              </dd>
            </div>
          ))}
          <div className="ml-auto hidden items-center gap-2 self-end text-xs text-on-dark-soft lg:flex">
            <ArrowDown size={14} className="animate-bounce" /> Scroll
          </div>
        </m.dl>
      </m.div>
    </section>
  );
}
