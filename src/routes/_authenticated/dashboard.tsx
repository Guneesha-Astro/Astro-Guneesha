import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SITE, inr } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — Astro Guneesha" },
      {
        name: "description",
        content:
          "Your private charts, consultation bookings and order history with Astro Guneesha.",
      },
      { property: "og:title", content: "Your Dashboard — Astro Guneesha" },
      {
        property: "og:description",
        content: "Charts, consultations and orders in one private place.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type Chart = {
  id: string;
  title: string;
  ascendant: string | null;
  moon_sign: string | null;
  sun_sign: string | null;
  nakshatra: string | null;
  planetary_positions: unknown;
  ai_summary: string | null;
  birth_place: string | null;
  birth_date: string | null;
};

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const charts = useQuery({
    queryKey: ["charts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("charts")
        .select(
          "id, title, ascendant, moon_sign, sun_sign, nakshatra, planetary_positions, ai_summary, birth_place, birth_date",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Chart[];
    },
  });

  const bookings = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, consultation_type, slot_at, duration_minutes, status, meeting_link, amount_inr")
        .order("slot_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, status, shipping_status, tracking_number, total_inr, created_at, order_items(product_name, quantity, unit_price_inr)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-gradient-gold">Your sky, privately</h1>
          <p className="mt-1 text-sm text-muted-foreground">{email}</p>
        </div>
        <Button variant="secondary" onClick={signOut}>
          Sign out
        </Button>
      </div>

      <Tabs defaultValue="charts" className="mt-10">
        <TabsList>
          <TabsTrigger value="charts">My Charts</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="mt-6 space-y-4">
          {charts.isLoading ? (
            <Skeleton className="h-40 w-full rounded-lg" />
          ) : charts.data?.length ? (
            charts.data.map((c) => (
              <article key={c.id} className="panel p-7">
                <h2 className="font-display text-xl text-starlight">{c.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.birth_date} · {c.birth_place}
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    ["Ascendant", c.ascendant],
                    ["Moon sign", c.moon_sign],
                    ["Sun sign", c.sun_sign],
                    ["Nakshatra", c.nakshatra],
                  ].map(([k, v]) => (
                    <div key={k as string}>
                      <dt className="text-[11px] uppercase tracking-[0.2em] text-gold/80">{k}</dt>
                      <dd className="mt-1 text-sm text-starlight">{v ?? "—"}</dd>
                    </div>
                  ))}
                </dl>
                {c.ai_summary && (
                  <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                    {c.ai_summary}
                  </p>
                )}
              </article>
            ))
          ) : (
            <EmptyState
              title="No chart saved yet"
              body="Your natal chart and planetary summary appear here after your first reading."
            />
          )}
        </TabsContent>

        <TabsContent value="consultations" className="mt-6 space-y-4">
          {bookings.isLoading ? (
            <Skeleton className="h-28 w-full rounded-lg" />
          ) : bookings.data?.length ? (
            bookings.data.map((b) => (
              <article key={b.id} className="panel flex flex-wrap items-center justify-between gap-4 p-6">
                <div>
                  <h2 className="font-display text-lg text-starlight">{b.consultation_type}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(b.slot_at).toLocaleString("en-IN")} · {b.duration_minutes} min ·{" "}
                    <span className="text-gold">{b.status}</span>
                  </p>
                </div>
                {b.meeting_link && (
                  <Button asChild size="sm">
                    <a href={b.meeting_link} target="_blank" rel="noreferrer">
                      Join call
                    </a>
                  </Button>
                )}
              </article>
            ))
          ) : (
            <EmptyState
              title="No consultations booked"
              body="Sessions you book appear here with their timing and meeting link."
              action
            />
          )}
        </TabsContent>

        <TabsContent value="orders" className="mt-6 space-y-4">
          {orders.isLoading ? (
            <Skeleton className="h-28 w-full rounded-lg" />
          ) : orders.data?.length ? (
            orders.data.map((o) => (
              <article key={o.id} className="panel p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-lg text-starlight">
                      {inr(o.total_inr)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString("en-IN")} · payment {o.status} ·
                      shipping <span className="text-gold">{o.shipping_status}</span>
                    </p>
                  </div>
                  {o.tracking_number && (
                    <span className="text-xs text-muted-foreground">
                      Tracking: {o.tracking_number}
                    </span>
                  )}
                </div>
                <ul className="mt-4 space-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
                  {(o.order_items ?? []).map((i, idx) => (
                    <li key={idx}>
                      {i.quantity} × {i.product_name} — {inr(i.unit_price_inr * i.quantity)}
                    </li>
                  ))}
                </ul>
              </article>
            ))
          ) : (
            <EmptyState
              title="No orders yet"
              body="Gemstones, malas and yantras you order will show their shipping status here."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: boolean;
}) {
  return (
    <div className="panel p-10 text-center">
      <h2 className="font-display text-lg text-starlight">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {action && (
        <Button asChild className="mt-5">
          <a href={SITE.topmate} target="_blank" rel="noreferrer">
            Book a session
          </a>
        </Button>
      )}
    </div>
  );
}
