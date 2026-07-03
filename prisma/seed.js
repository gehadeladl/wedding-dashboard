const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await prisma.admin.upsert({
    where: {
      username: "admin",
    },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log("Admin Created Successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
