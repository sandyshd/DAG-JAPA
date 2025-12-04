import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const REGISTRATION_FEE = 1500; // $15 in cents
const CURRENCY = 'usd';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
  });
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    
    // Get email and name from request body (from registration form)
    const { email, fullName } = await req.json();
    
    if (!email || !fullName) {
      console.error('Missing required fields:', { email: !!email, fullName: !!fullName });
      return NextResponse.json(
        { error: 'Missing email or fullName' },
        { status: 400 }
      );
    }

    // Try to get existing user, but don't fail if they don't exist yet
    let user = await prisma.user.findUnique({
      where: { email },
    });

    let stripeCustomerId: string | null = null;

    // Only use existing Stripe customer if user already exists
    if (user) {
      stripeCustomerId = user.stripeCustomerId || null;
    }

    // Check if user already has a successful payment (only if user exists)
    if (user) {
      const existingPayment = await prisma.payment.findFirst({
        where: {
          userId: user.id,
          paymentStatus: 'SUCCEEDED',
        },
      });

      if (existingPayment) {
        return NextResponse.json(
          { error: 'Payment already completed for this user' },
          { status: 400 }
        );
      }
    }

    // Create Stripe customer only if user exists in our system
    if (!stripeCustomerId && user) {
      const customer = await stripe.customers.create({
        email: email,
        name: fullName,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Create checkout session with comprehensive settings
    const checkoutSession = await stripe.checkout.sessions.create({
      ...(stripeCustomerId ? { customer: stripeCustomerId } : { customer_email: email }),
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: 'JAPA Registration Fee',
              description: 'Secure your spot in the JAPA program - Non-refundable eligibility test fee',
              images: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_IMAGE
                ? [process.env.NEXT_PUBLIC_STRIPE_PRODUCT_IMAGE]
                : [],
            },
            unit_amount: REGISTRATION_FEE,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/auth/register/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/auth/register/payment/cancel`,
      // Collect billing address
      billing_address_collection: 'required',
      // Metadata for tracking
      metadata: {
        email: email,
        fullName: fullName,
      },
      // Additional settings
      locale: 'auto',
      submit_type: 'pay',
    });

    // Create pending payment record in database
    const payment = await prisma.payment.create({
      data: {
        stripeSessionId: checkoutSession.id,
        transactionId: checkoutSession.payment_intent?.toString() || checkoutSession.id,
        userId: user ? user.id : undefined,
        userFriendlyId: user ? user.userId : undefined,  // Store plain format user ID if user exists
        amount: REGISTRATION_FEE / 100, // Convert cents to dollars (1500 cents = $15)
        currency: CURRENCY.toUpperCase(),
        paymentStatus: 'PENDING',
        stripeCustomerId: stripeCustomerId || undefined,
        description: 'JAPA Registration Fee',
        receiptEmail: email,
        customerEmail: email,
        customerName: fullName,
        metadata: {
          sessionId: checkoutSession.id,
          productName: 'JAPA Registration',
          mode: 'payment',
          billingAddressCollection: 'required',
        },
      },
    });

    console.log('Checkout session created:', {
      sessionId: checkoutSession.id,
      paymentId: payment.id,
      userId: user?.id,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      paymentId: payment.id,
      url: checkoutSession.url,
      clientSecret: checkoutSession.payment_intent,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
