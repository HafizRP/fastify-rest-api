import { hashPassword } from "../../utils/crypto";
import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;

  const { hash, salt } = hashPassword(password);
  const user = await prisma.user.create({
    data: { ...rest, password: hash, salt, roleId: 1 },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUsers() {
  return prisma.user.findMany({
    select: { email: true, name: true, id: true },
  });
}

export async function getProductsByOwnerId(userId: number) {
  return prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { Product: true, email: true, name: true } })
}
