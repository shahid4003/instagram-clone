import { prisma } from "../config/db";

export const createPost = async (req: any, res: any) => {
  const { userId, caption, image, video } = req.body;
  try {
    if (!userId)
      return res
        .status(400)
        .json({ status: "error", message: "userId is required" });

    const post = await prisma.post.create({
      data: {
        userId,
        caption: caption || null,
        image: image || null,
        video: video || null,
      },
    });
    res.status(201).json({ status: "success", data: post });
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPosts = async (req: any, res: any) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, name: true, img: true } },
        likes: true,
        comments: true,
      },
    });
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPostById = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, name: true, img: true } },
        likes: true,
        comments: true,
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePost = async (req: any, res: any) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { caption, image, video } = req.body;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized or post not found" });
    }
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { caption, image, video },
    });
    res.status(200).json({ status: "success", data: updatedPost });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req: any, res: any) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized or post not found" });
    }
    await prisma.post.delete({ where: { id } });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addMedia = async (req: any, res: any) => {
  const { postId } = req.params;
  const { image, video } = req.body;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        image: image || undefined,
        video: video || undefined,
      },
    });

    res.status(200).json({ status: "success", data: updatedPost });
  } catch (error) {
    console.error("Add media error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
