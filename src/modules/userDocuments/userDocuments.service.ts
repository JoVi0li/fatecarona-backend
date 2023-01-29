import { UserDocuments } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { CreateUserDocumentsInput, UpdateUserDocumentsInput } from "./userDocuments.schema";

export const createUserDocuments = async (input: CreateUserDocumentsInput) => {
  const userDocuments = await prisma.userDocuments.create({
    data: input
  });

  return userDocuments;
}

export const getUserDocumentsById = async (id: string) => {
  return await prisma.userDocuments.findUnique({
    where: {
      id: id
    },
    include: {
      userCollege: true
    }
  });
}

export const deleteUserDocumentsById = async (id: string) => {
  return await prisma.userDocuments.delete({
    where: {
      id: id
    },
  });
}

export const updateUserDocuments = async(id: string, newDocs: UpdateUserDocumentsInput, oldDocs: UserDocuments) => {
  return await prisma.userDocuments.update({
    where: {
      id: id
    },
    data: {
      docPhotoBackUrl: newDocs.docPhotoBackUrl ?? oldDocs.docPhotoBackUrl,
      docPhotoFrontUrl: newDocs.docPhotoFrontUrl ?? oldDocs.docPhotoFrontUrl,
      collegeDocUrl: newDocs.collegeDocUrl ?? oldDocs.collegeDocUrl
    },
    include: {
      userCollege: true
    }
  })
}