import { FastifyReply, FastifyRequest } from "fastify";
import { findUserCollegeById } from "../userCollege/userCollege.service";
import { CreateUserDocumentsInput, UpdateUserDocumentsInput } from "./userDocuments.schema";
import { createUserDocuments, deleteUserDocumentsById, getUserDocumentsById, updateUserDocuments } from "./userDocuments.service";
import { useUpload } from "../../shared/services";
import { base64Converter } from "../../utils";
import { randomUUID } from "crypto";

export const createUserDocumentsHandler = async (
  req: FastifyRequest<{ Body: CreateUserDocumentsInput }>,
  res: FastifyReply,
) => {
  const body = req.body;

  const { uploadFile } = useUpload();
  const { fromBase64 } = base64Converter();
  const { docPhotoBack, docPhotoFront, collegeDoc } = body;

  try {
    const docPhotoBackFile = fromBase64(docPhotoBack, "file");
    const docPhotoFrontFile = fromBase64(docPhotoFront, "file");
    const collegeDocFile = fromBase64(collegeDoc, "file");

    const { Location: docPhotoBackUrl, Key: docPhotoBackKey } = await uploadFile(randomUUID(), "documents", docPhotoBackFile);
    const { Location: docPhotoFrontUrl, Key: docPhotoFrontKey } = await uploadFile(randomUUID(), "documents", docPhotoFrontFile);
    const { Location: collegeDocUrl, Key: collegeDocKey } = await uploadFile(randomUUID(), "documents", collegeDocFile);

    const userDocuments = await createUserDocuments({
      docPhotoBackUrl: docPhotoBackUrl,
      docPhotoFrontUrl: docPhotoFrontUrl,
      collegeDocUrl: collegeDocUrl,
      docPhotoBackKey: docPhotoBackKey,
      docPhotoFrontKey: docPhotoFrontKey,
      collegeDocKey: collegeDocKey
    });

    return res.code(201).send({
      success: true,
      message: "Documentos do usuário criados com sucesso",
      data: userDocuments.id,
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

  const documents = await getUserDocumentsById(student.userDocumentsId);

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

  const documents = await deleteUserDocumentsById(student.userDocumentsId);

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

  const student = await findUserCollegeById(id);

  if (!student) {
    return res.code(404).send({
      success: false,
      message: "Estudante não encontrado",
      data: null
    });
  }

  const oldDocs = await getUserDocumentsById(student.userDocumentsId);

  if (!oldDocs) {
    return res.code(404).send({
      success: false,
      message: "Documentos não encontrados",
      data: null
    });
  }

  const body = req.body;

  const { uploadFile } = useUpload();
  const { fromBase64 } = base64Converter();
  const { docPhotoBack, docPhotoFront, collegeDoc } = body;

  try {
    const docPhotoBackFile = fromBase64(docPhotoBack ?? "", "file");
    const docPhotoFrontFile = fromBase64(docPhotoFront ?? "", "file");
    const collegeDocFile = fromBase64(collegeDoc ?? "", "file");

    const { Location: docPhotoBackUrl } = await uploadFile(oldDocs.docPhotoBackKey, "documents", docPhotoBackFile);
    const { Location: docPhotoFrontUrl } = await uploadFile(oldDocs.docPhotoFrontKey, "documents", docPhotoFrontFile);
    const { Location: collegeDocUrl } = await uploadFile(oldDocs.collegeDocKey, "documents", collegeDocFile);

    const documentsUpdated = await updateUserDocuments(
      id,
      {
        docPhotoBackUrl: docPhotoBackUrl,
        docPhotoFrontUrl: docPhotoFrontUrl,
        collegeDocUrl: collegeDocUrl,
      },
      oldDocs
    );

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