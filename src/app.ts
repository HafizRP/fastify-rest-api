import main from "./server";

async function buildServer() {
  const server = await main()

  try {
    await server.listen({ port: 3000 })
    console.log("Server was running on port 3000")
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

buildServer()