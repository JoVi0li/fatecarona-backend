import { z } from "zod";

const createUserDocumentSchema = z.object({
  userCollegeId: z.string({ required_error: "O identificador do estudante é obrigatório" }),
});

const createUserDocumentDatabase = z.object({
  userCollegeId: z.string({ required_error: "O identificador do estudante é obrigatório" }),
  url: z.string({ required_error: "Url documento obrigatório" }),
  key: z.string({ required_error: "Chave documento obrigatório" }),
});

const updateUserDocumentSchema = z.object({
  userDocumentId: z.string({ required_error: "O identificador do estudante é obrigatório" }),
});

const updateUserDocumentDatabase = z.object({
  url: z.string().nullable(),
  key: z.string().nullable(),
  isValid: z.boolean().nullable()
});

const deleteUserDocumentSchema = z.object({
  documentId: z.string({ required_error: "O identificador do documento é obrigatório" })
});

export type CreateUserDocumentInput = z.infer<typeof createUserDocumentSchema>;
export type CreateUserDocumentDatabase = z.infer<typeof createUserDocumentDatabase>;
export type UpdateUserDocumentsInput = z.infer<typeof updateUserDocumentSchema>;
export type UpdateUserDocumentsDatabase = z.infer<typeof updateUserDocumentDatabase>;
export type DeleteUserDocumentSchema = z.infer<typeof deleteUserDocumentSchema>;