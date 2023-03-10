import { prismaService as prisma } from "../../shared/services";
import { CreateUserCollegeDatabase, UpdateUserCollegeRole } from ".";

export const createUserCollege = async (input: CreateUserCollegeDatabase) => {
  return await prisma.userCollege.create({
    data: input
  });
};

export const findUserCollegeById = async (id: string) => {
  return await prisma.userCollege.findUnique({
    where: {
      id: id
    },
    include: {
      userDocument: true,
      user: true,
      course: true
    }
  });
};

export const findUserCollegeByUserId = async (id: string) => {
  return await prisma.userCollege.findUnique({
    where: {
      userId: id
    }, include: {
      userDocument: true,
      user: true,
      course: true
    }
  });
}

export const deleteUserCollegeById = async (id: string) => {
  return await prisma.userCollege.delete({
    where: {
      id: id
    },
  });
};

export const updateUserCollegeRole = async (id: string, newRole: UpdateUserCollegeRole) => {
  return await prisma.userCollege.update({
    where: {
      id: id
    },
    data: {
      role: newRole.role
    },
    include: {
      userDocument: true
    }
  })
}

export const validateStudentNumber = async (id: string) => {
  return await prisma.userCollege.update({
    where: {
      id: id
    },
    data: {
      verifiedStudentNumber: true
    },
  });
}