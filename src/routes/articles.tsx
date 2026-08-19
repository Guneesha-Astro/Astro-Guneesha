import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Insights & Transit Updates — Astro Guneesha" },
      {
        name: "description",
        content:
          "Articles on planetary transits, Sade Sati, nakshatras and remedies, written by Pooja M Kaushik.",
      },
      { property: "og:title", content: "Insights & Transit Updates — Astro Guneesha" },
      {
        property: "og:description",
        content:
          "Clear, practical writing on transits, dashas and Vedic remedies.",
      },
    ],
  }),
  component: ArticlesPage,
});

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  tag: string | null;
  published_at: string;
};

function ArticlesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, slug, title, excerpt, body, tag, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Article[];
    },
  });

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Transit notes & essays"
        lead="Slow, careful writing about the sky — what is moving, what it tends to mean, and what to actually do about it."
      />
      <section className="mx-auto max-w-4xl px-4 py-14">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {(data ?? []).map((a) => (
              <article key={a.id} className="panel p-7">
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gold/80">
                  <span>{a.tag}</span>
                  <span className="text-muted-foreground">
                    {new Date(a.published_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-2xl text-starlight">{a.title}</h2>
                <p className="mt-2 text-sm italic text-gold/90">{a.excerpt}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {a.body}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
