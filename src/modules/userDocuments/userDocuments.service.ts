import { UserDocument } from "@prisma/client";
import { prisma } from "../../shared/utils/prisma";
import { CreateUserDocumentDatabase, UpdateUserDocumentsDatabase, } from "./userDocuments.schema";

export const createUserDocuments = async (input: CreateUserDocumentDatabase) => {
  const userDocuments = await prisma.userDocument.create({
    data: input
  });

  return userDocuments;
}

export const getUserDocumentsById = async (id: string) => {
  return await prisma.userDocument.findUnique({
    where: {
      id: id
    },
    include: {
      userCollege: true
    }
  });
}

export const getUserDocumentByUserCollegeId = async (id: string) => {
  return await prisma.userDocument.findMany({
    where: {
      userCollegeId: id,
    }
  })
}

export const getPhotoByUserCollegeId = async (id: string) => {
  return await prisma.userDocument.findFirst({
    where: {
      type: "PHOTO",
      userCollegeId: id,
    }
  })
}

export const getInvalidUserDocumentByUserCollegeId = async (id: string) => {
  return await prisma.userDocument.findMany({
    where: {
      userCollegeId: id,
      isValid: false
    }
  });
}

export const deleteUserDocumentsById = async (id: string) => {
  return await prisma.userDocument.delete({
    where: {
      id: id
    },
  });
}

export const updateUserDocuments = async(id: string, newDocs: UpdateUserDocumentsDatabase, oldDocs: UserDocument) => {
  return await prisma.userDocument.update({
    where: {
      id: id
    },
    data: {
      key: newDocs.key ?? oldDocs.key,
      isValid: newDocs.isValid ?? oldDocs.isValid,
    },
    include: {
      userCollege: true
    }
  })
}