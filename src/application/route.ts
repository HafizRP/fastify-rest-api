import { FastifyInstance } from 'fastify/types/instance'
import fp from 'fastify-plugin'
import userRoutes from '../modules/user/user.route';
import productRoutes from '../modules/product/product.route';
import AmqpConnection from "../utils/amqlib"


export default fp(async (server: FastifyInstance) => {
    await server.register(userRoutes, {
        prefix: "api/users",
    });

    await server.register(productRoutes, {
        prefix: "api/products",
    });


    server.get('/login', (request, reply) => {
        reply.header('Content-Type', "text/html");
        reply.send("<a href='/api/users/login/google'>Login With Google</a> <br /> <a href='/api/users/login/github'>Login With Github</a>")
    })

    server.get('/home', (request, reply) => {
        reply.header('Content-Type', "text/html");
        reply.send("<h1>You are loggedin</h1")
    })

    server.get("/healthcheck", (request, reply) => {
        return { status: "OK" };
    });

    server.get('/publish', async (request, reply) => {
        const connection = await AmqpConnection()
        const message = "Hello This is from fastify-rest-api"
        connection.sendToQueue("test-channel", Buffer.from(message))
        connection.close()
        reply.send({ message: "Message send", data: message });

    })
})