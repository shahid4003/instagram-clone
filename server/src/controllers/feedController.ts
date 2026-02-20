
import { prisma } from "../config/db.js";
import { shuffleArray } from "../utils/shuffleArray.js";

export const getFeed = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    let { take, lastCursor } = req.query;
    take = parseInt(take) || 7;
    lastCursor = lastCursor || null;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const following = await prisma.follower.findMany({
      where: { followerId: userId },
      select: {
        followingId: true,
        following: {
          select: { id: true, name: true, username: true, img: true },
        },
      },
    });
    const followingIds = following.map((f: any) => f.followingId);

    const followingPosts = await prisma.post.findMany({
      where: { userId: { in: followingIds } },
      orderBy: { createdAt: "desc" },
      take: take,
      ...(lastCursor
        ? {
            skip: 1,
            cursor: { id: lastCursor },
          }
        : {}),
      include: {
        likes: true,
        comments: true,
        user: {
          select: { id: true, username: true, name: true, img: true },
        },
      },
    });

    const nextCursor =
      followingPosts.length > 0
        ? followingPosts[followingPosts.length - 1].id
        : null;
    const hasNextPage = followingPosts.length === take;

    const popularPostsRaw = await prisma.post.findMany({
      orderBy: [
        { likes: { _count: "desc" } },
        { comments: { _count: "desc" } },
        { createdAt: "desc" },
      ],
      take: 50,
      include: {
        _count: { select: { likes: true, comments: true } },
        user: { select: { id: true, username: true, name: true, img: true } },
      },
    });
    const popularPosts = popularPostsRaw
      .map((p: any) => ({ ...p, score: p._count.likes * 3 + p._count.comments * 5 }))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10)
      .filter((p: any) => !followingPosts.some((f: any) => f.id === p.id));

    const combinedPosts = [...followingPosts, ...popularPosts];
    const feedPosts = shuffleArray(combinedPosts);

    return res.status(200).json({
      data: feedPosts,
      metaData: { lastCursor: nextCursor, hasNextPage },
    });
  } catch (err) {
    console.error("Error fetching feed:", err);
    return res.status(500).json({ error: "Failed to fetch feed" });
  }
};
