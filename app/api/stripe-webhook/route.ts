import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { addCreditsToUser } from "@/lib/actions/user";
export async function POST(request: NextRequest) {
    const sig = request.headers.get("stripe-signature")!;
    let event;

    try {
        const body = await request.text();
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.log(`❌ Error message: ${err}`);
        return NextResponse.json({ message: `Webhook Error: ${err}` }, { status: 400 });
    }
    switch (event.type) {
    case 'payment_intent.canceled':
      const paymentIntentCanceled = event.data.object;
      console.log('PaymentIntent was canceled!');
      console.log(paymentIntentCanceled);
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentPaymentFailed = event.data.object;
        console.log('PaymentIntent payment failed!');
        console.log(paymentIntentPaymentFailed);
      
      break;
    case 'payment_intent.succeeded':
      const userId=event.data.object.metadata.userId;
      const credits=parseInt(event.data.object.metadata.credits);
      console.log(`PaymentIntent for ${credits} credits was successful!`);
      //update in the database
      await addCreditsToUser(userId,credits);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
    return NextResponse.json({ received: true }, { status: 200 });
}