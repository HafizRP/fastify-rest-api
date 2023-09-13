import { FastifyInstance } from "fastify";
import main from "../../src/server";
import { CreateProductInput } from "../../src/modules/product/product.schema";
import { LoginInput, LoginResponse } from "../../src/modules/user/user.schema";
import prisma from "../../src/utils/prisma";
import { JwtSchema } from "../../src/common/schema/app.schema";

let server: FastifyInstance;

beforeAll(async () => {
  server = await main();
});

afterAll(async () => {
  await prisma.product.deleteMany()
  await server.close();
});


describe('Product endpoints', () => {
  let accessToken: string

  const user: LoginInput = {
    email: "Kepoloe123@gmail.com",
    password: "kepoloe123",
  };

  const product: CreateProductInput = {
    price: 3000,
    title: "This is test products",
    content: "This is test product content",
    ownerId: 0
  }


  test('Login User', async () => {
    const response = await server.inject({ path: '/api/users/login', method: "POST", body: user })

    const body: LoginResponse = await response.json()

    const owner = server.jwt.decode<JwtSchema>(body.accessToken)

    product.ownerId = owner?.id as number

    accessToken = body.accessToken

    expect(response.statusCode).toBe(200)
  })

  test('Create product', async () => {
    const response = await server.inject({
      url: '/api/products',
      method: 'POST',
      body: product,
      headers: { "authorization": "Bearer " + accessToken }
    })

    expect(response.statusCode).toBe(201)
  })
})