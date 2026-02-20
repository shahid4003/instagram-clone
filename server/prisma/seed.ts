import { prisma } from "../src/config/db";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follower.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  // ========== CREATE USERS ==========
  const usersData = [
    {
      email: "sarah@test.com",
      username: "sarah_photography",
      name: "Sarah Mitchell",
      password,
      bio: "📸 Photographer | Travel lover | Coffee addict",
    },
    {
      email: "mike@test.com",
      username: "mike.fitness",
      name: "Mike Johnson",
      password,
      bio: "💪 Personal Trainer | Healthy lifestyle",
    },
    {
      email: "emma@test.com",
      username: "emma.cooks",
      name: "Emma Davis",
      password,
      bio: "🍳 Home chef | Recipe creator | Food is love",
    },
    {
      email: "alex@test.com",
      username: "alex_travels",
      name: "Alex Turner",
      password,
      bio: "✈️ 30 countries and counting",
    },
    {
      email: "jessica@test.com",
      username: "jessica.art",
      name: "Jessica Lee",
      password,
      bio: "🎨 Digital artist | Commissions open",
    },
    {
      email: "david@test.com",
      username: "david_tech",
      name: "David Brown",
      password,
      bio: "💻 Software dev | Tech reviews",
    },
    {
      email: "nina@test.com",
      username: "nina.yoga",
      name: "Nina Patel",
      password,
      bio: "🧘 Yoga instructor | Mindfulness",
    },
    {
      email: "chris@test.com",
      username: "chris.music",
      name: "Chris Wilson",
      password,
      bio: "🎸 Musician | Guitar covers",
    },
    {
      email: "olivia@test.com",
      username: "olivia_style",
      name: "Olivia Garcia",
      password,
      bio: "👗 Fashion blogger | Style tips",
    },
    {
      email: "james@test.com",
      username: "james.outdoors",
      name: "James Miller",
      password,
      bio: "🏔️ Hiker | Nature photographer",
    },
    {
      email: "sophia@test.com",
      username: "sophia.books",
      name: "Sophia Anderson",
      password,
      bio: "📚 Bookworm | 100 books/year challenge",
    },
    {
      email: "ryan@test.com",
      username: "ryan_gaming",
      name: "Ryan Chen",
      password,
      bio: "🎮 Gamer | Twitch streamer",
    },
  ];

  await prisma.user.createMany({ data: usersData });
  const users = await prisma.user.findMany();

  console.log(`✅ Created ${users.length} users`);

  // Helper to find user by username
  const getUser = (username: string) =>
    users.find((u) => u.username === username)!;

  // ========== CREATE POSTS ==========
  const postsData = [
    // Sarah - Photography
    {
      user: "sarah_photography",
      caption: "Golden hour never disappoints 🌅",
      image: "sunset",
    },
    {
      user: "sarah_photography",
      caption: "Street photography in Tokyo 🇯🇵",
      image: "tokyo",
    },
    {
      user: "sarah_photography",
      caption: "Portrait session today!",
      image: "portrait",
    },
    {
      user: "sarah_photography",
      caption: "New camera gear! Excited to test 📷",
      image: "camera",
    },

    // Mike - Fitness
    {
      user: "mike.fitness",
      caption: "Leg day complete 🦵 No excuses!",
      image: "gym",
    },
    {
      user: "mike.fitness",
      caption: "Meal prep Sunday! Protein packed 💪",
      image: "mealprep",
    },
    {
      user: "mike.fitness",
      caption: "New PR today! 225lb bench 🎉",
      image: "weights",
    },

    // Emma - Cooking
    {
      user: "emma.cooks",
      caption: "Homemade pasta from scratch 🍝",
      image: "pasta",
    },
    { user: "emma.cooks", caption: "Sunday brunch vibes 🥞", image: "brunch" },
    {
      user: "emma.cooks",
      caption: "Farmers market haul 🥬🍅",
      image: "market",
    },
    { user: "emma.cooks", caption: "Baking sourdough today!", image: "bread" },

    // Alex - Travel
    {
      user: "alex_travels",
      caption: "Santorini sunsets hit different 🇬🇷",
      image: "santorini",
    },
    {
      user: "alex_travels",
      caption: "Lost in Barcelona streets",
      image: "barcelona",
    },
    { user: "alex_travels", caption: "Swiss Alps hiking ⛰️", image: "alps" },
    {
      user: "alex_travels",
      caption: "Japan was incredible 🇯🇵",
      image: "japan",
    },

    // Jessica - Art
    {
      user: "jessica.art",
      caption: "New digital piece finished! 🎨",
      image: "digitalart",
    },
    {
      user: "jessica.art",
      caption: "Work in progress... thoughts?",
      image: "wip",
    },
    {
      user: "jessica.art",
      caption: "Commission completed ❤️",
      image: "commission",
    },

    // David - Tech
    { user: "david_tech", caption: "New setup who dis? 💻", image: "setup" },
    {
      user: "david_tech",
      caption: "Finally got the MacBook Pro!",
      image: "macbook",
    },
    {
      user: "david_tech",
      caption: "Coding at 2am... the usual 😅",
      image: "coding",
    },

    // Nina - Yoga
    {
      user: "nina.yoga",
      caption: "Morning yoga by the beach 🧘‍♀️",
      image: "beachyoga",
    },
    {
      user: "nina.yoga",
      caption: "Breathe in positivity ✨",
      image: "meditation",
    },
    {
      user: "nina.yoga",
      caption: "New class schedule up!",
      image: "yogaclass",
    },

    // Chris - Music
    {
      user: "chris.music",
      caption: "New cover dropping Friday! 🎸",
      image: "guitar",
    },
    {
      user: "chris.music",
      caption: "Studio session was fire 🔥",
      image: "studio",
    },
    {
      user: "chris.music",
      caption: "Thank you Denver! Amazing show!",
      image: "concert",
    },

    // Olivia - Fashion
    { user: "olivia_style", caption: "Today's OOTD 👗", image: "ootd" },
    {
      user: "olivia_style",
      caption: "Fall fashion essentials 🍂",
      image: "fall",
    },
    {
      user: "olivia_style",
      caption: "Thrift haul! All under $50 💰",
      image: "thrift",
    },

    // James - Outdoors
    {
      user: "james.outdoors",
      caption: "Summit reached at sunrise 🏔️",
      image: "summit",
    },
    {
      user: "james.outdoors",
      caption: "Camping under the stars ⭐",
      image: "camping",
    },
    {
      user: "james.outdoors",
      caption: "Trail running is my therapy 🏃",
      image: "trail",
    },

    // Sophia - Books
    {
      user: "sophia.books",
      caption: "Currently reading: Project Hail Mary 📖",
      image: "reading",
    },
    {
      user: "sophia.books",
      caption: "Book haul! My wallet is crying 😅",
      image: "bookhaul",
    },
    {
      user: "sophia.books",
      caption: "Cozy reading corner ☕",
      image: "bookshelf",
    },

    // Ryan - Gaming
    {
      user: "ryan_gaming",
      caption: "Stream starting in 10! 🎮",
      image: "streaming",
    },
    {
      user: "ryan_gaming",
      caption: "Finally beat the boss! 47 tries 😤",
      image: "victory",
    },
    { user: "ryan_gaming", caption: "New RGB setup 🌈", image: "rgbsetup" },
  ];

  for (const post of postsData) {
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - randomDaysAgo);

    await prisma.post.create({
      data: {
        userId: getUser(post.user).id,
        caption: post.caption,
        image: `https://picsum.photos/seed/${post.image}/600/600`,
        createdAt,
      },
    });
  }

  console.log(`✅ Created ${postsData.length} posts`);

  // ========== CREATE FOLLOW RELATIONSHIPS ==========
  // Creating a realistic social graph:
  // - Similar interests follow each other
  // - Some users are more "popular"
  // - Creates chains for "friends of friends" suggestions

  const followData = [
    // Sarah (photography) is popular - many followers
    { follower: "emma.cooks", following: "sarah_photography" },
    { follower: "alex_travels", following: "sarah_photography" },
    { follower: "olivia_style", following: "sarah_photography" },
    { follower: "james.outdoors", following: "sarah_photography" },
    { follower: "jessica.art", following: "sarah_photography" },

    // Sarah follows other creatives
    { follower: "sarah_photography", following: "jessica.art" },
    { follower: "sarah_photography", following: "alex_travels" },
    { follower: "sarah_photography", following: "emma.cooks" },

    // Fitness & Wellness circle
    { follower: "nina.yoga", following: "mike.fitness" },
    { follower: "mike.fitness", following: "nina.yoga" },
    { follower: "james.outdoors", following: "mike.fitness" },
    { follower: "mike.fitness", following: "emma.cooks" }, // meal prep connection

    // Travel & Outdoors circle
    { follower: "james.outdoors", following: "alex_travels" },
    { follower: "alex_travels", following: "james.outdoors" },
    { follower: "alex_travels", following: "sarah_photography" },

    // Creative circle (art, fashion, photography)
    { follower: "olivia_style", following: "jessica.art" },
    { follower: "jessica.art", following: "olivia_style" },
    { follower: "jessica.art", following: "chris.music" },

    // Tech & Gaming circle
    { follower: "david_tech", following: "ryan_gaming" },
    { follower: "ryan_gaming", following: "david_tech" },

    // Food connections
    { follower: "emma.cooks", following: "nina.yoga" }, // healthy lifestyle
    { follower: "sophia.books", following: "emma.cooks" },

    // Random realistic follows
    { follower: "sophia.books", following: "nina.yoga" },
    { follower: "chris.music", following: "alex_travels" },
    { follower: "olivia_style", following: "emma.cooks" },
    { follower: "ryan_gaming", following: "chris.music" },
    { follower: "nina.yoga", following: "sophia.books" },
  ];

  const followPairs = new Set<string>();
  let createdFollows = 0;

  for (const follow of followData) {
    const key = `${follow.follower}->${follow.following}`;
    if (followPairs.has(key)) {
      console.warn(`Skipping duplicate follow pair: ${key}`);
      continue;
    }
    followPairs.add(key);

    await prisma.follower.create({
      data: {
        followerId: getUser(follow.follower).id,
        followingId: getUser(follow.following).id,
      },
    });
    createdFollows++;
  }

  console.log(`✅ Created ${createdFollows} follow relationships`);

  // ========== CREATE LIKES ==========
  const allPosts = await prisma.post.findMany();

  let likeCount = 0;
  for (const post of allPosts) {
    // Random 2-6 users like each post
    const numLikes = Math.floor(Math.random() * 5) + 2;
    const likers = users
      .filter((u) => u.id !== post.userId) // can't like own post
      .sort(() => Math.random() - 0.5)
      .slice(0, numLikes);

    for (const liker of likers) {
      await prisma.like.create({
        data: {
          userId: liker.id,
          postId: post.id,
        },
      });
      likeCount++;
    }
  }

  console.log(`✅ Created ${likeCount} likes`);

  // ========== CREATE COMMENTS ==========
  const commentTexts = [
    "Love this! 😍",
    "Amazing shot!",
    "So cool!",
    "This is incredible",
    "Goals! 🙌",
    "Beautiful ❤️",
    "Wow!",
    "Need to try this",
    "Awesome!",
    "This made my day",
    "Absolutely stunning",
    "Can't wait to see more!",
    "So inspiring",
    "Great work!",
    "Love the vibes ✨",
  ];

  let commentCount = 0;
  for (const post of allPosts) {
    // Random 0-4 comments per post
    const numComments = Math.floor(Math.random() * 5);
    const commenters = users
      .filter((u) => u.id !== post.userId)
      .sort(() => Math.random() - 0.5)
      .slice(0, numComments);

    for (const commenter of commenters) {
      const randomComment =
        commentTexts[Math.floor(Math.random() * commentTexts.length)];

      await prisma.comment.create({
        data: {
          userId: commenter.id,
          postId: post.id,
          text: randomComment,
        },
      });
      commentCount++;
    }
  }

  console.log(`✅ Created ${commentCount} comments`);

  console.log("\n🎉 Seed completed successfully!");
  console.log(
    "📧 Login with any email (e.g., sarah@test.com) and password: password123"
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
