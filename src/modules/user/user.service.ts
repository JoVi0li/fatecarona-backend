import { prisma } from "../../shared/utils/prisma";
import { CreateUserDatabase, UpdateUserDatabase, UpdateUserInput } from "./user.schema";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

export const createUser = async (input: CreateUserDatabase) => {
  const { password, ...rest } = input;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { ...rest, salt, password: hash },
    include: {
      userCollege: true
    }
  });

  return user;
}

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email
    },
    include: {
      userCollege: true,
    }
  });
}

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id: id
    }
  });
}

export const deleteUserById = async (id: string) => {
  return await prisma.user.delete({
    where: {
      id: id
    }
  })
}

export const updateUser= async (newUser: UpdateUserDatabase, oldUser: User) => {
  return await prisma.user.update({
    where: {
      id: oldUser.id
    },
    data: {
      name: newUser.name ?? oldUser.name,
      phone: newUser.phone ?? oldUser.phone,
      gender: newUser.gender ?? oldUser.gender,
    }
  });
}