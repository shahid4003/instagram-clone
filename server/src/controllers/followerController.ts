import { prisma } from "../config/db.js";

export const followUser = async (req: any, res: any) => {
  const followerId = req.user.id;
  const { followingId } = req.body;

  try {
    if (followerId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    if (existingFollow) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }
    const follow = await prisma.follower.create({
      data: {
        followerId,
        followingId,
      },
    });

    return res.status(201).json({ follow });
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const unfollowUser = async (req: any, res: any) => {
  const followerId = req.user.id;
  const { followingId } = req.body;

  try {
    const unfollow = await prisma.follower.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });

    return res.status(200).json({ unfollow });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowing = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const following = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            img: true,
          },
        },
      },
    });
    return res.status(200).json({ following });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowingByUserId = async (req: any, res: any) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }

    const following = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            img: true,
          },
        },
      },
    });

    return res.status(200).json({ following });
  } catch (error) {
    console.error("Error fetching following by user id:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowers = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const followers = await prisma.follower.findMany({
      where: {
        followingId: userId,
      },
      select: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            img: true,
          },
        },
      },
    });
    return res.status(200).json({ followers });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowersByUserId = async (req: any, res: any) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }

    const followers = await prisma.follower.findMany({
      where: {
        followingId: userId,
      },
      select: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            img: true,
          },
        },
      },
    });

    return res.status(200).json({ followers });
  } catch (error) {
    console.error("Error fetching followers by user id:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
