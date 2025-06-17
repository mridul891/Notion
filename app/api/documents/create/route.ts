import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Validation schema for document creation
const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  userId: z.string().min(1, "User ID is required"),
  isArchieved: z.boolean().optional().default(false),
  parentDocument: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  isPublished: z.boolean().optional().default(false),
  isShareable: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = createDocumentSchema.parse(body);

    // Check if parent document exists if parentDocument is provided
    if (validatedData.parentDocument) {
      const parentExists = await prisma.document.findUnique({
        where: { id: validatedData.parentDocument }
      });

      if (!parentExists) {
        return NextResponse.json(
          { error: "Parent document not found" },
          { status: 404 }
        );
      }
    }

    const document = await prisma.document.create({
      data: validatedData,
      include: {
        parent: true,
        children: true
      }
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, userId, content, coverImage, icon } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const document = await prisma.document.update({
      where: { id },
      data: {
        content,
        coverImage,
        icon,
      },
      include: {
        parent: true,
        children: true
      }
    });

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}
