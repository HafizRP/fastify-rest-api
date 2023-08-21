import main from "./app";


async function buildServer() {
    const app = await main()
    try {
        await app.listen({ port: 3000 })
    } catch (error) {
        process.exit(1)
    }

}

buildServer()