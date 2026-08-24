import "server-only";
import sharp from "sharp";

export interface CompressImageOptions {
  /**
   * WebP compression quality (default 90 provides visually lossless results with substantial file size savings).
   * Range: 1-100.
   */
  quality?: number;
  /**
   * If true, enables mathematical lossless WebP encoding.
   */
  lossless?: boolean;
  /**
   * CPU effort / compression level (0-6, default: 4). Higher = smaller file size.
   */
  effort?: number;
  /**
   * Optional maximum width for downscaling very large images while maintaining aspect ratio.
   */
  maxWidth?: number;
  /**
   * Optional maximum height for downscaling while maintaining aspect ratio.
   */
  maxHeight?: number;
}

/**
 * Compresses an image Buffer or ArrayBuffer into optimized WebP format without quality loss.
 *
 * @param input Image buffer, Uint8Array, or ArrayBuffer
 * @param options Compression configuration options
 * @returns Object containing the compressed WebP buffer, dimensions, and content-type
 */
export async function compressImageToWebp(
  input: Buffer | Uint8Array | ArrayBuffer,
  options: CompressImageOptions = {}
): Promise<{
  buffer: Buffer;
  contentType: string;
  extension: string;
  width?: number;
  height?: number;
}> {
  const {
    quality = 90,
    lossless = false,
    effort = 5,
    maxWidth,
    maxHeight,
  } = options;

  const inputBuffer = Buffer.isBuffer(input)
    ? input
    : Buffer.from(input instanceof ArrayBuffer ? new Uint8Array(input) : input);

  let pipeline = sharp(inputBuffer).rotate(); // Auto-orient based on EXIF

  if (maxWidth || maxHeight) {
    pipeline = pipeline.resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  pipeline = pipeline.webp({
    quality,
    lossless,
    effort,
  });

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    contentType: "image/webp",
    extension: "webp",
    width: info.width,
    height: info.height,
  };
}

/**
 * Compresses a File object (from FormData or form inputs) into WebP buffer and metadata.
 */
export async function compressFileToWebp(
  file: File,
  options?: CompressImageOptions
) {
  const arrayBuffer = await file.arrayBuffer();
  return compressImageToWebp(arrayBuffer, options);
}
