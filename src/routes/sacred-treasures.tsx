import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductGrid } from "@/components/site/ProductGrid";

export const Route = createFileRoute("/sacred-treasures")({
  head: () => ({
    meta: [
      { title: "Sacred Treasures — Astro Guneesha" },
      {
        name: "description",
        content:
          "Energised parad shivlings, sphatik and tulsi malas, and other consecrated objects for your home altar.",
      },
      { property: "og:title", content: "Sacred Treasures — Astro Guneesha" },
      {
        property: "og:description",
        content:
          "Consecrated malas, shivlings and altar pieces, energised before dispatch.",
      },
    ],
  }),
  component: TreasuresPage,
});

function TreasuresPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sacred Treasures"
        title="Objects for daily practice"
        lead="Hand-selected, ethically sourced and energised with mantra before they reach you. Each piece is meant to be used, not displayed."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <ProductGrid categories={["sacred_treasure"]} />
      </section>
    </>
  );
}
