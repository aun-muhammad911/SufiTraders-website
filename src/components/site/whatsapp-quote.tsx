import { useState, type FormEvent } from "react";
import { Check, MessageCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { PHONE_DISPLAY, PHONE_WA } from "./chrome";
import { Reveal, TextReveal } from "./primitives";

const QUOTE_CATEGORIES = [
  "Biscuits",
  "Personal Care",
  "Baby Care",
  "Hair Care",
  "Household",
  "FMCG Essentials",
] as const;

export function WhatsAppQuote() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelected((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selected.length === 0) {
      toast.error("Please select at least one product category.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const business = String(form.get("business") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const requirements = String(form.get("requirements") ?? "").trim();

    const message = [
      "Hello Sufi Traders,",
      "",
      "I would like to request a wholesale quotation.",
      "",
      `Name: ${name}`,
      `Business: ${business}`,
      `Location: ${location}`,
      `Phone: ${phone}`,
      `Required categories: ${selected.join(", ")}`,
      `Order requirements: ${requirements}`,
      "",
      "Please share product availability, minimum order, pricing and delivery details.",
    ].join("\n");

    window.open(
      `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <section
      id="whatsapp-quote"
      className="relative overflow-hidden grain-navy py-16 sm:py-24 lg:py-40"
    >
      <div className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-[1400px] gap-9 px-4 sm:gap-14 sm:px-6 lg:grid-cols-12 lg:gap-20 lg:px-12">
        <div className="lg:col-span-5">
          <Reveal className="eyebrow text-gold">Quick quotation</Reveal>
          <h2 className="mt-4 font-display text-[1.75rem] font-semibold leading-[1.1] text-on-dark sm:mt-6 sm:text-4xl lg:text-[3.4rem]">
            <TextReveal text="Build your requirement. Send it on WhatsApp." />
          </h2>
          <Reveal
            delay={0.1}
            className="mt-5 max-w-lg text-sm leading-[1.75] text-on-dark-soft sm:mt-8 sm:text-base sm:leading-[1.9]"
          >
            Select the categories you need and share your order details. A structured quotation
            request will open directly in WhatsApp, ready to send to our team.
          </Reveal>

          <Reveal delay={0.18} className="mt-7 space-y-3 sm:mt-10 sm:space-y-4">
            {[
              "No account or login required",
              "Your request goes directly to our sales team",
              `Quotation assistance on ${PHONE_DISPLAY}`,
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-on-dark">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <Check size={14} aria-hidden="true" />
                </span>
                {item}
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <form onSubmit={onSubmit} className="bg-background p-4 shadow-lift sm:p-9 lg:p-11">
            <fieldset>
              <legend className="eyebrow">Select product categories</legend>
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-2.5">
                {QUOTE_CATEGORIES.map((category) => {
                  const active = selected.includes(category);
                  return (
                    <label
                      key={category}
                      className={cn(
                        "cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:py-2.5 sm:text-sm",
                        active
                          ? "border-navy bg-navy text-on-dark"
                          : "border-hairline bg-background text-ink-soft hover:border-navy hover:text-navy",
                      )}
                    >
                      <input
                        type="checkbox"
                        name="categories"
                        value={category}
                        checked={active}
                        onChange={() => toggleCategory(category)}
                        className="sr-only"
                      />
                      <span className="inline-flex items-center gap-2">
                        {active && <Check size={14} aria-hidden="true" />}
                        {category}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-6 sm:mt-9 sm:gap-6">
              <QuoteField id="quote-name" name="name" label="Full name" autoComplete="name" />
              <QuoteField
                id="quote-business"
                name="business"
                label="Business name"
                autoComplete="organization"
              />
              <QuoteField
                id="quote-location"
                name="location"
                label="City / delivery area"
                autoComplete="address-level2"
              />
              <QuoteField
                id="quote-phone"
                name="phone"
                label="Phone number"
                type="tel"
                autoComplete="tel"
              />
            </div>

            <div className="mt-6">
              <label htmlFor="quote-requirements" className="eyebrow block">
                Products, quantities or pack sizes
              </label>
              <textarea
                id="quote-requirements"
                name="requirements"
                rows={4}
                required
                placeholder="Example: Molfix size 4 — 10 cartons, assorted biscuits — 20 cartons..."
                className="mt-3 w-full resize-none border-0 border-b border-hairline bg-transparent pb-3 text-base text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-navy"
              />
            </div>

            <button
              type="submit"
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold tracking-wide text-on-dark transition-transform duration-300 hover:-translate-y-0.5 sm:mt-8 sm:min-h-13 sm:w-auto sm:px-7 sm:py-4"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Send quotation request
            </button>

            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
              Your details are only added to the WhatsApp message and are not stored on this
              website.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function QuoteField({
  id,
  name,
  label,
  type = "text",
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="mt-2 h-11 w-full border-0 border-b border-hairline bg-transparent text-sm text-navy outline-none transition-colors focus:border-navy sm:mt-3 sm:h-12 sm:text-base"
      />
    </div>
  );
}
