import { UserValidations } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { CreateUserValidationsSchema, UpdateUserValidationsSchema } from "./userValidations.schema";

export const createUserValidations = async (input: CreateUserValidationsSchema) => {
  return await prisma.userValidations.create({
    data: input
  });
}

export const getUserValidations = async (id: string) => {
  return await prisma.userValidations.findUnique({
    where: {
      id: id
    },
    include: {
      userCollege: true
    }
  });
}

export const deleteUserValidations = async (id: string) => {
  return await prisma.userValidations.delete({
    where: {
      id: id
    }
  });
}

export const updateUserValidations = async(id: string, newVal: UpdateUserValidationsSchema, oldVal: UserValidations) => {
  return await prisma.userValidations.update({
    where: {
      id: id
    },
    data: {
      isCollegeDocValid: newVal.isCollegeDocValid ?? oldVal.isCollegeDocValid,
      isDocPhotoBackValid: newVal.isDocPhotoBackValid ?? oldVal.isDocPhotoBackValid,
      isDocPhotoFrontValid: newVal.isDocPhotoFrontValid ?? oldVal.isDocPhotoFrontValid,
      isEmailVerified: newVal.isEmailVerified ?? oldVal.isEmailVerified
    }
  });
}