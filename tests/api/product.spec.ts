import { FastifyInstance } from "fastify";
import main from "../../src/server";
import { LoginInput, LoginResponse } from "../../src/modules/user/user.schema";
import prisma from "../../src/utils/prisma";
import { JwtSchema } from "../../src/common/schema/app.schema";
import { product, user } from "../data/user";

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

  const payload: LoginInput = {
    email: user.email,
    password: user.password,
  };


  test('Login User', async () => {
    const response = await server.inject({ path: '/api/users/login', method: "POST", payload })
    const body = response.json<LoginResponse>()
    const owner = server.jwt.decode<JwtSchema>(body.accessToken)

    // Set Owner Id
    product.ownerId = owner?.id as number

    // Set Accces Token
    accessToken = body.accessToken

    expect(response.statusCode).toBe(200)
  })

  test('Create product', async () => {
    const payload = product
    const response = await server.inject({
      url: '/api/products',
      method: 'POST',
      headers: { "authorization": "Bearer " + accessToken },
      payload
    })

    expect(response.statusCode).toBe(201)
  })
})