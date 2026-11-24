import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage, UploadValidationError } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "File gambar wajib dilampirkan" },
        { status: 400 }
      );
    }

    const url = await uploadImage(file);
    return NextResponse.json({ success: true, data: { url } });
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 400 }
      );
    }
    console.error("POST /api/upload error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal mengunggah gambar" },
      { status: 500 }
    );
  }
}
