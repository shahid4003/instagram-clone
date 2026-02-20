import { prisma } from "../config/db.js";

export const createStory = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { image, video } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newStory = await prisma.story.create({
      data: {
        userId: userId,
        image: image || null,
        video: video || null,
      },
    });

    return res.status(201).json({ story: newStory });
  } catch (error) {
    console.error("createStory error:", error);
    return res.status(500).json({ error: "Failed to create story" });
  }
};

export const getStories = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const selfStories = await prisma.story.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            img: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const otherStories = await prisma.story.findMany({
      where: {
        userId: {
          not: userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            img: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedSelfStories = await Promise.all(
      selfStories.map(async (story: any) => {
        const storyViews = await prisma.storyView.findMany({
          where: {
            storyId: story.id,
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                img: true,
                name: true,
              },
            },
          },
          orderBy: {
            viewedAt: "desc",
          },
        });

        const viewers = storyViews.map((view: any) => ({
          id: view.user.id,
          username: view.user.username,
          img: view.user.img,
          name: view.user.name,
          viewedAt: view.viewedAt,
        }));

        return {
          ...story,
          isSelf: true,
          isViewed: true,
          viewCount: viewers.length,
          viewers: viewers,
        };
      })
    );

    const formattedOtherStories = await Promise.all(
      otherStories.map(async (story: any) => {
        const userView = await prisma.storyView.findUnique({
          where: {
            userId_storyId: {
              userId: userId,
              storyId: story.id,
            },
          },
        });

        return {
          ...story,
          isSelf: false,
          isViewed: !!userView,
          viewCount: 0,
        };
      })
    );

    const allStories = [...formattedSelfStories, ...formattedOtherStories];

    return res.status(200).json({ stories: allStories });
  } catch (error) {
    console.error("getStories error:", error);
    return res.status(500).json({ error: "Failed to fetch stories" });
  }
};

export const deleteStory = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { storyId } = req.params;

    const story = await prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    if (story.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this story" });
    }

    await prisma.story.delete({
      where: { id: storyId },
    });

    return res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("deleteStory error:", error);
    return res.status(500).json({ error: "Failed to delete story" });
  }
};

export const updateStoryMedia = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { storyId } = req.params;
    const { image, video } = req.body;

    const story = await prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    if (story.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this story" });
    }

    const updatedStory = await prisma.story.update({
      where: { id: storyId },
      data: {
        image: image || story.image,
        video: video || story.video,
      },
    });

    return res.status(200).json({ story: updatedStory });
  } catch (error) {
    console.error("updateStoryMedia error:", error);
    return res.status(500).json({ error: "Failed to update story media" });
  }
};

export const markStoryAsViewed = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { storyId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    if (story.userId === userId) {
      return res.status(200).json({ message: "Viewing own story" });
    }

    try {
      await prisma.storyView.upsert({
        where: {
          userId_storyId: {
            userId: userId,
            storyId: storyId,
          },
        },
        update: {
          viewedAt: new Date(),
        },
        create: {
          userId: userId,
          storyId: storyId,
          viewedAt: new Date(),
        },
      });
    } catch (dbError) {
      console.log("StoryView table might not be migrated yet:", dbError);
    }

    return res.status(200).json({ message: "Story viewed successfully" });
  } catch (error) {
    console.error("markStoryAsViewed error:", error);
    return res.status(500).json({ error: "Failed to mark story as viewed" });
  }
};
