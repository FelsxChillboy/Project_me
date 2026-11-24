import { NextResponse } from "next/server";
import { Prisma, Status } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { createExcerpt, sanitizeArticleHtml } from "@/lib/sanitize";

const createSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter"),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(1, "Konten wajib diisi"),
  thumbnail: z.string().trim().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  categoryId: z.string().trim().min(1, "Kategori wajib dipilih"),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category")?.trim() || undefined;
    const search = searchParams.get("search")?.trim() || undefined;
    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const rawPerPage = parseInt(searchParams.get("perPage") || "10", 10);
    const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const perPage =
      Number.isNaN(rawPerPage) || rawPerPage < 1 ? 10 : Math.min(rawPerPage, 50);
    const requestedStatus = searchParams.get("status");

    const where: Prisma.ArticleWhereInput = {};

    if (requestedStatus && requestedStatus !== "PUBLISHED") {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
      if (requestedStatus === "DRAFT") {
        where.status = Status.DRAFT;
      } else if (requestedStatus !== "ALL") {
        where.status = Status.PUBLISHED;
      }
      if (session.user.role === "PENULIS") {
        where.authorId = session.user.id;
      }
    } else {
      where.status = Status.PUBLISHED;
    }

    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        articles,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (err) {
    console.error("GET /api/articles error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar berita" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
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
    const categoryExists = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" },
        { status: 400 }
      );
    }

    let slug = data.slug ? slugify(data.slug) : slugify(data.title);
    if (!slug) slug = `berita-${Date.now()}`;

    const existingSlug = await prisma.article.findUnique({ where: { slug } });
    if (existingSlug) {
      if (data.slug) {
        return NextResponse.json(
          { success: false, error: "Slug sudah digunakan oleh berita lain" },
          { status: 409 }
        );
      }
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const cleanContent = sanitizeArticleHtml(data.content);
    const excerpt = data.excerpt || createExcerpt(cleanContent);
    const status = data.status || "DRAFT";

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        excerpt,
        content: cleanContent,
        thumbnail: data.thumbnail || null,
        status,
        categoryId: data.categoryId,
        authorId: session.user.id,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Slug berita sudah digunakan" },
        { status: 409 }
      );
    }
    console.error("POST /api/articles error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan berita" },
      { status: 500 }
    );
  }
}
