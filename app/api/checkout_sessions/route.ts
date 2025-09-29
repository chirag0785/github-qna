import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const {credits}= await request.json();
    const {userId}=auth();
    if(!credits || credits <= 0) {
      return NextResponse.json(
        { error: 'Invalid credits amount' },
        { status: 400 }
      )
    }
    const headersList = await headers()
    const origin = headersList.get('origin');

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price_data: {
            currency: 'usd',
            unit_amount: 0.05 * 100,
            product_data: {
                name: 'RepoMind Credits',
                description: 'Credits to use RepoMind AI features',
            }
        },
            quantity: credits,
        },
      ],
      payment_intent_data: {
        metadata: {
          credits: String(credits),
          userId
        }
      },
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard`,
    });
    return NextResponse.json({url: session.url}, {status: 200})
  } catch (err:any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}