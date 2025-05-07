import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      userId,
      isArchieved,
      parentDocument,
      content,
      coverImage,
      icon,
      isPublished,
      isShareable,
    } = body;

    const document = await prisma.document.create({
      data: {
        title,
        userId,
        isArchieved,
        parentDocument,
        content,
        coverImage,
        icon,
        isPublished,
        isShareable,
      },
    });
    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}

