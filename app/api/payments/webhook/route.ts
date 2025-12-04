import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
  });
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const stripe = getStripe();
    console.log('Checkout session completed:', session.id);

    // Update payment with session details
    const payment = await prisma.payment.findUnique({
      where: { stripeSessionId: session.id },
    });

    if (!payment) {
      console.warn('Payment not found for session:', session.id);
      return;
    }

    // Get payment intent to get comprehensive details
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent as string,
      { expand: ['payment_method'] }
    );

    // Get charges from the payment intent
    const charges = await stripe.charges.list({
      payment_intent: paymentIntent.id,
      limit: 1,
    });

    const charge = charges.data[0];
    const receiptUrl = charge?.receipt_url || null;

    // Get payment method details
    const paymentMethod = paymentIntent.payment_method
      ? await stripe.paymentMethods.retrieve(paymentIntent.payment_method as string)
      : null;

    // Update payment status with comprehensive data
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: 'SUCCEEDED',
        transactionId: paymentIntent.id,
        stripePaymentIntentId: paymentIntent.id,
        paymentMethodId: paymentIntent.payment_method as string | undefined,
        paymentMethod: paymentMethod?.type || 'card',
        receiptUrl,
        receiptNumber: charge?.receipt_number || undefined,
        customerEmail: session.customer_email || undefined,
        billingDetails: paymentMethod?.billing_details
          ? {
              name: paymentMethod.billing_details.name,
              email: paymentMethod.billing_details.email,
              phone: paymentMethod.billing_details.phone,
              address: paymentMethod.billing_details.address
                ? {
                    line1: paymentMethod.billing_details.address.line1,
                    line2: paymentMethod.billing_details.address.line2,
                    city: paymentMethod.billing_details.address.city,
                    state: paymentMethod.billing_details.address.state,
                    postal_code: paymentMethod.billing_details.address.postal_code,
                    country: paymentMethod.billing_details.address.country,
                  }
                : undefined,
            }
          : undefined,
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
          paymentMethodType: paymentMethod?.type,
        },
      },
    });

    console.log('Payment marked as succeeded:', payment.id);
  } catch (error) {
    console.error('Error handling checkout.session.completed:', error);
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  try {
    const stripe = getStripe();
    console.log('Payment intent succeeded:', paymentIntent.id);

    // Find payment by transaction ID
    const payment = await prisma.payment.findUnique({
      where: { transactionId: paymentIntent.id },
    });

    if (!payment) {
      console.warn('Payment not found for intent:', paymentIntent.id);
      return;
    }

    // Get payment method details
    const paymentMethod = paymentIntent.payment_method
      ? await stripe.paymentMethods.retrieve(paymentIntent.payment_method as string)
      : null;

    // Get receipt URL
    const charges = await stripe.charges.list({
      payment_intent: paymentIntent.id,
      limit: 1,
    });

    const charge = charges.data[0];
    const receiptUrl = charge?.receipt_url || null;

    // Update payment status if not already succeeded
    if (payment.paymentStatus !== 'SUCCEEDED') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          paymentStatus: 'SUCCEEDED',
          stripePaymentIntentId: paymentIntent.id,
          paymentMethodId: paymentIntent.payment_method as string | undefined,
          paymentMethod: paymentMethod?.type || 'card',
          receiptUrl,
          receiptNumber: charge?.receipt_number || undefined,
          billingDetails: paymentMethod?.billing_details
            ? {
                name: paymentMethod.billing_details.name,
                email: paymentMethod.billing_details.email,
                phone: paymentMethod.billing_details.phone,
                address: paymentMethod.billing_details.address
                  ? {
                      line1: paymentMethod.billing_details.address.line1,
                      line2: paymentMethod.billing_details.address.line2,
                      city: paymentMethod.billing_details.address.city,
                      state: paymentMethod.billing_details.address.state,
                      postal_code: paymentMethod.billing_details.address.postal_code,
                      country: paymentMethod.billing_details.address.country,
                    }
                  : undefined,
              }
            : undefined,
          succeededAt: new Date(),
          metadata: {
            ...(payment.metadata as Record<string, any> || {}),
            paymentIntentId: paymentIntent.id,
            chargeId: charge?.id,
            last4: (paymentMethod?.card as any)?.last4,
            brand: (paymentMethod?.card as any)?.brand,
          },
        },
      });

      console.log('Payment marked as succeeded:', payment.id);
    }
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error);
  }
}

async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
) {
  try {
    console.log('Payment intent failed:', paymentIntent.id);

    // Find payment by transaction ID
    const payment = await prisma.payment.findUnique({
      where: { transactionId: paymentIntent.id },
    });

    if (!payment) {
      console.warn('Payment not found for intent:', paymentIntent.id);
      return;
    }

    // Update payment status with error details
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: 'FAILED',
        failedAt: new Date(),
        metadata: {
          ...(payment.metadata as Record<string, any> || {}),
          failureCode: paymentIntent.last_payment_error?.code,
          failureMessage: paymentIntent.last_payment_error?.message,
          failureType: paymentIntent.last_payment_error?.type,
        },
      },
    });

    console.log('Payment marked as failed:', payment.id);
  } catch (error) {
    console.error('Error handling payment_intent.payment_failed:', error);
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    console.log('Charge refunded:', charge.id);

    if (!charge.payment_intent) {
      console.warn('No payment intent for refunded charge:', charge.id);
      return;
    }

    // Find payment by transaction ID
    const payment = await prisma.payment.findUnique({
      where: { transactionId: charge.payment_intent.toString() },
    });

    if (!payment) {
      console.warn('Payment not found for refunded charge:', charge.id);
      return;
    }

    // Update payment status to reflect refund
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: 'CANCELED',
        refundAmount: charge.amount_refunded,
        refundStatus: 'succeeded',
        refundedAt: new Date(),
        metadata: {
          ...(payment.metadata as Record<string, any> || {}),
          refundChargeId: charge.id,
          refundedAt: new Date().toISOString(),
          refundAmount: charge.amount_refunded,
          balanceTransaction: typeof charge.balance_transaction === 'string' 
            ? charge.balance_transaction 
            : charge.balance_transaction?.id,
        },
      },
    });

    console.log('Payment marked as refunded:', payment.id);
  } catch (error) {
    console.error('Error handling charge.refunded:', error);
  }
}
