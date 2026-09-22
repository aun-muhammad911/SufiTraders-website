import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Download, FileText, LoaderCircle, MessageCircle } from "lucide-react";

import { Footer, Nav } from "@/components/site/chrome";
import { Reveal, ScrollProgress, TextReveal } from "@/components/site/primitives";
import { CATALOGS } from "@/lib/catalogs";

const SITE_URL = "https://sufidistribution.com";

export const Route = createFileRoute("/catalogs")({
  head: () => ({
    meta: [
      { title: "Product Catalogs | Sufi Traders" },
      {
        name: "description",
        content: "Download the latest product catalogues available from Sufi Traders.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/catalogs` }],
  }),
  component: CatalogsPage,
});

function CatalogsPage() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const showDownloadFeedback = (catalogId: string) => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setDownloadingId(catalogId);
    resetTimer.current = setTimeout(() => setDownloadingId(null), 2200);
  };

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main className="min-h-[70vh] bg-secondary pt-16 sm:pt-[72px]">
        <section className="border-y border-hairline py-16 sm:py-24 lg:py-36">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Reveal className="eyebrow">Download centre</Reveal>
                <h1 className="mt-4 font-display text-[2rem] font-semibold leading-[1.08] text-navy sm:mt-6 sm:text-5xl lg:text-[4rem]">
                  <TextReveal text="Product catalogs." />
                </h1>
              </div>
              <Reveal
                delay={0.1}
                className="text-sm leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9"
              >
                Browse and download our latest product catalogues directly to your device.
              </Reveal>
            </div>

            {CATALOGS.length === 0 ? (
              <Reveal className="mt-10 border border-dashed border-hairline bg-background px-5 py-12 text-center sm:mt-14 sm:px-10 sm:py-16">
                <BookOpen size={34} className="mx-auto text-gold" aria-hidden="true" />
                <h2 className="mt-5 font-display text-xl font-semibold text-navy sm:text-2xl">
                  Catalogues are being prepared
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
                  Our downloadable product catalogues will appear here soon. Contact our team if you
                  need current product information in the meantime.
                </p>
                <a
                  href="/#whatsapp-quote"
                  className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-bold text-on-dark transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <MessageCircle size={16} /> Request product information
                </a>
              </Reveal>
            ) : (
              <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {CATALOGS.map((catalog, index) => (
                  <Reveal key={catalog.id} delay={(index % 4) * 0.06} className="h-full">
                    <article className="group flex h-full flex-col border border-hairline bg-background p-4 transition-transform duration-500 hover:-translate-y-1 hover:shadow-lift sm:p-5">
                      <div className="grid aspect-[4/3] place-items-center overflow-hidden bg-secondary">
                        {catalog.coverUrl ? (
                          <img
                            src={catalog.coverUrl}
                            alt={`${catalog.title} cover`}
                            loading={index === 0 ? "eager" : "lazy"}
                            decoding="async"
                            className="size-full object-contain p-5"
                          />
                        ) : (
                          <FileText
                            size={58}
                            strokeWidth={1.35}
                            className="text-gold"
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
                        <div className="flex items-center justify-between gap-3 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-ink-soft">
                          <span>{catalog.brand}</span>
                          <span>PDF{catalog.fileSize ? ` · ${catalog.fileSize}` : ""}</span>
                        </div>
                        <h2 className="mt-3 font-display text-lg font-semibold leading-snug text-navy sm:text-xl">
                          {catalog.title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                          {catalog.description}
                        </p>
                        <div className="mt-auto pt-6">
                          <a
                            href={catalog.fileUrl}
                            download
                            onClick={() => showDownloadFeedback(catalog.id)}
                            aria-label={`Download ${catalog.title} PDF`}
                            aria-live="polite"
                            className="group/download flex min-h-12 w-full items-center justify-between rounded-full bg-navy px-2.5 pr-5 text-sm font-bold text-on-dark transition-[background-color,transform] duration-300 hover:bg-forest active:scale-[0.98]"
                          >
                            <span className="flex items-center gap-3">
                              <span className="grid size-8 place-items-center rounded-full bg-gold text-navy-deep transition-transform duration-300 group-hover/download:translate-y-0.5">
                                {downloadingId === catalog.id ? (
                                  <LoaderCircle size={16} className="animate-spin" />
                                ) : (
                                  <Download size={15} />
                                )}
                              </span>
                              <span className="transition-opacity duration-200">
                                {downloadingId === catalog.id
                                  ? "Starting Download..."
                                  : "Download Catalog"}
                              </span>
                            </span>
                            <span
                              className={`text-[0.65rem] font-bold uppercase tracking-[0.14em] text-on-dark-soft transition-opacity duration-200 ${
                                downloadingId === catalog.id ? "animate-pulse" : ""
                              }`}
                            >
                              {downloadingId === catalog.id ? "Please wait" : "PDF"}
                            </span>
                          </a>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
