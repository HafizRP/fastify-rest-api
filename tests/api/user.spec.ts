import { FastifyInstance } from "fastify";
import main from "../../src/server";
import { CreateUserInput, LoginInput, LoginResponse } from "../../src/modules/user/user.schema";
import { User } from "@prisma/client";
import { user } from "../data/user";

let server: FastifyInstance;

beforeAll(async () => {
  server = await main();
});

afterAll(async () => {
  await server.close();
});

describe("Auth Endpoints", () => {
  let user_id: number = 0
  let accessToken: string;

  describe("Register Endpoint", () => {
    test("Register a user", async () => {
      const payload: CreateUserInput = {
        email: user.email,
        name: user.name,
        password: user.password,
      }

      const response = await server.inject({
        url: "/api/users/register",
        method: "POST",
        payload
      });

      const responseBody = response.json<User>()

      user_id = responseBody.id

      expect(response.statusCode).toBe(201);
    });

    test("Register with same credentials", async () => {
      const payload: CreateUserInput = {
        email: user.email,
        name: user.name,
        password: user.password,
      }

      const response = await server.inject({
        url: "/api/users/register",
        method: "POST",
        payload
      });


      expect(response.statusCode).toBe(401);
    });
  });

  describe("Login Endpoint", () => {
    test("Login a user", async () => {
      const payload: LoginInput = {
        email: user.email,
        password: user.password,
      }
      const response = await server.inject({
        url: "/api/users/login",
        method: "POST",
        payload
      });

      const responseBody = response.json<LoginResponse>()

      accessToken = responseBody.accessToken

      expect(response.statusCode).toBe(200);
    });

    test("Login with invalid credentials", async () => {
      const payload: LoginInput = {
        email: "apanse@gmail.com",
        password: user.password,
      }
      const response = await server.inject({
        url: "/api/users/login",
        method: "POST",
        payload
      });

      expect(response.statusCode).toBe(401);
    });
  });
});