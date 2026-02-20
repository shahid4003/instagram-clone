import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "../config/s3.js";

export const s3Client = new S3Client({
  region: config.REGION,
  credentials: {
    accessKeyId: config.ACCESS_KEY_ID,
    secretAccessKey: config.SECRET_ACCESS_KEY,
  },
});
const BUCKET_NAME = config.BUCKET_NAME;

export async function createPresignedPost({
  key,
  contentType,
}: {
  key: string;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  const fileLink = `https://${BUCKET_NAME}.s3.${config.REGION}.amazonaws.com/${key}`;
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { fileLink, signedUrl };
}
