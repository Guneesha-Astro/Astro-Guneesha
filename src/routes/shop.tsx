import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/site/PageHeader";
import { useProducts } from "@/components/site/ProductGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/cart";
import { CATEGORY_LABEL, SITE, inr } from "@/lib/site";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Astrology Store — Gemstones, Rudraksha & Yantras | Astro Guneesha" },
      {
        name: "description",
        content:
          "Certified gemstones, Nepali rudraksha malas and hand-engraved yantras, energised before dispatch and shipped across India.",
      },
      { property: "og:title", content: "Astrology Store — Astro Guneesha" },
      {
        property: "og:description",
        content:
          "Certified gemstones, rudraksha and yantras chosen with your chart in mind.",
      },
    ],
  }),
  component: ShopPage,
});

const FILTERS = ["all", "gemstone", "rudraksha", "yantra", "sacred_treasure"] as const;

function ShopPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const { data, isLoading } = useProducts([
    "gemstone",
    "rudraksha",
    "yantra",
    "sacred_treasure",
  ]);
  const cart = useCart();

  const items = (data ?? []).filter((p) => filter === "all" || p.category === filter);

  return (
    <>
      <PageHeader
        eyebrow="Store"
        title="Stones, beads and yantras"
        lead="Every piece is sourced with certification and energised with mantra. If you are unsure what suits your chart, book a consultation before buying a gemstone."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/checkout"
            className="text-sm text-gold hover:underline"
          >
            View cart ({cart.count})
          </Link>
          <a
            href={SITE.topmate}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-gold"
          >
            Or order directly via Topmate →
          </a>
        </div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                filter === f
                  ? "border-gold bg-gold-soft text-gold"
                  : "border-border text-muted-foreground hover:text-gold"
              }`}
            >
              {f === "all" ? "Everything" : CATEGORY_LABEL[f]}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <article key={p.id} className="panel flex flex-col p-6">
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">
                  {CATEGORY_LABEL[p.category] ?? p.category}
                </span>
                <h2 className="mt-2 font-display text-lg text-starlight">{p.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-5 flex items-center justify-between gap-2">
                  <span className="font-display text-lg text-gold">
                    {inr(p.price_inr)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        cart.add({ productId: p.id, name: p.name, price: p.price_inr });
                        toast.success(`${p.name} added to cart`);
                      }}
                    >
                      Add to cart
                    </Button>
                    <Button asChild size="sm">
                      <a
                        href={p.external_url ?? SITE.topmate}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Buy
                      </a>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
