import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const moduleId = parseInt(params.id, 10);
    
    console.log(`[API] Fetching module with ID: ${moduleId} (from params: ${params.id})`);
    
    if (isNaN(moduleId)) {
      console.log(`[API] Invalid module ID: ${params.id}`);
      return NextResponse.json(
        { success: false, error: 'Invalid module ID' },
        { status: 400 }
      );
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      console.log(`[API] Module with ID ${moduleId} not found in database`);
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      );
    }

    console.log(`[API] Module found: ${module.name}`);

    // Prisma returns JSONB as objects already, no need to parse
    const moduleData = {
      ...module,
      benefits: module.benefits || [],
      requirements: module.requirements || [],
      process: module.process || [],
      testimonials: module.testimonials || [],
      faqs: module.faqs || [],
      fields: module.fields || [],
    };

    return NextResponse.json({ success: true, data: moduleData });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[API] Error fetching module: ${errorMessage}`);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch module', message: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const module = await prisma.module.update({
      where: { id: parseInt(params.id) },
      data: body,
    });
    return NextResponse.json(module);
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.module.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
