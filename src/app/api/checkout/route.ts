import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { products, deliveryOptions } from "@/lib/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerInfo, deliveryMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error:
            "Stripe is not configured yet. Please add your Stripe secret key.",
        },
        { status: 500 }
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      // Prices are stored in whole HKD; Stripe expects cents
      lineItems.push({
        price_data: {
          currency: "hkd",
          product_data: {
            name: product.name,
            description: product.preorder
              ? `Pre-order — ${product.availableDate}`
              : product.sku,
            images: product.image.startsWith("http")
              ? [product.image]
              : undefined,
            metadata: {
              sku: product.sku,
              productId: product.id,
            },
          },
          unit_amount: product.price * 100,
        },
        quantity: item.quantity,
      });
    }

    // Add delivery as a line item if applicable
    const delivery = deliveryOptions.find((d) => d.id === deliveryMethod);
    if (delivery && delivery.price > 0) {
      lineItems.push({
        price_data: {
          currency: "hkd",
          product_data: {
            name: `Delivery — ${delivery.label}`,
            description: delivery.labelCn,
          },
          unit_amount: delivery.price * 100,
        },
        quantity: 1,
      });
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerInfo.email,
      metadata: {
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        deliveryMethod: deliveryMethod,
        shippingAddress: customerInfo.shippingAddress || "",
        remarks: customerInfo.remarks || "",
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
