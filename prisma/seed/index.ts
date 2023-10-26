import prisma from "../../src/utils/prisma";
import { rolesSeeder } from "./roles";
import { userSeeder } from "./users";

async function main() {
    await rolesSeeder(prisma)
    await userSeeder(prisma)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })