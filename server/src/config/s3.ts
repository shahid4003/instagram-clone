import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: 3000,
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  BUCKET_NAME: process.env.S3_BUCKET_NAME!,
  REGION: process.env.AWS_REGION!,
  CLOUDFRONT_DOMAIN: process.env.CLOUDFRONT_DOMAIN!,
};
export default config;
