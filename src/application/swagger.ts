import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin'
import { userSchemas } from '../modules/user/user.schema';
import { productSchemas } from '../modules/product/product.schema';
import { errorSchema } from '../common/schema/error.schema';
import { appSchemas } from '../common/schema/app.schema';


export default fp(async (server) => {
    for (const schema of [...userSchemas, ...productSchemas, ...errorSchema, ...appSchemas]) {
        server.addSchema(schema);
    }

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
                    }
                },
            },
        }
    });

    await server.register(fastifySwaggerUi, {
        routePrefix: "/docs",
        staticCSP: true,
        uiConfig: { 
            persistAuthorization: true
        },
        uiHooks: {
            preHandler: async (request, reply) => {
                const token = request.headers['authorization']
                if (token != undefined) {
                    const [username, password] = Buffer.from(token.split(' ')[1], 'base64').toString().split(':');
                    if (username != 'admin' && password == 'admin') {
                        reply.header("WWW-Authenticate", "Basic realm='swagger-ui'")
                        reply.code(401).send("INVALID_CREDENTIALS")
                    }
                } else {
                    reply.header("WWW-Authenticate", "Basic realm='swagger-ui'")
                    reply.code(401).send("UNATHROIZED")
                }
            }
        }
    });
})

