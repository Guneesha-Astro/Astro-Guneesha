import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductGrid } from "@/components/site/ProductGrid";

export const Route = createFileRoute("/pujas")({
  head: () => ({
    meta: [
      { title: "Pujas & Jaaps — Astro Guneesha" },
      {
        name: "description",
        content:
          "Traditional Navagraha Shanti, Mahamrityunjaya and Lakshmi Kuber pujas performed on your behalf with a sankalp in your name.",
      },
      { property: "og:title", content: "Pujas & Jaaps — Astro Guneesha" },
      {
        property: "og:description",
        content:
          "Vedic rituals performed on auspicious muhurats, with a recording and prasad sent to you.",
      },
    ],
  }),
  component: PujasPage,
});

function PujasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pujas"
        title="Rituals performed on your behalf"
        lead="Each puja is conducted by experienced priests on an auspicious muhurat, with a sankalp taken in your name and gotra. You receive a recording and prasad."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <ProductGrid categories={["puja"]} />
      </section>
    </>
  );
}
