import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId } = body;

    const posts = await prisma.document.findMany({
      where: { userId },
    });

    return NextResponse.json({ posts: posts });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error });
  }
}
