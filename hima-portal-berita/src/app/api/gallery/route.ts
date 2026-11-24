import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  title: z.string().trim().min(2, "Judul foto minimal 2 karakter"),
  caption: z.string().trim().optional().nullable(),
  imageUrl: z.string().trim().min(1, "Gambar wajib diunggah"),
});

export async function GET() {
  try {
    const items = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error("GET /api/gallery error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memuat galeri" },
      { status: 500 }
    );
  }
}

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
          error: parsed.error.issues[0]?.message || "Data galeri tidak valid",
        },
        { status: 400 }
      );
    }

    const item = await prisma.gallery.create({
      data: {
        title: parsed.data.title,
        caption: parsed.data.caption || null,
        imageUrl: parsed.data.imageUrl,
      },
    });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (err) {
    console.error("POST /api/gallery error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan foto galeri" },
      { status: 500 }
    );
  }
}
