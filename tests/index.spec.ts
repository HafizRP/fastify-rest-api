import main from "../src/app";
import { FastifyInstance } from "fastify";
import { CreateUserInput, LoginInput } from "../src/modules/user/user.schema";

let server: FastifyInstance

beforeAll(async () => {
    server = await main()
})

afterAll(() => {
    server.close()
})

test('test healtcheck', async () => {
    const response = await server.inject({
        url: '/healthcheck',
        method: "GET"
    })

    expect(response.json()).toEqual({ status: "OK" })
})


describe('Auth Endpoints', () => {
    const user: CreateUserInput = {
        name: "Hafiz",
        email: "Kepoloe123@gmail.com",
        password: "kepoloe123"
    }

    let accessToken: string

    describe("Register Endpoint", () => {

        test('Register a user', async () => {
            const response = await server.inject({
                url: "/api/users/register",
                method: "POST",
                payload: {
                    email: user.email,
                    name: user.name,
                    password: user.password
                } as CreateUserInput
            })

            expect(response.statusCode).toBe(201)
        })


        test("Register with same credentials", async () => {
            const response = await server.inject({
                url: "/api/users/register",
                method: "POST",
                payload: {
                    email: user.email,
                    name: user.name,
                    password: user.password
                } as CreateUserInput
            })

            expect(response.statusCode).toBe(401)
        })
    })


    describe("Login Endpoint", () => {
        test('Login a user', async () => {
            const response = await server.inject({
                url: "/api/users/login",
                method: "POST",
                payload: {
                    email: user.email,
                    password: user.password
                } as LoginInput
            })

            accessToken = response.json().accessToken

            expect(response.statusCode).toBe(200)
        })


        test("Login with invalid credentials", async () => {
            const response = await server.inject({
                url: "/api/users/login",
                method: "POST",
                payload: {
                    email: "apanse@gmail.com",
                    password: user.password
                } as LoginInput
            })

            expect(response.statusCode).toBe(401)
        })
    })

    test("Delete a registered user without auth", async () => {
        const response = await server.inject({
            method: "DELETE",
            url: `/api/users/${user.email}`,
        })

        expect(response.statusCode).toBe(401)
    })

    test("Delete a user", async () => {
        const response = await server.inject({
            method: "DELETE",
            url: `/api/users/${user.email}`,
            headers: {
                authorization: "Bearer " + accessToken
            }
        })

        expect(response.statusCode).toBe(200)
    })

})


