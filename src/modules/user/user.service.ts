import { prisma } from "../../utils/prisma";
import { CreateUserInput, UpdateUserInput } from "./user.schema";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

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
      email: email
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

export const updateUser= async (newUser: UpdateUserInput, oldUser: User) => {
  return await prisma.user.update({
    where: {
      id: oldUser.id
    },
    data: {
      name: newUser.name ?? oldUser.name,
      photo: newUser.photo ?? oldUser.photo,
      phone: newUser.phone ?? oldUser.phone,
      gender: newUser.gender ?? oldUser.gender,
    }
  });
}