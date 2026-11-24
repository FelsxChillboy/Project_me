import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").optional(),
  email: z.string().trim().email("Format email tidak valid").optional(),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "EDITOR", "PENULIS"]).optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Data pengguna tidak valid",
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    if (id === session.user.id && data.role && data.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Tidak dapat menurunkan role akun sendiri" },
        { status: 400 }
      );
    }

    const updateData: Prisma.UserUpdateInput = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email.toLowerCase();
    if (data.role) updateData.role = data.role;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { articles: true } },
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json(
          { success: false, error: "Email sudah digunakan pengguna lain" },
          { status: 409 }
        );
      }
      if (err.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Pengguna tidak ditemukan" },
          { status: 404 }
        );
      }
    }
    console.error("PUT /api/users/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui pengguna" },
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
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (id === session.user.id) {
      return NextResponse.json(
        { success: false, error: "Tidak dapat menghapus akun yang sedang digunakan" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    if (user._count.articles > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Pengguna tidak dapat dihapus karena masih memiliki ${user._count.articles} berita`,
        },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, data: null });
  } catch (err) {
    console.error("DELETE /api/users/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus pengguna" },
      { status: 500 }
    );
  }
}
