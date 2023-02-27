import { z } from "zod";

const createUserCollegeSchema = z.object({
  role: z.enum(["NORMAL", "ADMIN"], { required_error: "A permissão do usuário é obrigatória" }),
  userId: z.string({required_error: "O identificador do usuário é obrigatório"}),
  userDocumentsId: z.string({ required_error: "O identificador dos documentos do usuário é obrigatório" }),
  courseId: z.string({required_error:"O identificador da faculdade do usuário é obrigatório"}),
  studentNumber: z.string({required_error: "O RA é obrigatório"})
});

const updateUserCollegeRole = z.object({
  role: z.enum(["NORMAL", "ADMIN"], { required_error: "A permissão do usuário é obrigatória" }),
})

export type CreateUserCollegeInput = z.infer<typeof createUserCollegeSchema>;
export type UpdateUserCollegeRole = z.infer<typeof updateUserCollegeRole>;