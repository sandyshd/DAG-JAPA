import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Normalize email to lowercase for consistency
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered. Please use a different email address.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Email is available' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check email availability. Please try again.' },
      { status: 500 }
    );
  }
}
