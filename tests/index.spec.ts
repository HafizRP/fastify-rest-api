import main from "../src/app";
import { FastifyInstance } from "fastify";
import { CreateUserInput, LoginInput } from "../src/modules/user/user.schema";
import { User } from "@prisma/client";
import { hashPassword } from "../src/utils/crypto";

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

    test('Register Endpoints', async () => {
        const { hash, salt } = hashPassword(user.password)


        const response = await server.inject({
            url: "/api/users/register",
            method: "POST",
            payload: {
                name: user.name,
                email: user.email,
                password: hash,
                salt
            } as User
        })

        expect(response.statusCode).toBe(201)
    })


    test('Login Endpoint', async () => {
        const response = await server.inject({
            url: "/api/users/login",
            method: "POST",
            payload: {
                email: user.email,
                password: user.password
            } as LoginInput
        })

        console.log(response.json())

        expect(response.statusCode).toBe(201)
    })

})


