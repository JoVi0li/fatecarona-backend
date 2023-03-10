import { prismaService as prisma } from "../../shared/services";
import { CreateCollegeInput, UpdateCollegeNameInput } from ".";

export const createCollege = async (input: CreateCollegeInput) => {
  return await prisma.college.create({
    data: input
  });
}

export const getCollege = async (id: string) => {
  return await prisma.college.findUnique({
    where: {
      id: id
    }
  });
}

export const getAllColleges = async () => {
  return await prisma.college.findMany();
}

export const deleteCollege = async(id: string) => {
  return await prisma.college.delete({
    where: {
      id: id,
    }
  });
}

export const updateCollegeName = async (id: string, newName: UpdateCollegeNameInput) => {
  return await prisma.college.update({
    where: {
      id: id
    },
    data: newName.name
  });
}
