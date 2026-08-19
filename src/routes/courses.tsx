import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductGrid } from "@/components/site/ProductGrid";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Astrology Courses — Astro Guneesha" },
      {
        name: "description",
        content:
          "Learn to read charts yourself: foundation Kundali courses, transit and timing mastery, and intuitive tarot with Pooja M Kaushik.",
      },
      { property: "og:title", content: "Astrology Courses — Astro Guneesha" },
      {
        property: "og:description",
        content:
          "Live and self-paced courses in Vedic chart reading, transits, dashas and tarot.",
      },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Courses"
        title="Learn to read the sky yourself"
        lead="Small cohorts, live teaching and lifetime access to recordings. No prior background needed for the foundation course."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <ProductGrid categories={["course"]} />
      </section>
    </>
  );
}
