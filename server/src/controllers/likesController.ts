import { prisma } from "../config/db.js";

export const likeController = async (req: any, res: any) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      return res.status(400).json({ message: "Already liked" });
    }

    const like = await prisma.like.create({
      data: { userId, postId },
    });

    res.status(201).json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unLikeController = async (req: any, res: any) => {
  const { postId } = req.params;
  const userId = req.user.id;
  console.log("Unlike request for postId:", postId, "by userId:", userId);
  try {
    const like = await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    res.status(201).json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostLikes = async (req: any, res: any) => {
  const { postId } = req.params;
  try {
    const likes = await prisma.like.findMany({
      where: { postId },
      include: {
        user: { select: { id: true, username: true, name: true, img: true } },
      },
    });
    res.status(200).json({ likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
