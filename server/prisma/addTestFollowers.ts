import { prisma } from "../src/config/db";

async function main() {
  const targetUserId = "cmkgo8ijp00001jupjndp1n7l";

  // fetch other users
  const users = await prisma.user.findMany({
    where: {
      id: { not: targetUserId },
    },
    take: 10,
  });

  if (!users.length) {
    console.log("❌ No users found to follow");
    return;
  }

  await prisma.follower.createMany({
    data: users.map((user) => ({
      followerId: user.id,
      followingId: targetUserId,
    })),
    skipDuplicates: true,
  });

  console.log(`✅ ${users.length} test followers added`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
