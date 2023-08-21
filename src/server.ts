import main from "./app";

import dotenv from "dotenv";

dotenv.config({
  path:
    process.env.NODE_ENV == "test"
      ? ".env.test"
      : process.env.NODE_ENV == "development"
      ? ".env.local"
      : ".env",
});

console.log(`Current environtmen : ${process.env.NODE_ENV}`);

async function buildServer() {
  const app = await main();
  try {
    await app.listen({ port: 3000 });
  } catch (error) {
    process.exit(1);
  }
}

buildServer();
