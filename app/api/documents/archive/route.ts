import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Validation schema for document archive
const archiveDocumentSchema = z.object({
  id: z.string().min(1, "Document ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = archiveDocumentSchema.parse(body);

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

    // Archive the document and all its children
    const document = await prisma.document.update({
      where: { id: validatedData.id },
      data: {
        isArchieved: true,
        children: {
          updateMany: {
            where: {},
            data: {
              isArchieved: true
            }
          }
        }
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

    console.error("Error archiving document:", error);
    return NextResponse.json(
      { error: "Failed to archive document" },
      { status: 500 }
    );
  }
} 