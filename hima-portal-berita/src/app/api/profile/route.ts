import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").optional(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(6, "Password baru minimal 6 karakter")
    .optional()
    .or(z.literal("")),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memuat profil" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const rate = checkRateLimit(`profile:${session.user.id}`, 10, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak percobaan. Coba lagi dalam ${rate.retryAfterSec} detik.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Data profil tidak valid",
        },
        { status: 400 }
      );
    }

    const { name, currentPassword, newPassword } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: { name?: string; password?: string } = {};
    if (name) updateData.name = name;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: "Password saat ini wajib diisi" },
          { status: 400 }
        );
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json(
          { success: false, error: "Password saat ini salah" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT /api/profile error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
