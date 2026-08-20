import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Sunrise, Sunset } from "lucide-react";
import heroImage from "@/assets/hero-cosmos.jpg";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { SITE, inr } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Astro Guneesha — Vedic Astrology with Pooja M Kaushik" },
      {
        name: "description",
        content:
          "Kundali readings, transit analysis, pujas, courses and energised sacred items with Vedic astrologer Pooja M Kaushik. Book your consultation today.",
      },
      { property: "og:title", content: "Astro Guneesha — Vedic Astrology with Pooja M Kaushik" },
      {
        property: "og:description",
        content:
          "Kundali readings, transit analysis, pujas and sacred items, guided by classical Vedic technique.",
      },
    ],
  }),
  component: Home,
});

const offerings = [
  { to: "/consultations", title: "Consultations", body: "Kundali readings, transit analysis and focused guidance calls." },
  { to: "/pujas", title: "Pujas", body: "Navagraha, Mahamrityunjaya and prosperity rituals in your name." },
  { to: "/courses", title: "Courses", body: "Learn to read charts yourself, from foundations to timing." },
  { to: "/ebooks", title: "E-Books", body: "Downloadable guides on nakshatras, Saturn and remedies." },
  { to: "/sacred-treasures", title: "Sacred Treasures", body: "Malas, shivlings and altar pieces for daily practice." },
  { to: "/shop", title: "Store", body: "Certified gemstones, rudraksha and hand-engraved yantras." },
] as const;

function Home() {
  const panchanga = useQuery({
    queryKey: ["panchanga-today"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("panchanga")
        .select("*")
        .order("day", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const articles = useQuery({
    queryKey: ["articles-recent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, excerpt, tag, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });

  const featured = useQuery({
    queryKey: ["featured-consultations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, price_inr, external_url")
        .eq("category", "consultation")
        .eq("is_active", true)
        .order("price_inr");
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Golden zodiac wheel among stars in a midnight sky"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/90 to-background" />
        <div className="starfield animate-twinkle absolute inset-0" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 py-28 md:py-40">
          <p className="animate-rise text-[11px] uppercase tracking-[0.4em] text-gold">
            Vedic astrology · Tarot · Ritual
          </p>
          <h1 className="animate-rise mt-5 max-w-3xl text-4xl leading-[1.1] text-starlight md:text-6xl">
            The sky has been keeping <span className="text-gradient-gold">your notes</span>.
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Readings with {SITE.astrologer} — classical Kundali analysis, honest timing,
            and remedies you can actually live with.
          </p>
          <div className="animate-rise mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={SITE.topmate} target="_blank" rel="noreferrer">
                Book a Consultation
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/shop">Explore Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Panchanga */}
      <section className="mx-auto -mt-10 max-w-7xl px-4">
        <div className="panel relative overflow-hidden p-8">
          <Sparkles className="absolute -right-6 -top-6 h-32 w-32 text-gold/10" aria-hidden />
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl text-gold">Today's Panchanga</h2>
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>

          {panchanga.isLoading ? (
            <Skeleton className="mt-6 h-16 w-full" />
          ) : panchanga.data ? (
            <>
              <dl className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-6">
                {[
                  ["Tithi", panchanga.data.tithi],
                  ["Nakshatra", panchanga.data.nakshatra],
                  ["Yoga", panchanga.data.yoga],
                  ["Karana", panchanga.data.karana],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-gold/80">{k}</dt>
                    <dd className="mt-1 text-sm text-starlight">{v ?? "—"}</dd>
                  </div>
                ))}
                <div>
                  <dt className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-gold/80">
                    <Sunrise className="h-3 w-3" /> Sunrise
                  </dt>
                  <dd className="mt-1 text-sm text-starlight">{panchanga.data.sunrise}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-gold/80">
                    <Sunset className="h-3 w-3" /> Sunset
                  </dt>
                  <dd className="mt-1 text-sm text-starlight">{panchanga.data.sunset}</dd>
                </div>
              </dl>
              {panchanga.data.note && (
                <p className="mt-5 border-t border-border pt-4 text-sm italic text-muted-foreground">
                  {panchanga.data.note}
                </p>
              )}
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Today's panchanga will appear here shortly.
            </p>
          )}
        </div>
      </section>

      {/* Offerings */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="gold-rule mb-10 w-24" />
        <h2 className="font-display text-3xl text-starlight">Where would you like to begin?</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((o) => (
            <Link key={o.to} to={o.to} className="panel group p-7 transition-colors hover:border-gold/60">
              <h3 className="font-display text-lg text-gold">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.body}</p>
              <span className="mt-4 inline-block text-sm text-starlight opacity-0 transition-opacity group-hover:opacity-100">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Consultation types */}
      <section className="border-y border-border/60 bg-midnight/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-display text-3xl text-starlight">Popular sessions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Slots and payment are handled on Topmate.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(featured.data ?? []).map((p) => (
              <div key={p.id} className="panel flex flex-col p-7">
                <h3 className="font-display text-lg text-starlight">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-display text-lg text-gold">{inr(p.price_inr)}</span>
                  <Button asChild size="sm">
                    <a href={p.external_url ?? SITE.topmate} target="_blank" rel="noreferrer">
                      Book now
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-starlight">Recent insights</h2>
          <Link to="/articles" className="text-sm text-gold hover:underline">
            All articles →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-44 w-full rounded-lg" />
              ))
            : (articles.data ?? []).map((a) => (
                <article key={a.id} className="panel p-7">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">
                    {a.tag}
                  </span>
                  <h3 className="mt-2 font-display text-lg text-starlight">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {a.excerpt}
                  </p>
                  <Link
                    to="/articles"
                    className="mt-4 inline-block text-sm text-gold hover:underline"
                  >
                    Read →
                  </Link>
                </article>
              ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="panel starfield relative overflow-hidden p-12 text-center">
          <h2 className="font-display text-3xl text-gradient-gold">
            Ready for your reading?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Bring your birth date, time and place. Pooja will bring the rest.
          </p>
          <Button asChild size="lg" className="mt-7">
            <a href={SITE.topmate} target="_blank" rel="noreferrer">
              Book on Topmate
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
