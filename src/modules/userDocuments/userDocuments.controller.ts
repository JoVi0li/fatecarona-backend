import { FastifyReply, FastifyRequest } from "fastify";
import { findUserCollegeById } from "../userCollege/userCollege.service";
import { DeleteUserDocumentSchema } from "./userDocuments.schema";
import { createUserDocuments, deleteUserDocumentsById, getUserDocumentsById, updateUserDocuments } from "./userDocuments.service";
import { useS3 } from "../../shared/services";
import { validateDocumentEmitter as emitter } from "../validations";

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
  const id = req.user.studentId;
  const files = req.files();

  const userCollege = findUserCollegeById(id);

  if (!userCollege) {
    return res.send({
      success: false,
      message: "Estudante inválidos",
      error: null,
    });
  }

  const { uploadMultipleFiles } = useS3();

  try {
    const uploadedFiles = await uploadMultipleFiles(files);

    const result: string[] = [];

    for await (const file of uploadedFiles) {
      const document = await createUserDocuments({
        userCollegeId: id,
        url: file.file.Location,
        key: file.file.Key,
        type: file.type,
      });
      result.push(document.id);
      emitter.emit(documentTypeEvent[document.type], document);
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
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const id = req.user.studentId;
  const file = await req.file();
  const fileType = file?.fieldname;

  const { uploadFile } = useS3();

  const student = await findUserCollegeById(id);

  if (!student) {
    return res.code(404).send({
      success: false,
      message: "Estudante não encontrado",
      data: null
    });
  }

  const oldDoc = student.userDocument.find(doc => doc.type == fileType)

  if (!oldDoc) {
    return res.code(404).send({
      success: false,
      message: "Documentos não encontrados",
      data: null
    });
  }

  if (oldDoc.userCollegeId !== student.id) {
    return res.code(400).send({
      success: false,
      message: "Você não tem permissão para realizar essa operação",
      data: null
    });
  }

  try {
    const fileUploaded = await uploadFile(file);
    const userDocument = await updateUserDocuments(
      oldDoc.id,
      {
        url: fileUploaded.file.Location,
        key: fileUploaded.file.Key,
        isValid: null
      },
      oldDoc
    );
    emitter.emit(documentTypeEvent[userDocument.type], userDocument);
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