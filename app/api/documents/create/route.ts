import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Validation schema for document creation
const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  userId: z.string().min(1, "User ID is required"),
  isArchieved: z.boolean().optional().default(false),
  parentDocument: z.string().nullable().optional().default(null),
  content: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  isShareable: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("the value of body is ",body)
    // Validate request body
    const validatedData = createDocumentSchema.parse(body);
    console.log(validatedData)
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
    console.log("reached here")
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

    console.log("Error creating document");
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}


