import { PrismaClient } from "@prisma/client";
import { Env } from "../common/schema/app.schema";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: Env.DATABASE_URL,
    },
  },
});

export default prisma;
