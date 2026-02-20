import { prisma } from "../config/db.js";

export const getSuggestedUsers = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
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

    const followingUsers = following.map((f: any) => f.following.id);

    const friendsOfFriends = await prisma.follower.findMany({
      where: {
        followerId: { in: followingUsers },
        followingId: { notIn: [...followingUsers, userId] },
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

    const suggestionsMap: { [key: string]: any } = {};

    friendsOfFriends.forEach((s: any) => {
      const id = s.following.id;
      if (!suggestionsMap[id]) {
        suggestionsMap[id] = { user: s.following, mutuals: [] };
      }
      suggestionsMap[id].mutuals.push(s.follower.username);
    });

    const suggestions = Object.values(suggestionsMap)
      .map((s) => ({
        id: s.user.id,
        username: s.user.username,
        name: s.user.name,
        mutuals: s.mutuals,
        mutualCount: s.mutuals.length,
      }))
      .sort((a, b) => b.mutualCount - a.mutualCount);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    res.status(500).json({ error: "Failed to fetch suggested users" });
  }
};
