import { Course } from "@prisma/client";
import { prisma } from "../../shared/utils/prisma";
import { CreateCourseInput, UpdateCourseInput } from "./course.schema";

export const createCourse = async (input: CreateCourseInput) => {
  const course = await prisma.course.create({
    data: input
  });

  return course;
}

export const getCourse = async (id: string) => {
  return await prisma.course.findUnique({
    where: {
      id: id,
    }
  });
}

export const getAllCourses = async () => {
  return await prisma.course.findMany();
}

export const deleteCourse = async (id: string) => {
  return await prisma.course.delete({
    where: {
      id: id,
    }
  });
}

export const updateCourse = async (id: string, newData: UpdateCourseInput, oldData: Course) => {
  return await prisma.course.update({
    where: {
      id: id
    },
    data: {
      name: newData.name ?? oldData.name,
      time: newData.time ?? oldData.time
    }
  });
}