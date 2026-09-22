import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Phone, Clock, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";

import { Reveal, TextReveal } from "./primitives";
import { ADDRESS, HOURS, MAP_DIRECTIONS_URL, MAP_URL, PHONE_DISPLAY, PHONE_TEL } from "./chrome";
import { submitEnquiry } from "@/lib/product-functions";

const DETAILS = [
  { icon: Phone, label: "Phone", value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}` },
  { icon: Clock, label: "Business hours", value: `Daily, ${HOURS}` },
  { icon: MapPin, label: "Address", value: ADDRESS, href: MAP_URL },
];

export function Contact() {
  const [sending, setSending] = useState(false);
  const submit = useServerFn(submitEnquiry);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await submit({
        data: {
          name: String(data.get("name") ?? ""),
          business: String(data.get("business") ?? ""),
          phone: String(data.get("phone") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
          website: String(data.get("website") ?? ""),
        },
      });
      form.reset();
      toast.success("Thanks — your enquiry has been received.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Your enquiry could not be sent.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="grid gap-10 sm:gap-16 lg:grid-cols-12 lg:gap-24">
          <div className="lg:col-span-5">
            <Reveal className="eyebrow">Get in touch</Reveal>
            <h2 className="mt-4 font-display text-[1.75rem] font-semibold leading-[1.1] text-navy sm:mt-6 sm:text-3xl lg:text-[3.2rem]">
              <TextReveal text="Let's talk supply." />
            </h2>

            <dl className="mt-8 space-y-5 sm:mt-12 sm:space-y-8">
              {DETAILS.map(({ icon: Icon, label, value, href }, i) => (
                <Reveal key={label} delay={i * 0.07}>
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-t border-hairline pt-4 sm:gap-5 sm:pt-6">
                    <Icon size={18} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
                    <div className="min-w-0">
                      <dt className="eyebrow">{label}</dt>
                      <dd className="mt-2 text-base leading-relaxed text-navy">
                        {href ? (
                          <a
                            className="link-underline"
                            href={href}
                            target={href.startsWith("http") ? "_blank" : undefined}
                            rel={href.startsWith("http") ? "noreferrer" : undefined}
                          >
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  </div>
                </Reveal>
              ))}
            </dl>

            <Reveal delay={0.2} className="mt-8 overflow-hidden border border-hairline sm:mt-12">
              <iframe
                title="Map showing Sufi Traders location in Jalalpur Ghumman, Daska"
                src="https://www.google.com/maps?q=Sufi%20Traders%2C%20Jamke%20Rd%2C%20Jalalpur%20Ghumman%20Daska%2C%2051310&z=18&output=embed"
                width="100%"
                height="300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-56 w-full grayscale-[0.35] sm:h-[300px]"
              />
              <a
                href={MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 bg-navy px-4 text-sm font-bold text-on-dark transition-colors hover:bg-navy-deep"
              >
                <Navigation size={17} aria-hidden="true" />
                Get Directions in Google Maps
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <form onSubmit={onSubmit} className="grid gap-6 sm:gap-7">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                <Field id="contact-name" label="Full name" autoComplete="name" />
                <Field id="contact-business" label="Business name" autoComplete="organization" />
                <div className="grid grid-cols-2 gap-4 sm:gap-7">
                  <Field id="contact-phone" label="Phone" type="tel" autoComplete="tel" />
                  <Field
                    id="contact-email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    required={false}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="eyebrow block">
                    How can we help?
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    className="mt-3 w-full resize-none border-0 border-b border-hairline bg-transparent pb-3 text-base text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-navy"
                    placeholder="Tell us about the products or volumes you need."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="mt-1 inline-flex min-h-12 w-full items-center justify-center self-start rounded-full bg-navy px-7 py-3 text-sm font-bold tracking-wide text-on-dark transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60 sm:mt-2 sm:min-h-13 sm:w-auto sm:px-9 sm:py-4"
                >
                  {sending ? "Sending…" : "Send enquiry"}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      <input
        id={id}
        name={id.replace("contact-", "")}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="mt-2 h-11 w-full border-0 border-b border-hairline bg-transparent text-sm text-navy outline-none transition-colors focus:border-navy sm:mt-3 sm:h-12 sm:text-base"
      />
    </div>
  );
}
