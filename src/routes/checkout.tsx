import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { SITE, inr } from "@/lib/site";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Astro Guneesha" },
      {
        name: "description",
        content:
          "Review your cart and place your order for gemstones, rudraksha and yantras from Astro Guneesha.",
      },
      { property: "og:title", content: "Checkout — Astro Guneesha" },
      { property: "og:description", content: "Review your cart and place your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  }, []);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!cart.lines.length) return;
    setBusy(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Please sign in again.");

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          total_inr: cart.total,
          shipping_name: form.name,
          shipping_phone: form.phone,
          shipping_address: form.address,
        })
        .select("id")
        .single();
      if (error) throw error;

      const { error: itemsError } = await supabase.from("order_items").insert(
        cart.lines.map((l) => ({
          order_id: order.id,
          user_id: userId,
          product_id: l.productId,
          product_name: l.name,
          quantity: l.qty,
          unit_price_inr: l.price,
        })),
      );
      if (itemsError) throw itemsError;

      cart.clear();
      toast.success("Order placed. You can track it in your dashboard.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place the order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader eyebrow="Checkout" title="Your cart" />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          {cart.lines.length === 0 ? (
            <div className="panel p-10 text-center">
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              <Button asChild className="mt-5">
                <Link to="/shop">Browse the store</Link>
              </Button>
            </div>
          ) : (
            cart.lines.map((l) => (
              <div
                key={l.productId}
                className="panel flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div>
                  <p className="font-display text-base text-starlight">{l.name}</p>
                  <p className="text-sm text-muted-foreground">{inr(l.price)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={1}
                    value={l.qty}
                    onChange={(e) => cart.setQty(l.productId, Number(e.target.value))}
                    className="w-20"
                    aria-label={`Quantity for ${l.name}`}
                  />
                  <button
                    onClick={() => cart.remove(l.productId)}
                    className="text-sm text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="panel h-fit p-7">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl text-gold">{inr(cart.total)}</span>
          </div>

          {signedIn === false ? (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-muted-foreground">
                Sign in to place the order and track shipping in your dashboard.
              </p>
              <Button asChild className="w-full">
                <Link to="/auth">Sign in to continue</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={placeOrder} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="cname">Full name</Label>
                <Input
                  id="cname"
                  className="mt-1.5"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cphone">Phone</Label>
                <Input
                  id="cphone"
                  className="mt-1.5"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="caddr">Shipping address</Label>
                <Textarea
                  id="caddr"
                  className="mt-1.5"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={busy || cart.lines.length === 0}
              >
                {busy ? "Placing order…" : "Place order"}
              </Button>
            </form>
          )}

          <a
            href={SITE.topmate}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block text-center text-sm text-muted-foreground hover:text-gold"
          >
            Prefer to order via Topmate? →
          </a>
        </aside>
      </section>
    </>
  );
}
