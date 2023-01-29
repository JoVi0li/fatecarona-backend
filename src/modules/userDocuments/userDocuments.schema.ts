import { z } from "zod";

const createUserDocumentsSchema = z.object({
  docPhotoFrontUrl: z.string({ required_error: "Documento obrigatório" }).startsWith("https://", "URL inválida"),
  docPhotoBackUrl: z.string({ required_error: "Documento obrigatório" }).startsWith("https://", "URL inválida"),
  collegeDocUrl: z.string({ required_error: "Documento obrigatório" }).startsWith("https://", "URL inválida"),
});

const updateUserDocumentsSchema = z.object({
  docPhotoFrontUrl: z.string().startsWith("https://", "URL inválida").nullable(),
  docPhotoBackUrl: z.string().startsWith("https://", "URL inválida").nullable(),
  collegeDocUrl: z.string().startsWith("https://", "URL inválida").nullable(),

});

export type CreateUserDocumentsInput = z.infer<typeof createUserDocumentsSchema>;
export type UpdateUserDocumentsInput = z.infer<typeof updateUserDocumentsSchema>;