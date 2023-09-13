import { FastifyInstance } from "fastify";
import main from "../../src/server";
import { CreateUserInput, LoginInput, LoginResponse } from "../../src/modules/user/user.schema";
import { User } from "@prisma/client";

let server: FastifyInstance;

beforeAll(async () => {
  server = await main();
});

afterAll(async () => {
  await server.close();
});

describe("Auth Endpoints", () => {
  const user: CreateUserInput = {
    name: "Hafiz",
    email: "Kepoloe123@gmail.com",
    password: "kepoloe123",
  };

  let user_id: number = 0
  let accessToken: string;

  describe("Register Endpoint", () => {
    test("Register a user", async () => {
      const response = await server.inject({
        url: "/api/users/register",
        method: "POST",
        payload: {
          email: user.email,
          name: user.name,
          password: user.password,
        } as CreateUserInput,
      });

      const responseBody: User = response.json()

      user_id = responseBody.id

      expect(response.statusCode).toBe(201);
    });

    test("Register with same credentials", async () => {
      const response = await server.inject({
        url: "/api/users/register",
        method: "POST",
        payload: {
          email: user.email,
          name: user.name,
          password: user.password,
        } as CreateUserInput,
      });


      expect(response.statusCode).toBe(401);
    });
  });

  describe("Login Endpoint", () => {
    test("Login a user", async () => {
      const response = await server.inject({
        url: "/api/users/login",
        method: "POST",
        payload: {
          email: user.email,
          password: user.password,
        } as LoginInput,
      });

      const responseBody: LoginResponse = response.json()

      accessToken = responseBody.accessToken

      expect(response.statusCode).toBe(200);
    });

    test("Login with invalid credentials", async () => {
      const response = await server.inject({
        url: "/api/users/login",
        method: "POST",
        payload: {
          email: "apanse@gmail.com",
          password: user.password,
        } as LoginInput,
      });

      expect(response.statusCode).toBe(401);
    });
  });
});