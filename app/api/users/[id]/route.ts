import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session to verify authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = params.id;

    // Verify the user is requesting their own data
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch user with applications and modules
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        education: true,
        createdAt: true,
        applications: {
          select: {
            applicationId: true,
            status: true,
            createdAt: true,
            moduleId: true,
            formData: true,
            cvUrl: true,
            module: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: user.phone || '',
        location: user.education || '',
        joinDate: user.createdAt,
        applications: user.applications.map((app) => ({
          id: app.applicationId,
          moduleId: app.moduleId,
          moduleName: app.module.name,
          moduleDescription: app.module.description,
          status: app.status.toLowerCase(),
          submittedAt: app.createdAt,
          cvPath: app.cvUrl,
          moduleFields: app.formData,
        })),
        stats: {
          totalApplications: user.applications.length,
          activeApplications: user.applications.filter(
            (app) => app.status === 'APPROVED'
          ).length,
          submittedDocuments: user.applications.filter(
            (app) => app.cvUrl
          ).length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = params.id;

    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, phone, location } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        education: location?.trim() || null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        education: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        location: updatedUser.education || '',
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
