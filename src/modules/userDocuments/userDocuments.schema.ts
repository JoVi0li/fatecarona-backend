import { z } from "zod";

const createUserDocumentDatabase = z.object({
  userCollegeId: z.string({ required_error: "O identificador do estudante é obrigatório" }),
  url: z.string({ required_error: "Url documento obrigatório" }),
  key: z.string({ required_error: "Chave documento obrigatório" }),
  type: z.enum(["IDENTITY_DOCUMENT_FRONT", "IDENTITY_DOCUMENT_BACK", "COLLEGE_DOCUMENT", "PHOTO"], {required_error: "O tipo do(s) documento(s) obrigatório"})
});

const updateUserDocumentDatabase = z.object({
  url: z.string().nullable(),
  key: z.string().nullable(),
  isValid: z.boolean().nullable()
});

const deleteUserDocumentSchema = z.object({
  documentId: z.string({ required_error: "O identificador do documento é obrigatório" })
});

export type CreateUserDocumentDatabase = z.infer<typeof createUserDocumentDatabase>;
export type UpdateUserDocumentsDatabase = z.infer<typeof updateUserDocumentDatabase>;
export type DeleteUserDocumentSchema = z.infer<typeof deleteUserDocumentSchema>;