import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const productInput = {
  title: z.string(),
  price: z.number(),
  content: z.string().optional(),
};

const getProductSchema = z.object({ product_id: z.number() })

const productGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};


const createProductSchema = z.object({ ...productInput, ownerId: z.number() });
const createProductResponseSchema = z.object({});
const productResponseSchema = z.object({
  ...productInput,
  ...productGenerated,
});
export const productsResponseSchema = z.array(productResponseSchema);

export const filterProductRequestSchema = z.object({
  title: z.string()
})

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type GetProductInput = z.infer<typeof getProductSchema>
export type FilterProductInput = z.infer<typeof filterProductRequestSchema>

export const { schemas: productSchemas, $ref: productRef } = buildJsonSchemas(
  {
    createProductSchema,
    createProductResponseSchema,
    productsResponseSchema,
    productResponseSchema,
    getProductSchema,
  },
  { $id: "productSchema" }
);
