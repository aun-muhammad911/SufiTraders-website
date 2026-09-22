import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, MessageCircle, Phone } from "lucide-react";

import aboutImg640 from "@/assets/about-stock-management-640w.webp";
import aboutImg992 from "@/assets/about-stock-management-992w.webp";
import ctaImg from "@/assets/cta-fleet-optimized.webp";
import ctaImg960 from "@/assets/cta-fleet-960w.webp";
import biscuitsImg from "@/assets/cat-biscuits-optimized.webp";
import biscuitsImg640 from "@/assets/cat-biscuits-640w.webp";
import personalImg from "@/assets/cat-personal-optimized.webp";
import personalImg640 from "@/assets/cat-personal-640w.webp";
import babyImg from "@/assets/cat-baby-optimized.webp";
import babyImg640 from "@/assets/cat-baby-640w.webp";
import hairImg640 from "@/assets/cat-hair-range-v2-640w.webp";
import hairImg960 from "@/assets/cat-hair-range-v2-960w.webp";
import hairImg1448 from "@/assets/cat-hair-range-v2-1448w.webp";
import householdImg from "@/assets/cat-household-sunbrite-v2-1200w.webp";
import householdImg640 from "@/assets/cat-household-sunbrite-v2-640w.webp";
import essentialsImg from "@/assets/cat-fmcg-mentos-complan-v2-1200w.webp";
import essentialsImg640 from "@/assets/cat-fmcg-mentos-complan-v2-640w.webp";
import { Reveal, TextReveal, RevealImage, Counter, MouseHighlight } from "./primitives";
import { PHONE_DISPLAY, PHONE_TEL } from "./chrome";

function SwipeCue({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`mt-7 flex items-center justify-between border-y py-3 sm:hidden ${
        dark ? "border-on-dark/15 text-on-dark-soft" : "border-hairline text-ink-soft"
      }`}
    >
      <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em]">
        Swipe to see more
      </span>
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className={`h-1.5 w-5 rounded-full ${dark ? "bg-gold" : "bg-navy"}`} />
        <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-on-dark/30" : "bg-navy/20"}`} />
        <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-on-dark/30" : "bg-navy/20"}`} />
        <m.span
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className={dark ? "ml-1 text-gold" : "ml-1 text-navy"}
        >
          <ArrowRight size={18} strokeWidth={2} />
        </m.span>
      </div>
    </div>
  );
}

