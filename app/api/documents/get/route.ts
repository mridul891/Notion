import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const id = req.nextUrl.searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    if (id) {
      // Fetch a single document by id and userId
      const document = await prisma.document.findUnique({
        where: {
          id,
          userId,
        },
      });
      if (!document) {
        return NextResponse.json(
          { error: "Document not found or unauthorized" },
          { status: 404 }
        );
      }
      return NextResponse.json({ document }, { status: 200 });
    }

    const documents = await prisma.document.findMany({
      where: { 
        userId,
        parentDocument: null // Only get root documents
      },
      include: {
        children: {
          include: {
            children: true // Recursively include children
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
