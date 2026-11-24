import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { createExcerpt, sanitizeArticleHtml } from "@/lib/sanitize";

const updateSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").optional(),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().optional().nullable(),
  content: z.string().trim().min(1, "Konten wajib diisi").optional(),
  thumbnail: z.string().trim().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  categoryId: z.string().trim().min(1).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const trackView = searchParams.get("trackView") === "1";

    const article = await prisma.article.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    if (article.status !== "PUBLISHED") {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json(
          { success: false, error: "Berita tidak ditemukan" },
          { status: 404 }
        );
      }
      if (
        session.user.role === "PENULIS" &&
        article.authorId !== session.user.id
      ) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }
    }

    if (trackView && article.status === "PUBLISHED") {
      await prisma.article.update({
        where: { id: article.id },
        data: { views: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (err) {
    console.error("GET /api/articles/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memuat detail berita" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    if (
      session.user.role === "PENULIS" &&
      article.authorId !== session.user.id
    ) {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki izin mengedit berita ini" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Data berita tidak valid",
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: Prisma.ArticleUncheckedUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined && data.slug !== "") {
      updateData.slug = slugify(data.slug);
    }
    if (data.content !== undefined) {
      const cleanContent = sanitizeArticleHtml(data.content);
      updateData.content = cleanContent;
      if (data.excerpt === undefined || data.excerpt === "") {
        updateData.excerpt = createExcerpt(cleanContent);
      }
    }
    if (data.excerpt !== undefined && data.excerpt !== "") {
      updateData.excerpt = data.excerpt;
    }
    if (data.thumbnail !== undefined) {
      updateData.thumbnail = data.thumbnail || null;
    }
    if (data.categoryId !== undefined) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!categoryExists) {
        return NextResponse.json(
          { success: false, error: "Kategori tidak ditemukan" },
          { status: 400 }
        );
      }
      updateData.categoryId = data.categoryId;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === "PUBLISHED" && !article.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const updated = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Slug sudah digunakan oleh berita lain" },
        { status: 409 }
      );
    }
    console.error("PUT /api/articles/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui berita" },
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
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    if (
      session.user.role === "PENULIS" &&
      article.authorId !== session.user.id
    ) {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki izin menghapus berita ini" },
        { status: 403 }
      );
    }

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true, data: null });
  } catch (err) {
    console.error("DELETE /api/articles/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus berita" },
      { status: 500 }
    );
  }
}
