import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { testData, wordCount } = body;

    // Validate input
    if (!testData || wordCount < 50) {
      return NextResponse.json(
        { error: 'Invalid test submission' },
        { status: 400 }
      );
    }

    // Check if user already has an English test record
    let englishTest = await prisma.englishTest.findUnique({
      where: { userId: session.user.id },
    });

    if (englishTest) {
      // Update existing test
      englishTest = await prisma.englishTest.update({
        where: { userId: session.user.id },
        data: {
          testData: {
            response: testData,
            wordCount,
            submittedAt: new Date().toISOString(),
          },
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new test
      englishTest = await prisma.englishTest.create({
        data: {
          userId: session.user.id,
          testData: {
            response: testData,
            wordCount,
            submittedAt: new Date().toISOString(),
          },
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'English test submitted successfully',
        data: {
          testId: englishTest.id,
          userId: englishTest.userId,
          submittedAt: englishTest.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting English test:', error);
    return NextResponse.json(
      { error: 'Failed to submit test' },
      { status: 500 }
    );
  }
}

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const englishTest = await prisma.englishTest.findUnique({
      where: { userId: session.user.id },
    });

    if (!englishTest) {
      return NextResponse.json(
        {
          success: true,
          data: {
            completed: false,
            message: 'No English test submitted yet',
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          completed: true,
          testId: englishTest.id,
          submittedAt: englishTest.updatedAt,
          score: englishTest.score,
          passed: englishTest.passed,
          completedAt: englishTest.completedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching English test:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test status' },
      { status: 500 }
    );
  }
}
