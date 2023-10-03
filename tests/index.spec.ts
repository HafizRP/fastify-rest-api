import main from "../src/server";
import { FastifyInstance } from "fastify";

let server: FastifyInstance;

beforeAll(async () => {
  server = await main();
});

afterAll(() => {
  server.close();
});

test("test healtcheck", async () => {
  const response = await server.inject({
    url: "/healthcheck",
    method: "GET",
  });

  expect(response.json()).toEqual({ status: "OK" });
});
