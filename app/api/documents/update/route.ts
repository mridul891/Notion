import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";



// Validation schema for document update
const updateDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().optional(),
  isArchieved: z.boolean().optional(),
  coverImage: z.string().optional(),
  isShareable :z.boolean().optional()
});

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("the body is " , body)
    const userId = req.nextUrl.searchParams.get("userId") as string;
    const id = req.nextUrl.searchParams.get("id") as string
    // console.log("the value of userId is " , userId)
    // const id = req.url.valueOf();
    // const id = searchParams.get("id");
    console.log("the values of id is " , id)
    console.log("the values of id is " , userId)


    // Validate request body
    const validatedData = updateDocumentSchema.parse(body);
    console.log("the validatedDatas is " ,validatedData)
    // Check if document exists and belongs to user
    const existingDocument = await prisma.document.findUnique({
      where: {
        id,
        userId:userId,
      },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: "Document not found or unauthorized" },
        { status: 404 }
      );
    }

    const document = await prisma.document.update({
      where: { id },
      data: {
        title: validatedData?.title,
        content: validatedData?.content,
        isArchieved: validatedData?.isArchieved,
        coverImage: validatedData?.coverImage,
        isShareable:validatedData?.isShareable
      },
     
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