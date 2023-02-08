import { z } from "zod";

const createUserDocumentsSchema = z.object({
  docPhotoFront: z.string({ required_error: "Documento obrigatório" }),
  docPhotoBack: z.string({ required_error: "Documento obrigatório" }),
  collegeDoc: z.string({ required_error: "Documento obrigatório" }),
});

const createUserDocumentsDatabase = z.object({
  docPhotoFrontUrl: z.string({ required_error: "Documento obrigatório" }),
  docPhotoBackUrl: z.string({ required_error: "Documento obrigatório" }),
  collegeDocUrl: z.string({ required_error: "Documento obrigatório" }),
  docPhotoFrontKey: z.string({ required_error: "Chave obrigatória" }),
  docPhotoBackKey: z.string({ required_error: "Chave obrigatória" }),
  collegeDocKey: z.string({ required_error: "Chave obrigatória" }),
});

const updateUserDocumentsSchema = z.object({
  docPhotoFront: z.string().nullable(),
  docPhotoBack: z.string().nullable(),
  collegeDoc: z.string().nullable(),
});

const updateUserDocumentsDatabase = z.object({
  docPhotoFrontUrl: z.string().nullable(),
  docPhotoBackUrl: z.string().nullable(),
  collegeDocUrl: z.string().nullable(),
});


export type CreateUserDocumentsInput = z.infer<typeof createUserDocumentsSchema>;
export type CreateUserDocumentsDatabase = z.infer<typeof createUserDocumentsDatabase>;
export type UpdateUserDocumentsInput = z.infer<typeof updateUserDocumentsSchema>;
export type UpdateUserDocumentsDatabase = z.infer<typeof updateUserDocumentsDatabase>;