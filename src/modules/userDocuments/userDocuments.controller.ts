import { FastifyReply, FastifyRequest } from "fastify";
import { findUserCollegeById } from "../userCollege/userCollege.service";
import { CreateUserDocumentInput, DeleteUserDocumentSchema, UpdateUserDocumentsInput } from "./userDocuments.schema";
import { createUserDocuments, deleteUserDocumentsById, getUserDocumentsById, updateUserDocuments } from "./userDocuments.service";
import { useUpload } from "../../shared/services";
import { getUserCollegeHandler } from "../userCollege/userCollege.controller";

export const createUserDocumentsHandler = async (
  req: FastifyRequest<{ Body: CreateUserDocumentInput }>,
  res: FastifyReply,
) => {
  const body = req.body;
  const id = body.userCollegeId
  const files = req.files();

  const userCollege = findUserCollegeById(id);

  if (!userCollege) {
    return res.send({
      success: false,
      message: "Estudante inválidos",
      error: null,
    });
  }

  const { uploadMultipleFiles } = useUpload();

  try {
    const uploadedFiles = await uploadMultipleFiles(files, "documents");

    const result: string[] = [];

    for await (const file of uploadedFiles) {
      const document = await createUserDocuments({
        userCollegeId: id,
        url: file.file.Location,
        key: file.file.Key,
      })
      result.push(document.id);
    }

    return res.code(201).send({
      success: true,
      message: "Documentos do usuário criados com sucesso",
      data: result
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Não foi possível criar os documentos do usuário",
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

  if (!student) {
    return res.code(404).send({
      success: false,
      message: "Estudante não encontrado",
      data: null
    });
  }

  const documents = await getUserDocumentsById(student.id);

  if (!documents) {
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
  req: FastifyRequest<{ Body: DeleteUserDocumentSchema }>,
  res: FastifyReply,
) => {
  const studentId = req.user.studentId;
  const documentId = req.body.documentId;

  const student = await findUserCollegeById(studentId);

  if (!student) {
    return res.code(404).send({
      success: false,
      message: "Estudante não encontrado",
      data: null
    });
  }

  const document = await getUserDocumentsById(documentId);

  if (!document) {
    return res.code(404).send({
      success: false,
      message: "Documento não encontrado",
      data: null
    });
  }

  if (document.userCollegeId !== student.id) {
    return res.code(400).send({
      success: false,
      message: "Você não tem permissão para realizar essa operação",
      data: null
    });
  }

  const documents = await deleteUserDocumentsById(document.id);

  if (!documents) {
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
  const id = req.user.studentId;
  const userDocumentId = req.body.userDocumentId;
  const file = await req.file();

  const { uploadFile } = useUpload();

  const student = await findUserCollegeById(id);

  if (!student) {
    return res.code(404).send({
      success: false,
      message: "Estudante não encontrado",
      data: null
    });
  }

  const oldDocs = await getUserDocumentsById(userDocumentId);

  if (!oldDocs) {
    return res.code(404).send({
      success: false,
      message: "Documentos não encontrados",
      data: null
    });
  }

  if (oldDocs.userCollegeId !== student.id) {
    return res.code(400).send({
      success: false,
      message: "Você não tem permissão para realizar essa operação",
      data: null
    });
  }

  try {
    const fileUploaded = await uploadFile(file, "documents");
    const userDocument = await updateUserDocuments(
      oldDocs.id,
      {
        url: fileUploaded.file.Location,
        key: fileUploaded.file.Key,
        isValid: null
      },
      oldDocs
    );
    return res.code(200).send({
      success: true,
      message: "Documento atualizado com sucesso",
      data: userDocument.id,
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      message: "Nao foi possível atualizar o documento",
      error: error,
    });
  }
};