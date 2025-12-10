import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required', success: false },
        { status: 400 }
      );
    }

    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found', success: false },
        { status: 404 }
      );
    }

    // Check payment status
    if (session.payment_status === 'paid') {
      // Get payment intent for detailed info
      const paymentIntent = session.payment_intent as Stripe.PaymentIntent;

      // Get charges from the payment intent
      const charges = await stripe.charges.list({
        payment_intent: paymentIntent.id,
        limit: 1,
      });

      const charge = charges.data[0];
      const receiptUrl = charge?.receipt_url || null;

      // Extract billing and customer details
      const paymentMethod = paymentIntent.payment_method
        ? await stripe.paymentMethods.retrieve(paymentIntent.payment_method as string)
        : null;

      const billingDetails = paymentMethod?.billing_details || null;

      // Update payment record with comprehensive Stripe data
      const payment = await prisma.payment.findUnique({
        where: { stripeSessionId: sessionId },
      });

      if (payment && payment.paymentStatus !== 'SUCCEEDED') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            paymentStatus: 'SUCCEEDED',
            transactionId: paymentIntent.id,
            stripePaymentIntentId: paymentIntent.id,
            receiptUrl,
            receiptNumber: charge?.receipt_number || undefined,
            customerEmail: session.customer_email || undefined,
            billingDetails: billingDetails ? {
              name: billingDetails.name,
              email: billingDetails.email,
              phone: billingDetails.phone,
              address: {
                line1: billingDetails.address?.line1,
                line2: billingDetails.address?.line2,
                city: billingDetails.address?.city,
                state: billingDetails.address?.state,
                postal_code: billingDetails.address?.postal_code,
                country: billingDetails.address?.country,
              },
            } : undefined,
            paymentMethodId: paymentIntent.payment_method as string | undefined,
            paymentMethod: paymentMethod?.type || 'card',
            succeededAt: new Date(),
            metadata: {
              sessionId: session.id,
              paymentIntentId: paymentIntent.id,
              chargeId: charge?.id,
              receiptNumber: charge?.receipt_number,
              last4: (paymentMethod?.card as any)?.last4,
              brand: (paymentMethod?.card as any)?.brand,
              expMonth: (paymentMethod?.card as any)?.exp_month,
              expYear: (paymentMethod?.card as any)?.exp_year,
            },
          },
        });

        console.log('Payment verified and updated with Stripe data:', payment.id);
      }

      return NextResponse.json({
        success: true,
        paymentStatus: 'paid',
        amount: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_email,
        paymentMethod: paymentMethod?.type,
        receiptUrl,
      });
    } else if (session.payment_status === 'unpaid') {
      return NextResponse.json(
        { error: 'Payment is still pending', success: false },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: 'Unknown payment status', success: false },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying session:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message, success: false },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to verify payment session', success: false },
      { status: 500 }
    );
  }
}
