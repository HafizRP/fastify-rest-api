import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin'
import { userSchemas } from '../modules/user/user.schema';
import { productSchemas } from '../modules/product/product.schema';


export default fp(async (server) => {
    for (const schema of [...userSchemas, ...productSchemas]) {
        server.addSchema(schema);
    }
    await server.register(fastifySwagger, {
        openapi: {
            info: {
                title: "Fastify API",
                description: "API for alls",
                version: "1.0.0",
            },
        },
    });

    await server.register(fastifySwaggerUi, {
        routePrefix: "/docs",
        staticCSP: true,
    });
})

