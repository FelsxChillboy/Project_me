import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = session?.user?.role;
    if (!session?.user || (role !== "EDITOR" && role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.gallery.delete({ where: { id } });
    return NextResponse.json({ success: true, data: null });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Foto galeri tidak ditemukan" },
        { status: 404 }
      );
    }
    console.error("DELETE /api/gallery/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus foto galeri" },
      { status: 500 }
    );
  }
}
