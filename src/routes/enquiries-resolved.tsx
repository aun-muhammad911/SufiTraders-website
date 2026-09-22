import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Inbox, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { getAdminDashboard, updateEnquiryResolution } from "@/lib/product-functions";

export const Route = createFileRoute("/enquiries-resolved")({
  loader: () => getAdminDashboard(),
  component: ResolvedEnquiriesPage,
  head: () => ({
    meta: [
      { title: "Resolved Enquiries | Sufi Traders" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function ResolvedEnquiriesPage() {
  const data = Route.useLoaderData();
  if (!data.authenticated) return <SignInRequired />;
  return <ResolvedList enquiries={data.enquiries} />;
}

function SignInRequired() {
  return (
    <main className="grid min-h-screen place-items-center bg-secondary px-6 py-12">
      <section className="w-full max-w-md border border-hairline bg-background p-7 text-center shadow-lift sm:p-10">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-navy text-gold">
          <ShieldCheck size={22} />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold text-navy">
          Admin sign-in required
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Sign in through the website admin to view resolved enquiries.
        </p>
        <Link
          to="/products-admin"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-6 text-sm font-bold text-on-dark"
        >
          Go to admin sign-in
        </Link>
      </section>
    </main>
  );
}

function ResolvedList({
  enquiries,
}: {
  enquiries: Awaited<ReturnType<typeof getAdminDashboard>>["enquiries"];
}) {
  const router = useRouter();
  const updateResolution = useServerFn(updateEnquiryResolution);
  const [busyId, setBusyId] = useState<string | null>(null);
  const resolvedEnquiries = enquiries.filter((enquiry) => enquiry.status === "resolved");

  const restore = async (id: string) => {
    setBusyId(id);
    try {
      await updateResolution({ data: { id, resolved: false } });
      toast.success("Enquiry moved back to the inbox.");
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enquiry could not be restored.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="min-h-screen bg-secondary">
      <header className="border-b border-hairline bg-background">
        <div className="mx-auto flex min-h-20 max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-12">
          <div>
            <p className="eyebrow">Sufi Traders</p>
            <h1 className="mt-1 font-display text-xl font-semibold text-navy">
              Resolved enquiries
            </h1>
          </div>
          <Link
            to="/products-admin"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy px-4 text-xs font-bold text-on-dark"
          >
            <ArrowLeft size={14} /> Back to admin inbox
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-6 py-10 lg:px-12 lg:py-14">
        <p className="eyebrow">Completed conversations</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-navy sm:text-4xl">
          Resolved enquiries
        </h2>
        <p className="mt-3 text-sm text-ink-soft">
          {resolvedEnquiries.length} resolved{" "}
          {resolvedEnquiries.length === 1 ? "enquiry" : "enquiries"}
        </p>

        {resolvedEnquiries.length === 0 ? (
          <div className="mt-8 grid min-h-56 place-items-center border border-dashed border-hairline bg-background p-8 text-center">
            <div>
              <Inbox size={32} className="mx-auto text-gold" />
              <h3 className="mt-4 font-display text-lg text-navy">No resolved enquiries</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Enquiries marked as resolved will appear on this page.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {resolvedEnquiries.map((enquiry) => (
              <article key={enquiry.id} className="border border-hairline bg-background p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-navy">{enquiry.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-gold">{enquiry.business}</p>
                  </div>
                  <div className="text-right text-xs text-ink-soft">
                    <div>Received {formatDate(enquiry.createdAt)}</div>
                    {enquiry.resolvedAt && (
                      <div className="mt-1">Resolved {formatDate(enquiry.resolvedAt)}</div>
                    )}
                  </div>
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
                  onClick={() => restore(enquiry.id)}
                  disabled={busyId === enquiry.id}
                  className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-hairline px-4 text-xs font-bold text-navy transition-colors hover:border-navy disabled:opacity-50"
                >
                  <RotateCcw size={14} />
                  {busyId === enquiry.id ? "Restoring..." : "Move back to inbox"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