/* ---------------------------------- ABOUT --------------------------------- */

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section id="about" className="relative overflow-hidden py-16 sm:py-24 lg:py-44">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 sm:gap-14 sm:px-6 lg:grid-cols-12 lg:gap-24 lg:px-12">
        <div ref={ref} className="lg:col-span-5 lg:col-start-1">
          <m.div style={{ y }}>
            <RevealImage
              src={aboutImg992}
              srcSet={`${aboutImg640} 640w, ${aboutImg992} 992w`}
              sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), 42vw"
              alt="Two distribution managers reviewing stock records inside a Sufi Traders warehouse"
              width={1200}
              height={1504}
              className="aspect-[4/3] w-full sm:aspect-[4/5]"
              imgClassName="object-[50%_30%] sm:object-center"
            />
          </m.div>
          <Reveal
            delay={0.15}
            className="mt-4 max-w-sm text-xs leading-relaxed text-ink-soft sm:mt-6 sm:max-w-xs"
          >
            Daily coordination between warehouse, sales and delivery teams keeps retailer orders
            moving on schedule.
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal className="eyebrow">Who we are</Reveal>
          <h2 className="mt-4 font-display text-[1.75rem] font-semibold leading-[1.1] text-navy sm:mt-6 sm:text-4xl lg:text-[3.4rem]">
            <TextReveal text="A distribution partner built around consistency." />
          </h2>
          <Reveal
            delay={0.1}
            className="mt-5 max-w-xl text-sm leading-[1.75] text-ink-soft sm:mt-8 sm:text-base sm:leading-[1.9]"
          >
            Sufi Traders supplies retailers, wholesalers and businesses across the Daska region with
            consumer goods from established manufacturers. Our work is straightforward: hold the
            right stock, handle it properly, and deliver when we say we will.
          </Reveal>

          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 sm:mt-12 sm:gap-x-10 sm:gap-y-8">
            {[
              ["Professional distribution", "Structured order handling from intake to delivery."],
              ["Reliable partnerships", "Relationships measured in years, not orders."],
              ["Quality products", "Sourced only from established brand principals."],
              ["Efficient supply", "Planned routes and stock levels that avoid gaps."],
            ].map(([title, copy], i) => (
              <Reveal
                as="li"
                key={title}
                delay={0.05 * i}
                className="border-t border-hairline pt-5"
              >
                <h3 className="font-display text-base font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{copy}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- BRANDS --------------------------------- */

const BRANDS: Array<{
  name: string;
  mark: string;
  note: string;
  logo?: string;
  logoSrcSet?: string;
  lightLogo?: boolean;
  sunbriteLogo?: boolean;
}> = [
  {
    name: "Innovative Biscuits",
    mark: "IBL",
    logo: "/brands/innovative-logo.webp",
    logoSrcSet: "/brands/innovative-logo-640w.webp 640w, /brands/innovative-logo.webp 1370w",
    note: "Biscuits, wafers and snack lines.",
  },
  {
    name: "GSK Consumer Healthcare",
    mark: "GSK",
    logo: "/brands/gsk-logo.webp",
    logoSrcSet: "/brands/gsk-logo-640w.webp 640w, /brands/gsk-logo.webp 1536w",
    lightLogo: true,
    note: "Everyday consumer healthcare products.",
  },
  {
    name: "Sun-Brite",
    mark: "SB",
    logo: "/brands/sunbrite-logo.webp",
    logoSrcSet: "/brands/sunbrite-logo-640w.webp 640w, /brands/sunbrite-logo.webp 1536w",
    sunbriteLogo: true,
    note: "Household and cleaning essentials.",
  },
  {
    name: "Dabur",
    mark: "DB",
    logo: "/brands/dabur-logo.webp",
    logoSrcSet: "/brands/dabur-logo-640w.webp 640w, /brands/dabur-logo.webp 1200w",
    lightLogo: true,
    note: "Hair care and traditional care range.",
  },
  {
    name: "Herbion Naturals",
    mark: "HN",
    logo: "/brands/herbion-naturals-logo.webp",
    logoSrcSet:
      "/brands/herbion-naturals-logo-640w.webp 640w, /brands/herbion-naturals-logo.webp 1200w",
    lightLogo: true,
    note: "Natural healthcare and wellness products.",
  },
  {
    name: "Molfix",
    mark: "MX",
    logo: "/brands/molfix-logo.webp",
    logoSrcSet: "/brands/molfix-logo-640w.webp 640w, /brands/molfix-logo.webp 1200w",
    lightLogo: true,
    note: "Baby care, diapers and wipes.",
  },
  {
    name: "Garnier",
    mark: "GR",
    logo: "/brands/garnier-logo.webp",
    lightLogo: true,
    note: "Skin care, hair care and beauty essentials.",
  },
  {
    name: "Loreal Pakistan",
    mark: "LP",
    logo: "/brands/loreal-pakistan-logo.webp",
    logoSrcSet:
      "/brands/loreal-pakistan-logo-640w.webp 640w, /brands/loreal-pakistan-logo.webp 738w",
    lightLogo: true,
    note: "Hair care, skin care and beauty products.",
  },
];

export function Brands() {
  return (
    <section
      id="brands"
      className="relative isolate overflow-hidden grain-navy py-16 sm:py-24 lg:py-40"
    >
      <MouseHighlight />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal className="eyebrow text-gold">Brand network</Reveal>
            <h2 className="mt-4 font-display text-[1.75rem] font-semibold leading-[1.1] text-on-dark sm:mt-6 sm:text-4xl lg:text-[3.4rem]">
              <TextReveal text="Brands we are proud to carry." />
            </h2>
          </div>
          <Reveal
            delay={0.1}
            className="text-sm leading-relaxed text-on-dark-soft lg:col-span-4 lg:col-start-9"
          >
            A focused portfolio across food, personal care and household essentials — chosen for
            consistent demand and dependable supply.
          </Reveal>
        </div>

        <SwipeCue dark />
        <div
          role="region"
          aria-label="Brand cards. Swipe horizontally to see more."
          tabIndex={0}
          className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 pr-[18vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-px sm:overflow-hidden sm:border sm:border-on-dark/12 sm:bg-on-dark/12 sm:px-0 sm:pb-0 lg:grid-cols-3"
        >
          {BRANDS.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.06} className="min-w-[78vw] snap-start sm:min-w-0">
              <a
                href={`/products?brand=${encodeURIComponent(b.name)}`}
                aria-label={`View ${b.name} products`}
                className={`group relative block h-full bg-navy-deep transition-colors duration-500 hover:bg-navy ${
                  b.logo ? "min-h-[18rem] overflow-hidden sm:min-h-[21rem]" : "p-6 sm:p-8 lg:p-10"
                }`}
              >
                <div
                  className={
                    b.logo
                      ? `absolute inset-0 h-full w-full overflow-hidden ${
                          b.sunbriteLogo
                            ? "bg-[linear-gradient(135deg,#fff200_0%,#b7d719_36%,#63ae13_100%)]"
                            : b.lightLogo
                              ? "bg-white"
                              : "bg-[#241f21]"
                        }`
                      : "flex h-24 items-center"
                  }
                >
                  {b.logo ? (
                    <img
                      src={b.logo}
                      srcSet={b.logoSrcSet}
                      sizes="(max-width: 639px) 78vw, (max-width: 1023px) 50vw, 33vw"
                      alt={`${b.name} logo`}
                      width={1370}
                      height={1148}
                      loading="lazy"
                      className={`h-full w-full object-center ${
                        b.sunbriteLogo
                          ? "object-contain p-7 pb-24 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:drop-shadow-[0_0_18px_rgba(255,248,185,1)]"
                          : b.lightLogo
                            ? "object-contain p-8 pb-24"
                            : "object-cover"
                      }`}
                    />
                  ) : (
                    <span className="font-display text-4xl font-semibold tracking-[-0.05em] text-on-dark/35 transition-all duration-500 group-hover:text-gold lg:text-5xl">
                      {b.mark}
                    </span>
                  )}
                </div>
                <div
                  className={
                    b.logo
                      ? `absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t p-4 pt-16 lg:p-5 lg:pt-16 ${
                          b.sunbriteLogo
                            ? "from-[#70a70d] via-[#91c516]/95 to-transparent"
                            : b.lightLogo
                              ? "from-white via-white/95 to-transparent"
                              : "from-[#241f21] via-[#241f21]/95 to-transparent"
                        }`
                      : ""
                  }
                >
                  <h3
                    className={`${b.logo ? "text-sm" : "mt-8 text-lg"} font-display ${
                      b.lightLogo || b.sunbriteLogo ? "text-navy-deep" : "text-on-dark"
                    }`}
                  >
                    {b.name}
                  </h3>
                  <p
                    className={`${b.logo ? "mt-1 text-xs" : "mt-2 text-sm"} leading-relaxed ${
                      b.lightLogo || b.sunbriteLogo ? "text-navy-deep/75" : "text-on-dark-soft"
                    }`}
                  >
                    {b.note}
                  </p>
                  <span
                    className={`${b.logo ? "mt-5" : "mt-8"} block h-px w-0 bg-gold transition-all duration-700 group-hover:w-full`}
                  />
                </div>
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.36} className="min-w-[78vw] snap-start sm:min-w-0">
            <div className="group relative isolate flex min-h-[18rem] h-full flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_88%_10%,rgba(255,255,255,0.7),transparent_32%),linear-gradient(145deg,#f6cd58_0%,#e5ae27_52%,#cf8f0b_100%)] p-6 sm:min-h-[21rem] sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full border border-navy-deep/15 transition-transform duration-700 group-hover:scale-110" />
              <div className="pointer-events-none absolute -right-6 -top-6 -z-10 h-32 w-32 rounded-full border border-navy-deep/15" />

              <div>
                <div className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-navy-deep/65">
                  <span className="h-1.5 w-1.5 rounded-full bg-navy-deep" />
                  Partner with us
                </div>
                <p className="mt-7 max-w-[14rem] font-display text-2xl font-semibold leading-[1.12] text-navy-deep lg:text-3xl">
                  Bring your brand to more shelves.
                </p>
                <p className="mt-4 max-w-[17rem] text-xs leading-relaxed text-navy-deep/70">
                  Join a distribution network built on dependable supply and lasting retail
                  relationships.
                </p>
              </div>

              <a
                href="#contact"
                className="mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-navy-deep px-5 py-3 text-xs font-bold text-gold transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy hover:shadow-[0_12px_30px_rgba(7,29,62,0.25)]"
              >
                Start a conversation
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- CATEGORIES ------------------------------- */

const CATEGORIES: Array<{
  name: string;
  img: string;
  srcSet?: string;
  span: string;
  ratio: string;
}> = [
  {
    name: "Biscuits",
    img: biscuitsImg,
    srcSet: `${biscuitsImg640} 640w, ${biscuitsImg} 1200w`,
    span: "lg:col-span-5 lg:row-span-2",
    ratio: "sm:aspect-[4/5]",
  },
  {
    name: "Personal Care",
    img: personalImg,
    srcSet: `${personalImg640} 640w, ${personalImg} 1200w`,
    span: "lg:col-span-3",
    ratio: "sm:aspect-[4/3]",
  },
  {
    name: "Baby Care",
    img: babyImg,
    srcSet: `${babyImg640} 640w, ${babyImg} 1200w`,
    span: "lg:col-span-3",
    ratio: "sm:aspect-[4/3]",
  },
  {
    name: "Hair Care",
    img: hairImg1448,
    srcSet: `${hairImg640} 640w, ${hairImg960} 960w, ${hairImg1448} 1448w`,
    span: "lg:col-span-4",
    ratio: "sm:aspect-[4/3]",
  },
  {
    name: "Household",
    img: householdImg,
    srcSet: `${householdImg640} 640w, ${householdImg} 1200w`,
    span: "lg:col-span-6",
    ratio: "sm:aspect-[16/10]",
  },
  {
    name: "FMCG Essentials",
    img: essentialsImg,
    srcSet: `${essentialsImg640} 640w, ${essentialsImg} 1200w`,
    span: "lg:col-span-6",
    ratio: "sm:aspect-[16/10]",
  },
];

export function Categories() {
  return (
    <section id="portfolio" className="py-16 sm:py-24 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="max-w-2xl">
          <Reveal className="eyebrow">What we distribute</Reveal>
          <h2 className="mt-4 font-display text-[1.75rem] font-semibold leading-[1.1] text-navy sm:mt-6 sm:text-4xl lg:text-[3.4rem]">
            <TextReveal text="Categories that move every day." />
          </h2>
        </div>

        <SwipeCue />
        <div
          role="region"
          aria-label="Product categories. Swipe horizontally to see more."
          tabIndex={0}
          className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 pr-[18vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:auto-rows-min lg:grid-cols-12"
        >
          {CATEGORIES.map((c, i) => (
            <Reveal
              key={c.name}
              delay={(i % 3) * 0.06}
              className={`min-w-[78vw] snap-start sm:min-w-0 ${c.span}`}
            >
              <a
                href={`/products?category=${encodeURIComponent(c.name)}`}
                aria-label={`View ${c.name} products`}
                className="group relative block h-full overflow-hidden"
              >
                <div className={`aspect-[4/3] w-full overflow-hidden ${c.ratio}`}>
                  <img
                    src={c.img}
                    srcSet={c.srcSet}
                    sizes="(max-width: 639px) 78vw, (max-width: 1023px) calc(50vw - 32px), 34vw"
                    alt={`${c.name} products distributed by Sufi Traders`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.07]"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--navy-deep)_82%,transparent),transparent)] p-6">
                  <span className="font-display text-lg text-on-dark">{c.name}</span>
                  <span className="translate-y-2 text-on-dark opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={18} />
                  </span>
                </figcaption>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- WHY ---------------------------------- */

const REASONS = [
  {
    t: "Reliable Distribution",
    c: "Scheduled routes and consistent order cycles retailers can plan around.",
  },
  { t: "Quality Products", c: "Stock handled and stored to keep condition intact on arrival." },
  { t: "Trusted Brand Network", c: "Working relationships with established manufacturers." },
  { t: "Professional Service", c: "Clear communication from order intake through to invoice." },
  { t: "Efficient Logistics", c: "Route planning that reduces delays across the region." },
  { t: "Long-Term Partnerships", c: "Growth built on repeat business, not one-off orders." },
];

export function Why() {
  return (
    <section className="border-y border-hairline bg-secondary py-16 sm:py-24 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="grid gap-9 sm:gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal className="eyebrow">Why Sufi Traders</Reveal>
            <h2 className="mt-4 font-display text-[1.75rem] font-semibold leading-[1.1] text-navy sm:mt-6 sm:text-3xl lg:text-[2.9rem]">
              <TextReveal text="Six reasons partners stay with us." />
            </h2>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ul>
              {REASONS.map((r, i) => (
                <Reveal as="li" key={r.t} delay={i * 0.04}>
                  <div className="group grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 border-b border-hairline py-5 transition-colors duration-500 hover:border-navy sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-6 sm:py-7">
                    <span className="font-display text-sm text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg text-navy transition-transform duration-500 group-hover:translate-x-1 sm:text-2xl">
                        {r.t}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{r.c}</p>
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="hidden shrink-0 text-navy opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:block"
                      aria-hidden="true"
                    />
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- PROCESS -------------------------------- */

const STEPS = [
  ["Receive Orders", "Orders confirmed by phone, field team or standing schedule."],
  ["Warehouse Processing", "Picking and packing against the confirmed order sheet."],
  ["Quality Check", "Batch, condition and count verified before dispatch."],
  ["Distribution", "Loads consolidated by route to keep delivery times tight."],
  ["Delivery", "Handover, documentation and confirmation with the retailer."],
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 80%"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className="py-16 sm:py-24 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Reveal className="eyebrow">How it works</Reveal>
            <h2 className="mt-4 font-display text-[1.75rem] font-semibold leading-[1.1] text-navy sm:mt-6 sm:text-3xl lg:text-[3.4rem]">
              <TextReveal text="From order to doorstep." />
            </h2>
          </div>
        </div>

        <div ref={ref} className="relative mt-10 sm:mt-16 lg:mt-20">
          <div className="absolute left-0 right-0 top-[7px] hidden h-px bg-hairline lg:block" />
          <m.div
            style={{ scaleX }}
            className="absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-navy lg:block"
          />
          <ol className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <Reveal
                as="li"
                key={s[0]}
                delay={i * 0.1}
                className="relative min-w-[78vw] snap-center border border-hairline bg-secondary p-5 sm:min-w-0 sm:border-0 sm:bg-transparent sm:p-0 lg:pl-0"
              >
                <span className="hidden size-[15px] rounded-full border-2 border-navy bg-background lg:relative lg:top-0 lg:block" />
                <div className="lg:mt-8">
                  <span className="eyebrow">Step {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-xl text-navy">{s[0]}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s[1]}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- INDUSTRIES ------------------------------- */

const INDUSTRIES = [
  "Retail Stores",
  "Wholesale Markets",
  "Supermarkets",
  "Department Stores",
  "Pharmacies",
  "Corporate Buyers",
];

export function Industries() {
  return (
    <section className="relative isolate overflow-hidden border-y border-hairline py-14 sm:py-20 lg:py-32">
      <MouseHighlight />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-3">
            <span className="eyebrow">Industries we serve</span>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Supplying the businesses that put consumer goods in front of customers.
            </p>
          </Reveal>
          <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 lg:col-span-8 lg:col-start-5">
            {INDUSTRIES.map((n, i) => (
              <Reveal as="li" key={n} delay={i * 0.05}>
                <span className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-navy/20 px-3 text-center font-display text-sm text-navy transition-colors duration-500 hover:border-navy hover:bg-navy hover:text-on-dark sm:min-h-12 sm:w-auto sm:px-6 sm:text-base lg:text-lg">
                  {n}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- STATS -------------------------------- */

// Placeholder figures — edit these values freely.
const STATS = [
  { label: "Years of Experience", value: 25, suffix: "+" },
  { label: "Products Distributed", value: 350, suffix: "+" },
  { label: "Business Partners", value: 120, suffix: "+" },
  { label: "Brands", value: 8, suffix: "" },
  { label: "Retailers Served", value: 1250, suffix: "+" },
];

export function Stats() {
  return (
    <section className="py-14 sm:py-20 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="border-t border-navy/20 pt-4 sm:pt-6">
                <dd className="font-display text-3xl font-semibold tracking-[-0.05em] text-navy sm:text-4xl lg:text-6xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-2 text-[0.62rem] uppercase tracking-[0.12em] text-ink-soft sm:mt-3 sm:text-xs sm:tracking-[0.18em]">
                  {s.label}
                </dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------ CTA --------------------------------- */

export function CallToAction() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      <m.div style={{ y }} className="absolute inset-0 -z-10 scale-125">
        <img
          src={ctaImg}
          srcSet={`${ctaImg960} 960w, ${ctaImg} 1920w`}
          sizes="125vw"
          alt="Delivery trucks lined up at a distribution centre loading dock at sunset"
          width={1920}
          height={1088}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--navy-deep)_88%,transparent),color-mix(in_oklab,var(--navy-deep)_45%,transparent))]" />
      </m.div>

      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-12 lg:py-48">
        <h2 className="max-w-3xl font-display text-[1.8rem] font-semibold leading-[1.08] text-on-dark sm:text-5xl lg:text-[4rem]">
          <TextReveal text="Looking for a Reliable FMCG Distribution Partner?" />
        </h2>
        <Reveal
          delay={0.15}
          className="mt-7 grid grid-cols-2 gap-2 sm:mt-10 sm:flex sm:flex-wrap sm:gap-4"
        >
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold px-4 text-xs font-bold text-navy-deep transition-transform duration-300 hover:-translate-y-0.5 sm:min-h-12 sm:px-7 sm:text-sm"
          >
            <Phone size={16} /> Call Now
          </a>
          <a
            href="#whatsapp-quote"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-on-dark/35 px-4 text-xs font-semibold text-on-dark transition-colors duration-300 hover:bg-on-dark/10 sm:min-h-12 sm:px-7 sm:text-sm"
          >
            <MessageCircle size={16} className="mr-2" /> Get WhatsApp Quote
          </a>
        </Reveal>
        <Reveal delay={0.25} className="mt-8 text-sm text-on-dark-soft">
          {PHONE_DISPLAY} · Open daily 9:00 AM – 7:00 PM
        </Reveal>
      </div>
    </section>
  );
}
