import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendWelcomeEmail, isEmailEnabled, generatePasswordResetToken, getSetPasswordUrl } from '@/lib/email';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, fullName, phone } = body;

    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, fullName' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user with temporary random password
    // User will set their own password via email link
    const tempHashedPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: tempHashedPassword,
        fullName,
        phone: phone || null,
        userId: `USR-${Date.now().toString().slice(-6)}`,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    // Generate password reset token and send welcome email (only if enabled)
    try {
      if (isEmailEnabled) {
        const { token } = await generatePasswordResetToken(user.id);
        const setPasswordUrl = getSetPasswordUrl(token);
        
        await sendWelcomeEmail({
          to: user.email,
          fullName: user.fullName || null,
          applicationId: null,
          setPasswordUrl,
        });
      }
    } catch (err) {
      console.error('Failed to send welcome email:', err);
    }

    return NextResponse.json(
      { 
        message: 'User created successfully. Please check your email to set your password.',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
