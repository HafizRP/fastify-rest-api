import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail, findUsers, getProductsByOwnerId } from "./user.service";
import { CreateUserInput, DeleteUserDTO, LoginInput, GetProductsByOwnerId } from "./user.schema";
import { verifyPassword } from "../../utils/crypto";
import prisma from "../../utils/prisma";
import { NotFoundError, UnauthorizedError } from "../../common/error/error.model";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";

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


