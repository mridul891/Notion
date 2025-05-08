import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }) {
  const {id} = await params;

  const posts = await prisma.document.findMany({
    where: { userId: id },
  });

  return NextResponse.json({ posts: posts });
}
