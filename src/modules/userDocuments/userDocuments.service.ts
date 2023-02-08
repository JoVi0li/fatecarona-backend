import { UserDocuments } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { CreateUserDocumentsDatabase, UpdateUserDocumentsDatabase, } from "./userDocuments.schema";

export const createUserDocuments = async (input: CreateUserDocumentsDatabase) => {
  const userDocuments = await prisma.userDocuments.create({
    data: {
      docPhotoBackUrl: input.docPhotoBackUrl,
      docPhotoFrontUrl: input.docPhotoFrontUrl,
      collegeDocUrl: input.collegeDocUrl,
      docPhotoBackKey: input.docPhotoBackKey,
      docPhotoFrontKey: input.docPhotoFrontKey,
      collegeDocKey: input.collegeDocKey
    }
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

export const updateUserDocuments = async(id: string, newDocs: UpdateUserDocumentsDatabase, oldDocs: UserDocuments) => {
  return await prisma.userDocuments.update({
    where: {
      id: id
    },
    data: {
      docPhotoBackUrl: newDocs.docPhotoBackUrl?? oldDocs.docPhotoBackUrl,
      docPhotoFrontUrl: newDocs.docPhotoFrontUrl ?? oldDocs.docPhotoFrontUrl,
      collegeDocUrl: newDocs.collegeDocUrl ?? oldDocs.collegeDocUrl
    },
    include: {
      userCollege: true
    }
  })
}