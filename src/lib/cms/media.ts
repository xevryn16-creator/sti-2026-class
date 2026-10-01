import fs from "fs";
import path from "path";
import sharp from "sharp";
import type { MediaAssetEntity, MediaType } from "@/types/cms";
import { getSupabaseAdminClient, isSupabaseConfigured } from "./supabase";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Supported MIME types and max sizes
const ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
const ALLOWED_VIDEO_MIMES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export interface ProcessedUploadResult {
  asset: MediaAssetEntity;
  success: boolean;
  error?: string;
}

/**
 * Sanitize filename to prevent directory traversal and unsafe characters
 */
export function sanitizeFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const base = path
    .basename(filename, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
  const timestamp = Date.now();
  return `${base}-${timestamp}${ext}`;
}

const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".mp4",
  ".webm",
  ".mov",
];

/**
 * Validate upload buffer against MIME type, extension, and magic bytes
 */
export function validateMediaBuffer(
  buffer: Buffer,
  mimeType: string,
  filename: string
): { valid: boolean; mediaType: MediaType; error?: string } {
  const ext = path.extname(filename).toLowerCase();

  // 1. Strict extension whitelist
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      mediaType: "image",
      error: `Ekstensi file '${ext}' tidak diizinkan. Berkas eksekusi, SVG, atau skrip dilarang demi keamanan.`,
    };
  }

  // 2. MIME type whitelist
  const isImage = ALLOWED_IMAGE_MIMES.includes(mimeType);
  const isVideo = ALLOWED_VIDEO_MIMES.includes(mimeType);

  if (!isImage && !isVideo) {
    return {
      valid: false,
      mediaType: "image",
      error: `Tipe file '${mimeType}' tidak didukung. Format yang diizinkan: JPG, PNG, WebP, AVIF, MP4, WebM, QuickTime.`,
    };
  }

  const mediaType: MediaType = isImage ? "image" : "video";

  // 3. File size limits
  if (isImage && buffer.length > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      mediaType,
      error: `Ukuran gambar melebihi batas 10MB (${(buffer.length / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  if (isVideo && buffer.length > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      mediaType,
      error: `Ukuran video melebihi batas 50MB (${(buffer.length / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  // 4. Magic bytes inspection to prevent MIME spoofing
  if (buffer.length < 12) {
    return {
      valid: false,
      mediaType,
      error: "Berkas tidak valid atau rusak (ukuran terlalu kecil).",
    };
  }

  // PNG magic bytes: 89 50 4E 47
  if (mimeType === "image/png") {
    if (buffer[0] !== 0x89 || buffer[1] !== 0x50 || buffer[2] !== 0x4e || buffer[3] !== 0x47) {
      return { valid: false, mediaType, error: "Header berkas PNG tidak valid (MIME spoofing terdeteksi)." };
    }
  }

  // JPEG magic bytes: FF D8 FF
  if (mimeType === "image/jpeg") {
    if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) {
      return { valid: false, mediaType, error: "Header berkas JPEG tidak valid (MIME spoofing terdeteksi)." };
    }
  }

  // WebP magic bytes: RIFF .... WEBP
  if (mimeType === "image/webp") {
    const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
    const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
    if (!isRiff || !isWebp) {
      return { valid: false, mediaType, error: "Header berkas WebP tidak valid (MIME spoofing terdeteksi)." };
    }
  }

  return { valid: true, mediaType };
}

/**
 * Strip EXIF location metadata and optimize image
 */
export async function processImageBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<{ buffer: Buffer; width?: number; height?: number; format: string }> {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Strip EXIF metadata completely to protect privacy (no GPS coordinates)
    // Convert to webp if jpeg/png for optimal performance unless already webp/avif
    let processedImage = image.rotate(); // auto-orient based on EXIF before stripping

    if (mimeType === "image/jpeg" || mimeType === "image/png") {
      const optimizedBuffer = await processedImage
        .webp({ quality: 85 })
        .toBuffer();
      const meta = await sharp(optimizedBuffer).metadata();
      return {
        buffer: optimizedBuffer,
        width: meta.width,
        height: meta.height,
        format: "webp",
      };
    }

    const outputBuffer = await processedImage.toBuffer();
    return {
      buffer: outputBuffer,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format ?? "webp",
    };
  } catch (error) {
    console.error("Image processing error:", error);
    // If sharp fails (e.g. invalid image data), return original buffer
    return { buffer, format: "raw" };
  }
}

/**
 * Handle media file upload
 */
export async function uploadMediaFile(
  file: File,
  uploaderEmail: string
): Promise<ProcessedUploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  let buffer: Buffer = Buffer.from(new Uint8Array(arrayBuffer));
  const mimeType = file.type || "application/octet-stream";
  const rawFilename = file.name || "upload.bin";

  const validation = validateMediaBuffer(buffer, mimeType, rawFilename);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      asset: {} as MediaAssetEntity,
    };
  }

  let finalWidth: number | undefined;
  let finalHeight: number | undefined;
  let cleanName = sanitizeFilename(rawFilename);

  if (validation.mediaType === "image") {
    const processed = await processImageBuffer(buffer, mimeType);
    buffer = processed.buffer;
    finalWidth = processed.width;
    finalHeight = processed.height;
    if (processed.format === "webp" && !cleanName.endsWith(".webp")) {
      cleanName = cleanName.replace(/\.[^.]+$/, ".webp");
    }
  }

  const assetId = `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  let finalUrl = `/uploads/${cleanName}`;

  // If Supabase Storage is configured, upload to "media" bucket
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase.storage
        .from("media")
        .upload(cleanName, buffer, {
          contentType: validation.mediaType === "image" ? "image/webp" : mimeType,
          upsert: true,
        });

      if (!error && data) {
        const { data: pubData } = supabase.storage.from("media").getPublicUrl(cleanName);
        finalUrl = pubData.publicUrl;
      }
    }
  }

  // Ensure local public/uploads directory exists and write file as reliable fallback/local dev
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    const localFilePath = path.join(UPLOADS_DIR, cleanName);
    fs.writeFileSync(localFilePath, buffer);
  } catch (err) {
    console.error("Local file write error:", err);
  }

  const asset: MediaAssetEntity = {
    id: assetId,
    filename: cleanName,
    url: finalUrl,
    mimeType: validation.mediaType === "image" ? "image/webp" : mimeType,
    sizeBytes: buffer.length,
    width: finalWidth,
    height: finalHeight,
    type: validation.mediaType,
    createdAt: new Date().toISOString(),
    createdBy: uploaderEmail,
  };

  return {
    success: true,
    asset,
  };
}
