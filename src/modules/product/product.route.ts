import { FastifyInstance } from "fastify";
import { createProductHandler, getProductHandler, getProductsHandler } from "./product.controller";
import { productRef } from "./product.schema";

async function productRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ["Products Routes"],
        security: [{ Authorization: [] }],
        body: productRef("createProductSchema"),
        response: {
          201: productRef("productResponseSchema"),
        },
      },
    },
    createProductHandler
  );

  server.get(
    "/",
    {
      schema: {
        tags: ["Products Routes"],
        response: {
          200: productRef("productsResponseSchema"),
        },
      },
    },
    getProductsHandler
  );

  server.get('/:product_id',
    {
      schema: {
        tags: ["Products Routes"],
        params: productRef('getProductSchema')
      }
    },
    getProductHandler
  )
}

export default productRoutes;
