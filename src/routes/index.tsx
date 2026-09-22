import { createFileRoute } from "@tanstack/react-router";

import { Nav, FloatingActions, Footer } from "@/components/site/chrome";
import { Hero } from "@/components/site/hero";
import {
  About,
  Brands,
  Categories,
  Why,
  Process,
  Industries,
  Stats,
  CallToAction,
} from "@/components/site/sections";
import { Contact } from "@/components/site/contact";
import { WhatsAppQuote } from "@/components/site/whatsapp-quote";
import { ScrollProgress } from "@/components/site/primitives";

const SITE_URL = "https://sufidistribution.com";
const PAGE_URL = `${SITE_URL}/`;
const TITLE = "Sufi Traders | FMCG Distributor & Wholesaler in Daska";
const DESCRIPTION =
  "Sufi Traders supplies trusted FMCG brands to retailers, wholesalers and businesses across Daska and surrounding areas in Punjab. Call +92 300 7440323.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: PAGE_URL,
      name: "Sufi Traders",
      alternateName: "Sufi Traders Daska",
      inLanguage: "en-PK",
      about: { "@id": `${SITE_URL}/#organization` },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": `${SITE_URL}/#organization`,
      url: PAGE_URL,
      name: "Sufi Traders",
      legalName: "Sufi Traders",
      alternateName: "Sufi Traders Daska",
      slogan: "Trusted FMCG Distribution in Daska",
      description: DESCRIPTION,
      mainEntityOfPage: PAGE_URL,
      foundingDate: "2001",
      telephone: "+92 300 7440323",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
      image: `${SITE_URL}/og.png`,
      priceRange: "$$",
      hasMap: "https://maps.app.goo.gl/XxcWXqaKoLgKkLUm6",
      sameAs: ["https://maps.app.goo.gl/XxcWXqaKoLgKkLUm6"],
      currenciesAccepted: "PKR",
      areaServed: [
        { "@type": "City", name: "Daska" },
        { "@type": "AdministrativeArea", name: "Surrounding areas of Daska, Punjab" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+92 300 7440323",
        contactType: "sales",
        areaServed: "PK",
        availableLanguage: ["English", "Urdu"],
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 31.4310656,
        longitude: 74.2817792,
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jamke Road, Jalalpur Ghumman",
        addressLocality: "Daska",
        addressRegion: "Punjab",
        postalCode: "51310",
        addressCountry: "PK",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "09:00",
          closes: "19:00",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "FMCG product categories",
        itemListElement: [
          "Biscuits",
          "Personal Care",
          "Baby Care",
          "Hair Care",
          "Household",
          "FMCG Essentials",
        ].map((name) => ({ "@type": "OfferCatalog", name })),
      },
    },
  ],
};

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      {
        name: "googlebot",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "geo.region", content: "PK-PB" },
      { name: "geo.placename", content: "Daska" },
      { name: "geo.position", content: "31.4310656;74.2817792" },
      { name: "ICBM", content: "31.4310656, 74.2817792" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: `${SITE_URL}/og.png` },
      { property: "og:image:secure_url", content: `${SITE_URL}/og.png` },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "1024" },
      {
        property: "og:image:alt",
        content: "Sufi Traders FMCG distribution and wholesale supply in Daska",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/og.png` },
      {
        name: "twitter:image:alt",
        content: "Sufi Traders FMCG distribution and wholesale supply in Daska",
      },
    ],
    links: [
      { rel: "canonical", href: PAGE_URL },
      { rel: "alternate", hrefLang: "en-PK", href: PAGE_URL },
      { rel: "alternate", hrefLang: "x-default", href: PAGE_URL },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(JSON_LD) }],
  }),
});

function Index() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <Brands />
        <Categories />
        <WhatsAppQuote />
        <Why />
        <Process />
        <Industries />
        <Stats />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
