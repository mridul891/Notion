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

export async function UPDATE(req: Request) {
  const body = await req.json();

  const { userId, content, coverImage, icon, id } = body;

  if (!id || !userId) {
    return new NextResponse("Missing Id or userId  ");
  }
  // const newPost = await prisma.document.
}
