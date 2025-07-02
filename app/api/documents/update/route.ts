import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Validation schema for document update
const updateDocumentSchema = z.object({
  id: z.string().min(1, "Document ID is required"),
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required").optional(),
  content : z.string().optional()
});

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = updateDocumentSchema.parse(body);

    // Check if document exists and belongs to user
    const existingDocument = await prisma.document.findFirst({
      where: {
        id: validatedData.id,
        userId: validatedData.userId,
      },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: "Document not found or unauthorized" },
        { status: 404 }
      );
    }

    const document = await prisma.document.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData?.title,
        content : validatedData?.content
      },
      include: {
        parent: true,
        children: true
      }
    });

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
} 