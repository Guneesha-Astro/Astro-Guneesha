import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/consultations")({
  head: () => ({
    meta: [
      { title: "Astrology Consultations — Astro Guneesha" },
      {
        name: "description",
        content:
          "Book a 30-minute call, a full Kundali reading or a transit and year-ahead analysis with Pooja M Kaushik.",
      },
      { property: "og:title", content: "Astrology Consultations — Astro Guneesha" },
      {
        property: "og:description",
        content:
          "One-to-one Vedic astrology sessions: quick guidance calls, full Kundali readings and transit analysis.",
      },
    ],
  }),
  component: ConsultationsPage,
});

const prep = [
  "Your date of birth, exact time of birth and city of birth.",
  "One or two questions you most want answered.",
  "A quiet space — sessions run on a video call.",
];

function ConsultationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Consultations"
        title="Sit down with your chart"
        lead="Every session is one-to-one and recorded for you. Choose the depth you need — a focused half hour, a full life reading, or a year mapped by transit."
      >
        <Button asChild>
          <a href={SITE.topmate} target="_blank" rel="noreferrer">
            Check availability on Topmate
          </a>
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <ProductGrid categories={["consultation"]} />

        <div className="panel mt-12 p-8">
          <h2 className="font-display text-xl text-gold">Before your session</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {prep.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="text-gold">✦</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
