import "server-only";

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  region: process.env.AWS_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
});

export const BUCKET_NAME =
  process.env.NEON_STORAGE_BUCKET || "swasthyokor-storage";

/**
 * Upload a buffer or string to Neon Object Storage
 */
export async function uploadObject({
  key,
  body,
  contentType,
}: {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
}) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3.send(command);

  // Return public URL (since bucket is public_read)
  const endpoint = (process.env.AWS_ENDPOINT_URL_S3 || "").replace(/\/$/, "");
  return `${endpoint}/${BUCKET_NAME}/${key}`;
}

/**
 * Generate a presigned view URL
 */
export async function getPresignedViewUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(s3, command, { expiresIn });
}
