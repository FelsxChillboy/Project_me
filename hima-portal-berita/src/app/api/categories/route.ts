import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (err) {
    console.error("GET /api/categories error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar kategori" },
      { status: 500 }
    );
  }
}

const createSchema = z.object({
  name: z.string().trim().min(2, "Nama kategori minimal 2 karakter"),
  slug: z.string().trim().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const role = session?.user?.role;
    if (!session?.user || (role !== "EDITOR" && role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Data kategori tidak valid",
        },
        { status: 400 }
      );
    }

    const { name, slug } = parsed.data;
    const finalSlug = slugify(slug || name);
    if (!finalSlug) {
      return NextResponse.json(
        { success: false, error: "Slug kategori tidak valid" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name, slug: finalSlug },
      include: { _count: { select: { articles: true } } },
    });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Kategori dengan slug tersebut sudah ada" },
        { status: 409 }
      );
    }
    console.error("POST /api/categories error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal membuat kategori" },
      { status: 500 }
    );
  }
}
