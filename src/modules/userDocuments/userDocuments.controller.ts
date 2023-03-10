import { FastifyReply, FastifyRequest } from "fastify";
import { findUserCollegeByUserId } from "../userCollege";
import { s3Service } from "../../shared/services";
import { validateDocumentEmitter as emitter } from "../validations";
import {
  createUserDocuments,
  deleteUserDocumentsById,
  getUserDocumentsById,
  updateUserDocuments,
  DeleteUserDocumentSchema
} from ".";

const documentTypeEvent = {
  "IDENTITY_DOCUMENT_FRONT": "validateUserDocumentFront",
  "IDENTITY_DOCUMENT_BACK": "validateUserDocumentBack",
  "COLLEGE_DOCUMENT": "validateCollegeDocument",
  "PHOTO": "validateUserPhoto"
}

export const createUserDocumentsHandler = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const id = req.user.userId;
  const files = req.files();

  const userCollege = await findUserCollegeByUserId(id);

  if (!userCollege) {
    return res.status(404).send({
      success: false,
      code: 404,
      message: "Não foi possível encontrar o estudante.",
      error: null
    });
  }

  const { uploadMultipleFiles } = s3Service();

  try {
    const uploadedFiles = await uploadMultipleFiles(files);

    for await (const file of uploadedFiles) {
      const document = await createUserDocuments({
        userCollegeId: userCollege.id,
        key: file.key,
        type: file.type
      });

      emitter.emit(documentTypeEvent[document.type], document);
    }

    return res.code(201).send({
      success: true,
      code: 201,
      message: "Documentos do usuário criados com sucesso.",
      data: null
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      code: 500,
      message: "Não foi possível criar os documentos do usuário.",
      error: error
    });
  }
}

export const getUserDocumentsHandler = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const id = req.user.userId;

  const student = await findUserCollegeByUserId(id);

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
  const studentId = req.user.userId;
  const documentId = req.body.documentId;

  const student = await findUserCollegeByUserId(studentId);

  if (!student) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Estudante não encontrado.",
      data: null
    });
  }

  const document = await getUserDocumentsById(documentId);

  if (!document) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Documento não encontrado.",
      data: null
    });
  }

  if (document.userCollegeId !== student.id) {
    return res.code(403).send({
      success: false,
      code: 403,
      message: "Você não tem permissão para realizar essa operação",
      data: null
    });
  }

  const documents = await deleteUserDocumentsById(document.id);

  if (!documents) {
    return res.code(500).send({
      success: false,
      code: 500,
      message: "Não foi possível excluir os documentos",
      data: null,
    });
  }

  return res.code(200).send({
    success: false,
    code: 500,
    message: "Documentos removidos com sucesso",
    data: null
  });
}

export const updateUserDocumentsHandler = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const id = req.user.userId;
  const file = await req.file();
  const fileType = file?.fieldname;

  const { uploadFile } = s3Service();

  const student = await findUserCollegeByUserId(id);

  if (!student) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Estudante não encontrado.",
      data: null
    });
  }

  const oldDoc = student.userDocument.find(doc => doc.type == fileType)

  if (!oldDoc) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Documentos não encontrados.",
      data: null
    });
  }

  if (oldDoc.userCollegeId !== student.id) {
    return res.code(400).send({
      success: false,
      code: 400,
      message: "Você não tem permissão para realizar essa operação.",
      data: null
    });
  }

  try {
    const fileUploaded = await uploadFile(file);
    const userDocument = await updateUserDocuments(oldDoc.id, { key: fileUploaded.key, isValid: false }, oldDoc);
    emitter.emit(documentTypeEvent[userDocument.type], userDocument);
    return res.code(200).send({
      success: true,
      code: 200,
      message: "Documento atualizado com sucesso.",
      data: userDocument.id,
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      code: 500,
      message: "Nao foi possível atualizar o documento.",
      error: error
    });
  }
};