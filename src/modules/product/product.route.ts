import { FastifyInstance } from "fastify";
import { createProductHandler, getProductHandler, getProductsHandler } from "./product.controller";
import { productRef } from "./product.schema";
import { ApiErrorsSchema } from "../../common/schema/error.schema";


async function productRoutes(server: FastifyInstance) {
  server.post(
    "",
    {
      preHandler: [server.authenticate],
      schema: {
        tags: ["Products Routes"],
        security: [{ Authorization: [] }],
        body: productRef("createProductSchema"),
        response: {
          201: productRef("productResponseSchema"),
          ...ApiErrorsSchema
        },
      },
    },
    createProductHandler
  );

  server.get(
    "",
    {
      schema: {
        tags: ["Products Routes"],
        response: {
          200: productRef("productsResponseSchema"),
          ...ApiErrorsSchema
        },
      },
    },
    getProductsHandler
  );

  server.get('/:product_id',
    {
      schema: {
        tags: ["Products Routes"],
        params: productRef('getProductSchema'),
        response: {
          200: productRef('productResponseSchema'),
          ...ApiErrorsSchema
        }
      }
    },
    getProductHandler
  )
}

export default productRoutes;
