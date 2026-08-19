import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductGrid } from "@/components/site/ProductGrid";

export const Route = createFileRoute("/ebooks")({
  head: () => ({
    meta: [
      { title: "E-Books — Astro Guneesha" },
      {
        name: "description",
        content:
          "Downloadable guides on nakshatras, Saturn transits and everyday Vedic remedies, written by Pooja M Kaushik.",
      },
      { property: "og:title", content: "E-Books — Astro Guneesha" },
      {
        property: "og:description",
        content:
          "Instant-download astrology guides: the nakshatra handbook, Saturn transits and practical remedies.",
      },
    ],
  }),
  component: EbooksPage,
});

function EbooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="E-Books"
        title="Read at your own pace"
        lead="Concise, practical guides you can download immediately — written in plain language with worked chart examples."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <ProductGrid categories={["ebook"]} />
      </section>
    </>
  );
}
