import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail, isEmailEnabled, generatePasswordResetToken, getSetPasswordUrl } from '@/lib/email';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cvs');

async function ensureUploadsDir() {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const applications = await prisma.application.findMany({
      where,
      include: {
        user: true,
        module: true,
        adminReviewer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureUploadsDir();

    const formData = await req.formData();
    
    // Extract form fields
    const fullName = formData.get('fullName') as string;
    const email = (formData.get('email') as string)?.toLowerCase();
    const nationalId = formData.get('nationalId') as string;
    const phone = formData.get('phone') as string;
    const education = formData.get('education') as string;
    const description = formData.get('description') as string;
    const moduleId = parseInt(formData.get('moduleId') as string);
    const moduleFieldsStr = formData.get('moduleFields') as string;
    const cvFile = formData.get('cvFile') as File | null;

    // Validate required fields
    if (!fullName || !email || !nationalId || !phone || !education || !description || !moduleId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse module fields
    let moduleFields = {};
    try {
      moduleFields = JSON.parse(moduleFieldsStr || '{}');
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid module fields format' },
        { status: 400 }
      );
    }

    // Handle CV file upload
    let cvUrl: string | null = null;
    if (cvFile) {
      try {
        const fileBuffer = await cvFile.stream();
        const chunks: any[] = [];
        const reader = fileBuffer.getReader();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(Buffer.from(value));
        }
        
        const buffer = Buffer.concat(chunks);

        // Generate unique filename
        const timestamp = Date.now();
        const hash = crypto.randomBytes(8).toString('hex');
        const fileExt = path.extname(cvFile.name);
        const filename = `cv_${timestamp}_${hash}${fileExt}`;
        const filepath = path.join(uploadsDir, filename);

        // Save file
        await fs.writeFile(filepath, buffer);
        cvUrl = `/uploads/cvs/${filename}`;
      } catch (error) {
        console.error('Error uploading CV:', error);
        return NextResponse.json(
          { error: 'Failed to upload CV file' },
          { status: 500 }
        );
      }
    }

    // Check if user exists, if not create user account
    let user = await prisma.user.findUnique({
      where: { email },
    });

    let newUserCreated = false;
    if (!user) {
      // Create new user with empty password initially
      // User will set password via email link
      const tempHashedPassword = await import('bcryptjs').then(bcrypt => bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10));
      
      user = await prisma.user.create({
        data: {
          userId: `USR-${Date.now().toString().slice(-6)}`,
          email,
          fullName,
          phone,
          nationalId,
          education,
          description,
          password: tempHashedPassword,
        },
      });

      newUserCreated = true;
    } else {
      // Update existing user with additional info
      user = await prisma.user.update({
        where: { email },
        data: {
          nationalId: nationalId || user.nationalId,
          education: education || user.education,
          description: description || user.description,
        },
      });
    }

    // Verify module exists
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      return NextResponse.json(
        { error: 'Invalid module selected' },
        { status: 400 }
      );
    }

    // Generate user-friendly Application ID
    const applicationId = `APP-${Date.now().toString().slice(-6)}`;

    // Create application
    const application = await prisma.application.create({
      data: {
        applicationId,
        userId: user.id,
        moduleId,
        formData: moduleFields,
        cvUrl,
        status: 'UNDER_REVIEW',
      },
      include: {
        user: true,
        module: true,
      },
    });

    // If a new user was created and email sending is enabled, generate token and send welcome email
    try {
      if (isEmailEnabled && newUserCreated) {
        const { token } = await generatePasswordResetToken(user.id);
        const setPasswordUrl = getSetPasswordUrl(token);
        
        await sendWelcomeEmail({
          to: user.email,
          fullName: user.fullName || null,
          applicationId: application.applicationId,
          setPasswordUrl,
        });
      }
    } catch (err) {
      console.error('Failed to send welcome email:', err);
    }

    return NextResponse.json(
      {
        success: true,
        applicationId: application.applicationId,
        message: 'Application submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create application' },
      { status: 500 }
    );
  }
}
