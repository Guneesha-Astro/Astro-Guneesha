import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Razorpay webhook. Verifies the HMAC-SHA256 signature over the raw body
 * before any order is marked paid, so fulfilment cannot be forged.
 */
export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["RAZORPAY_WEBHOOK_SECRET"];
        if (!secret) return new Response("Not configured", { status: 503 });

        const signature = request.headers.get("x-razorpay-signature") ?? "";
        const raw = await request.text();

        const expected = createHmac("sha256", secret).update(raw).digest("hex");
        const a = Buffer.from(signature);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: {
          event?: string;
          payload?: {
            payment?: { entity?: { order_id?: string; notes?: { app_order_id?: string } } };
          };
        };
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("Bad payload", { status: 400 });
        }

        const entity = payload.payload?.payment?.entity;
        const appOrderId = entity?.notes?.app_order_id;
        if (!appOrderId) return new Response("ok");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (payload.event === "payment.captured") {
          await supabaseAdmin
            .from("orders")
            .update({ status: "paid", shipping_status: "processing" })
            .eq("id", appOrderId);
        } else if (payload.event === "payment.failed") {
          await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", appOrderId);
        }

        return new Response("ok");
      },
    },
  },
});
