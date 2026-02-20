import { prisma } from "../config/db.js";

export const newComment = async (req: any, res: any) => {
  const { postId, content, parentId } = req.body;
  const userId = req.user.id;
  try {
    if (parentId) {
      const replyComment = await prisma.comment.create({
        data: {
          postId,
          userId,
          text: content,
          parentId,
        },
      });
      return res.status(201).json(replyComment);
    }
    const newComment = await prisma.comment.create({
      data: {
        postId,
        userId,
        text: content,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Comment creation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getComments = async (req: any, res: any) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      include: {
        user: { select: { id: true, username: true, name: true, img: true } },
        replies: {
          include: {
            user: {
              select: { id: true, username: true, name: true, img: true },
            },
          },
        },
      },
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteComment = async (req: any, res: any) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
