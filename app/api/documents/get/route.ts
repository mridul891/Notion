import prisma from "@/lib/prisma";
import { NextResponse ,NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") as string
  console.log("the value of userID is " , userId)

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), {
      status: 400,
    });
  }

  const posts = await prisma.document.findMany({
    where: { userId : userId },
  });

  return NextResponse.json({ posts: posts });
}
