import main from "./server";
import { Env } from "./common/schema/app.schema";

async function buildServer() {
  const app = await main();
  try {
    await app.listen({ port: Env.APP_PORT });
  } catch (error) {
    console.log(error)
    process.exit(1);
  }
}

buildServer();
