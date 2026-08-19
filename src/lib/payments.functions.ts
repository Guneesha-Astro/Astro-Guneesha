import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  orderId: z.string().uuid(),
});

/**
 * Creates a Razorpay order for an order row that belongs to the caller.
 * Secrets are read inside the handler and never reach the browser.
 */
export const createPaymentOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data, context }) => {
    const keyId = process.env["RAZORPAY_KEY_ID"];
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];

    const { data: order, error } = await context.supabase
      .from("orders")
      .select("id, total_inr, status")
      .eq("id", data.orderId)
      .single();

    if (error || !order) throw new Error("Order not found");

    if (!keyId || !keySecret) {
      return {
        configured: false as const,
        message:
          "Online payment is not configured yet. Your order is saved and can be paid via the Topmate link.",
      };
    }

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      },
      body: JSON.stringify({
        amount: order.total_inr * 100,
        currency: "INR",
        receipt: order.id,
        notes: { app_order_id: order.id, user_id: context.userId },
      }),
    });

    if (!res.ok) {
      console.error("razorpay order creation failed", res.status);
      throw new Error("Could not start payment. Please try again.");
    }

    const rp = (await res.json()) as { id: string; amount: number; currency: string };

    await context.supabase
      .from("orders")
      .update({ payment_ref: rp.id, status: "awaiting_payment" })
      .eq("id", order.id);

    return {
      configured: true as const,
      keyId,
      razorpayOrderId: rp.id,
      amount: rp.amount,
      currency: rp.currency,
    };
  });
