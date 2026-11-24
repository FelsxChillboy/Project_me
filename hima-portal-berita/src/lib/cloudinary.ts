import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

export async function uploadImage(file: File): Promise<string> {
  const ext = ALLOWED_MIME_TYPES[file.type];
  if (!ext) {
    throw new UploadValidationError(
      "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF."
    );
  }
  if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
    throw new UploadValidationError("Ukuran gambar maksimal 5 MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const hasCloudinary =
    !!process.env.CLOUDINARY_CLOUD_NAME &&
    !!process.env.CLOUDINARY_API_KEY &&
    !!process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinary) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "hima-portal", resource_type: "image" }, (err, result) => {
          if (err || !result) reject(err ?? new Error("Gagal mengunggah gambar ke Cloudinary"));
          else resolve(result.secure_url);
        })
        .end(buffer);
    });
  }

  // Fallback: simpan lokal di /public/uploads dengan nama file tersanitasi
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const baseName = path
    .basename(file.name, path.extname(file.name))
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48) || "image";

  const filename = `${Date.now()}-${baseName}${ext}`;
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, buffer);
  return `/uploads/${filename}`;
}
