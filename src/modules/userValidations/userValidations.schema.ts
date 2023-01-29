import { z } from "zod";

const createUserValidationsSchema = z.object({
  isDocPhotoFrontValid: z.boolean({ required_error: "Validação obrigatória" }),
  isDocPhotoBackValid: z.boolean({ required_error: "Validação obrigatória" }),
  isCollegeDocValid: z.boolean({ required_error: "Validação obrigatória" }),
  isEmailVerified: z.boolean({ required_error: "Validação obrigatória" }),
});

const updateUserValidationsSchema = z.object({
  isDocPhotoFrontValid: z.boolean().nullable(),
  isDocPhotoBackValid: z.boolean().nullable(),
  isCollegeDocValid: z.boolean().nullable(),
  isEmailVerified: z.boolean().nullable(),
});

export type CreateUserValidationsSchema = z.infer<typeof createUserValidationsSchema>;
export type UpdateUserValidationsSchema = z.infer<typeof updateUserValidationsSchema>;