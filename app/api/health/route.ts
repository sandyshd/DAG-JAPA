import { NextResponse } from 'next/server';

/**
 * Health check endpoint for deployment verification
 * Returns 200 when the app is ready
 */
export async function GET() {
  try {
    // Simple health check - just return OK
    // If you need DB check, import prisma and query it here
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
