import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail, findUsers, getProductsByOwnerId } from "./user.service";
import { CreateUserInput, DeleteUserDTO, LoginInput, GetProductsByOwnerId, VerifyAccountRequest, VerifyAccountToken } from "./user.schema";
import { verifyPassword } from "../../utils/crypto";
import prisma from "../../utils/prisma";
import { NotFoundError, RequestError, UnauthorizedError } from "../../common/error/error.model";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import transporter from "../../utils/mailer";
import { Env } from "../../common/schema/app.schema";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const users = await findUserByEmail(body.email)

    if (users) throw new UnauthorizedError("CREDENTIAL_USED")

    const user = await createUser(body);

    const verifyToken = request.server.jwt.sign({ user_id: user.id }, {
      algorithm: "RS256",
      expiresIn: "5m"
    })

    // const verifyToken = await reply.jwtSign({ user_id: user.id }, { sign: { algorithm: "RS256" } })

    const verifyUrl = new URL("http://localhost:3000/api/users/verify")

    verifyUrl.searchParams.append("token", verifyToken)

    await transporter.sendMail({
      from: Env.MAIL_USER,
      to: user.email,
      subject: "Account Verification",
      // html: `
      //   <form method="post" action="${verifyUrl}">
      //     <button type="submit">Verify</button>
      //   </form>
      //   <p> Or use this token: \n
      //       ${verifyToken} 
      //   </p>
      // `,
      html: `
        <p>Please verify your account with this link ${verifyUrl}</p> <br />
        <p>Or use this token : ${verifyToken}</p>
      `
    })

    return reply.code(201).send(user);
  } catch (error) {
    return reply.code(500).send(error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  const user = await findUserByEmail(body.email);

  if (!user) throw new UnauthorizedError("Invalid email or password");

  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    hash: user.password,
    salt: user.salt,
  });

  if (!correctPassword) throw new UnauthorizedError("Invalid email or password")

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email
  }

  const accessToken = request.server.jwt.sign(payload)

  return { accessToken };
}

export async function getUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const users = await findUsers();
  return users;
}


export async function deleteUserHandler(request: FastifyRequest<{
  Params: DeleteUserDTO
}>, reply: FastifyReply) {
  try {
    const { userId } = request.params
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) throw new UnauthorizedError("USER_NOT_EXIST")

    await prisma.user.delete({ where: { id: userId } })

    return reply.code(200).send({ message: "USER_DELETED" })

  } catch (error) {
    throw error
  }
}


export async function getProductsByOwnerIdHandler(request: FastifyRequest<{ Params: GetProductsByOwnerId }>, reply: FastifyReply) {
  try {
    const products = await getProductsByOwnerId(request.params.userId)

    return products
  } catch (error) {
    // Handle validation error from prisma
    if (error instanceof PrismaClientKnownRequestError) {
      // Not Found Error
      if (error.code == "P2025") throw new NotFoundError(error.message)
    }

    throw error

  }
}

export async function verifyAccount(request: FastifyRequest<{ Querystring: VerifyAccountRequest }>) {
  const { token } = request.query

  try {
    const Itoken = request.server.jwt.verify<VerifyAccountToken>(token, { algorithms: ["RS256"] })

    const user = await prisma.user.findUnique({ where: { id: Itoken.user_id } })

    return true

  } catch (error) {
    throw error
  }
}


