import { prisma } from "../config/db";

export const getProfile = async (req: any, res: any) => {
  try {
    const { username } = req.user;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        img: true,
        bio: true,
        email: true,
        followers: {
          select: {
            followerId: true,
          },
        },
        following: {
          select: {
            followingId: true,
          },
        },
        posts: {
          select: {
            id: true,
            image: true,
            video: true,
            caption: true,
            likes: true,
            comments: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const getUserById = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        img: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const getUserByUsername = async (req: any, res: any) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        img: true,
        bio: true,
        email: true,
        followers: {
          select: {
            followerId: true,
          },
        },
        following: {
          select: {
            followingId: true,
          },
        },
        posts: {
          select: {
            id: true,
            image: true,
            video: true,
            caption: true,
            likes: true,
            comments: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUser = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { name, bio, img } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        img,
      },
      select: {
        id: true,
        username: true,
        name: true,
        img: true,
        bio: true,
      },
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
