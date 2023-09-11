import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin'
import { userSchemas } from '../modules/user/user.schema';
import { productSchemas } from '../modules/product/product.schema';
import { errorSchema } from '../common/schema/error.schema';


export default fp(async (server) => {
    for (const schema of [...userSchemas, ...productSchemas, ...errorSchema]) {
        server.addSchema(schema);
    }
    ''
    await server.register(fastifySwagger, {
        openapi: {
            info: {
                title: "Fastify API",
                description: "API for alls",
                version: "1.0.0",
            },
            components: {
                securitySchemes: {
                    Authorization: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT"
                        // name: "Authorization",
                        // in: "header"
                    }
                },
            },
            // security: [{ AuthToken: [] }]
        }
    });

    await server.register(fastifySwaggerUi, {
        routePrefix: "/docs",
        staticCSP: true,
        uiConfig: {
            persistAuthorization: true
        }
    });
})

