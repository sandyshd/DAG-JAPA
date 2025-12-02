import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { deletePasswordResetToken, getPasswordResetToken } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, passwordConfirm } = body;

    // Validate inputs
    if (!token || !password || !passwordConfirm) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Get the reset token from database
    const resetToken = await getPasswordResetToken(token);

    if (!resetToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > resetToken.expiresAt) {
      // Delete expired token
      await deletePasswordResetToken(token);
      return NextResponse.json(
        { success: false, error: 'Token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Delete the used token
    await deletePasswordResetToken(token);

    return NextResponse.json(
      { success: true, message: 'Password set successfully. You can now log in.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[set-password] error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while setting your password' },
      { status: 500 }
    );
  }
}
