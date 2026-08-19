import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Pooja M Kaushik — Astro Guneesha" },
      {
        name: "description",
        content:
          "Meet Pooja M Kaushik, the Vedic astrologer and tarot reader behind Astro Guneesha, offering classical chart readings, remedies and rituals.",
      },
      { property: "og:title", content: "About Pooja M Kaushik — Astro Guneesha" },
      {
        property: "og:description",
        content:
          "Vedic astrology, tarot and ritual guidance rooted in classical technique and everyday practicality.",
      },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  {
    title: "Classical foundation",
    body: "Readings are built on Parashari principles — lagna, house lords, dashas and transits — rather than sun-sign generalisations.",
  },
  {
    title: "Plain language",
    body: "You leave a session knowing what to do next week, not just what your chart looks like on paper.",
  },
  {
    title: "Gentle remedies",
    body: "Practical mantras, charity and discipline first. Gemstones and rituals only when the chart genuinely calls for them.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Pooja M Kaushik"
        lead="Vedic astrologer, tarot reader and the voice behind Astro Guneesha."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              Pooja M Kaushik has spent years studying Vedic astrology, nakshatras
              and tarot, and works with people across India and abroad who come to
              her at a crossroads — a career decision, a relationship question, a
              health worry, or simply the wish to understand themselves better.
            </p>
            <p>
              Her approach is calm and unsentimental. A chart is read as a map of
              tendencies and timing, never as a verdict. She combines Kundali
              analysis with dasha and transit timing, and where it helps, an
              intuitive tarot pull to bring clarity to a specific question.
            </p>
            <p>
              Alongside private consultations she teaches — running foundation and
              transit courses for students who want to read charts themselves — and
              arranges traditional pujas and jaaps performed with a sankalp in the
              seeker's name. She also shares free weekly guidance with her community
              on YouTube and Instagram.
            </p>
            <p>
              Above all, she believes astrology should return agency to you. The
              stars incline; you decide.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <a href={SITE.topmate} target="_blank" rel="noreferrer">
                  Book a session on Topmate
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href={SITE.youtube} target="_blank" rel="noreferrer">
                  Watch on YouTube
                </a>
              </Button>
            </div>
          </div>

          <aside className="space-y-4">
            {pillars.map((p) => (
              <div key={p.title} className="panel p-6">
                <h2 className="font-display text-base text-gold">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
