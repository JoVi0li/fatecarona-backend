import { prisma } from "../../utils/prisma";
import { CreateUserCollegeInput, UpdateUserCollegeRole } from "./userCollege.schema";

export const createUserCollege = async (input: CreateUserCollegeInput) => {
  const userCollege = await prisma.userCollege.create({
    data: input
  });

  return userCollege;
};

export const findUserCollegeById = async(id: string) => {
  return await prisma.userCollege.findUnique({
    where: {
      id: id
    },
    include: {
      documents: true,
      validations: true,
    }
  })
};

export const findEventsWhereIAmParticipant = async (id: string) => {
  return await prisma.userCollege.findMany({
    where: {
      id: id
    },
    select: {
      participantEvents: true
    },
  })
}

export const deleteUserCollegeById = async(id: string) => {
  return await prisma.userCollege.delete({
    where: {
      id: id
    },
  });
};

export const updateUserCollegeRole = async(id: string, newRole: UpdateUserCollegeRole) => {
  return await prisma.userCollege.update({
    where: {
      id: id
    },
    data: {
      role: newRole.role
    },
    include: {
      documents: true,
      validations: true
    }
  })
}