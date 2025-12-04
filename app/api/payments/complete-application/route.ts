import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { sendWelcomeEmail, generatePasswordResetToken, getSetPasswordUrl } from '@/lib/email';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, email, fullName, moduleId, moduleFields, phone, nationalId, education, description } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    let stripeCustomerId: string | null = null;

    if (!user) {
      // Create user account if it doesn't exist yet
      try {
        user = await prisma.user.create({
          data: {
            email,
            fullName: fullName || '',
            password: '', // Password will be set via reset token
            userId: `USR-${Math.floor(Math.random() * 1000000)}`,
            phone: phone || null,
            nationalId: nationalId || null,
            education: education || null,
            description: description || null,
          },
        });
      } catch (error: any) {
        // If user was already created (race condition), fetch it
        if (error.code === 'P2002') {
          user = await prisma.user.findUnique({
            where: { email },
          });
          if (!user) throw error;
        } else {
          throw error;
        }
      }
    }

    // Create Stripe customer for user if they don't have one yet
    if (user && !user.stripeCustomerId) {
      const stripe = getStripe();
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.fullName || '',
          metadata: {
            userId: user.id,
          },
        });
        stripeCustomerId = customer.id;

        // Update user with Stripe customer ID
        user = await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId },
        });
      } catch (error) {
        console.error('Error creating Stripe customer:', error);
        // Continue anyway - Stripe customer creation is not critical
      }
    } else if (user) {
      stripeCustomerId = user.stripeCustomerId;
    }

    // Verify payment was successful
    const payment = await prisma.payment.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.paymentStatus !== 'SUCCEEDED') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Update payment record with userId and stripeCustomerId if they were NULL
    let updatedPayment = payment;
    if (!payment.userId || !payment.stripeCustomerId) {
      updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          userId: user.id,
          userFriendlyId: user.userId,  // Store plain format user ID (e.g., USR-670329)
          stripeCustomerId: stripeCustomerId || undefined,
        },
      });
    }

    // Check if application already exists for this session
    // More robust check: look for application with this user and stripe session ID
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // If the most recent application has the same stripeSessionId, it's a duplicate
    if (existingApplication && 
        existingApplication.formData && 
        typeof existingApplication.formData === 'object' &&
        (existingApplication.formData as any).stripeSessionId === sessionId) {
      return NextResponse.json({
        success: true,
        applicationId: existingApplication.applicationId,
        message: 'Application already processed for this payment',
      });
    }

    // Create application
    const userFriendlyId = `APP-${Math.floor(Math.random() * 1000000)}`;

    const application = await prisma.application.create({
      data: {
        applicationId: userFriendlyId,
        userId: user.id,
        moduleId: parseInt(moduleId),
        formData: {
          ...moduleFields,
          stripeSessionId: sessionId,
          paymentId: updatedPayment.id,
          paymentMethod: updatedPayment.paymentMethod,
          last4: (updatedPayment.metadata as any)?.last4,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
        },
        cvUrl: null, // Handle file uploads separately if needed
      },
    });

    // Generate password reset token and send welcome email
    const tokenData = await generatePasswordResetToken(user.id);

    await sendWelcomeEmail({
      to: user.email,
      fullName: user.fullName,
      setPasswordUrl: getSetPasswordUrl(tokenData.token),
    });

    console.log('Application created after payment:', {
      applicationId: application.id,
      paymentId: updatedPayment.id,
      userId: user.id,
      stripeCustomerId: stripeCustomerId,
    });

    return NextResponse.json({
      success: true,
      applicationId: application.applicationId,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Error creating application after payment:', error);
    return NextResponse.json(
      { error: 'Failed to create application', success: false },
      { status: 500 }
    );
  }
}
