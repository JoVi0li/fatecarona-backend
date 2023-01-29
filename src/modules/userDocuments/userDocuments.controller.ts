import { FastifyReply, FastifyRequest } from "fastify";
import { findUserCollegeById } from "../userCollege/userCollege.service";
import { CreateUserDocumentsInput, UpdateUserDocumentsInput } from "./userDocuments.schema";
import { createUserDocuments, deleteUserDocumentsById, getUserDocumentsById, updateUserDocuments } from "./userDocuments.service";

export const createUserDocumentsHandler = async (
  req: FastifyRequest<{ Body: CreateUserDocumentsInput }>,
  res: FastifyReply,
) => {
  const body = req.body;

  try {
    const userDocuments = await createUserDocuments(body);
    return res.code(201).send({
      success: true,
      message: "Documentos do usuário criados com sucesso",
      data: userDocuments.id,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Não foi possível criar o estudante",
      error: error,
    });
  }
}

export const getUserDocumentsHandler = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const id = req.user.studentId;

  const student = await findUserCollegeById(id);

  if(!student) {
    return res.code(404).send({
      success: false,
      message: "Estudante não encontrado",
      data: null
    });
  }

  const documents = await getUserDocumentsById(student.userDocumentsId);

  if(!documents) {
    return res.code(404).send({
      success: false,
      message: "Documentos não encontrados",
      data: null
    });
  }

  return res.code(200).send({
    success: true,
    message: "Documentos encontrados",
    data: documents
  });
};

export const deleteUserDocumentsHandler = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const id = req.user.studentId;

  const student = await findUserCollegeById(id);

  if(!student) {
    return res.code(404).send({
      success: false,
      message: "Estudante não encontrado",
      data: null
    });
  }

  const documents = await deleteUserDocumentsById(student.userDocumentsId);

  if(!documents) {
    return res.code(500).send({
      success: false,
      message: "Não foi possível excluir os documentos",
      data: null,
    });
  }

  return res.code(200).send({
    success: false,
    message: "Documentos removidos com sucesso",
    data: null
  });
}

export const updateUserDocumentsHandler = async (
  req: FastifyRequest<{ Body: UpdateUserDocumentsInput }>,
  res: FastifyReply,
) => {
  const newDocs = req.body;
  const id = req.user.studentId;

  const student = await findUserCollegeById(id);

  if(!student) {
    return res.code(404).send({
      success: false,
      message: "Estudante não encontrado",
      data: null
    });
  }

  const oldDocs = await getUserDocumentsById(student.userDocumentsId);

  if(!oldDocs) {
    return res.code(404).send({
      success: false,
      message: "Documentos não encontrados",
      data: null
    });
  }

  try {
    const documentsUpdated = await updateUserDocuments(id, newDocs, oldDocs);

    return res.code(200).send({
      success: true,
      message: "Documentos atualizados com sucesso",
      data: documentsUpdated,
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      message: "Nao foi possível atualizar os documentos",
      error: error,
    });
  }
};