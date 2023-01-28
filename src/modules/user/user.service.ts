import { prisma } from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";
import bcrypt from "bcrypt";

export const createUser = async (input: CreateUserInput) => {
  const { password, ...rest } = input;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { ...rest, salt, password: hash }
  });

  return user;
}

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    }
  })
}