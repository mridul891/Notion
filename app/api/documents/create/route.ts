import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request,res : Response) {
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
    console.log(document);
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 401 });
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
