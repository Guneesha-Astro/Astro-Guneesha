import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule a Reading with Pooja M Kaushik — Astro Guneesha" },
      {
        name: "description",
        content:
          "Landed here from Instagram, YouTube or Facebook? Pick a slot for your Vedic astrology reading with Pooja M Kaushik in under a minute.",
      },
      { property: "og:title", content: "Schedule a Reading — Astro Guneesha" },
      {
        property: "og:description",
        content:
          "Pick a slot for a 30-minute call, a full Kundali reading or a transit analysis.",
      },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  return (
    <>
      <PageHeader
        eyebrow="Welcome from social"
        title="Let's find your slot"
        lead="You're one tap away from a session with Pooja. Availability, timings and payment are all handled on Topmate."
      >
        <Button asChild size="lg">
          <a href={SITE.topmate} target="_blank" rel="noreferrer">
            Open the booking calendar
          </a>
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-display text-2xl text-starlight">Choose your session</h2>
        <p className="mt-2 mb-8 text-sm text-muted-foreground">
          Not sure which one? Start with the 30-minute call.
        </p>
        <ProductGrid categories={["consultation"]} />

        <div className="panel mt-12 flex flex-wrap items-center justify-between gap-6 p-8">
          <div>
            <h3 className="font-display text-xl text-gold">Following along elsewhere?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Weekly transit updates and free guidance on all three channels.
            </p>
          </div>
          <div className="flex gap-3">
            <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-md border border-border p-3 text-gold hover:bg-gold-soft">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={SITE.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-md border border-border p-3 text-gold hover:bg-gold-soft">
              <Youtube className="h-5 w-5" />
            </a>
            <a href={SITE.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-md border border-border p-3 text-gold hover:bg-gold-soft">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
