import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";

function checkRole(role?: string) {
  return role === "EDITOR" || role === "SUPER_ADMIN";
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !checkRole(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = z
      .object({
        name: z.string().trim().min(2, "Nama kategori minimal 2 karakter").optional(),
        slug: z.string().trim().optional(),
      })
      .safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Data tidak valid",
        },
        { status: 400 }
      );
    }

    const updateData: { name?: string; slug?: string } = {};
    if (parsed.data.name) {
      updateData.name = parsed.data.name;
      updateData.slug = slugify(parsed.data.slug || parsed.data.name);
    } else if (parsed.data.slug) {
      updateData.slug = slugify(parsed.data.slug);
    }

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
      include: { _count: { select: { articles: true } } },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json(
          { success: false, error: "Slug kategori sudah digunakan" },
          { status: 409 }
        );
      }
      if (err.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Kategori tidak ditemukan" },
          { status: 404 }
        );
      }
    }
    console.error("PUT /api/categories/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui kategori" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !checkRole(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    if (category._count.articles > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Kategori tidak dapat dihapus karena masih digunakan oleh ${category._count.articles} berita`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, data: null });
  } catch (err) {
    console.error("DELETE /api/categories/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}
