import { createPresignedPost } from "../utils/s3.js";
import config from "../config/s3.js";

export const uploadToS3 = async (req: any, res: any) => {
  try {
    const { key, content_type, username, postId, avatar, story, storyId } = req.body;
    let s3Key;
    if (avatar) {
      s3Key = `avatars/${username}/${key}`;
    } else if (story) {
      s3Key = `stories/${username}/${storyId}/${key}`;
    } else {
      s3Key = `posts/${username}/${postId}/${key}`;
    }
    const data = await createPresignedPost({ key: s3Key, contentType: content_type });
    res.json({ status: "success", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error" });
  }
};

export const getSignedUrl = async (req: any, res: any) => {
  try {
    console.log("=== DEBUG ===");
  console.log("Original URL:", req.originalUrl);
  console.log("Path:", req.path);
  console.log("Query:", req.query);
  console.log("Params:", req.params);

	  const key = req.query.key || req.params[0]; // Support both
    if (!key) {
      return res.status(400).json({ status: "error", message: "Key required" });
    }
    const url = `https://${config.CLOUDFRONT_DOMAIN}/${key}`;
    res.json({ status: "success", url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error" });
  }
};
