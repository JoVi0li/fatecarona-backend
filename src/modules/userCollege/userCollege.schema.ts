import { z } from "zod";

const createUserCollegeSchema = z.object({
  role: z.enum(["NORMAL", "ADMIN"], { required_error: "A permissão do usuário é obrigatória" }),
  userId: z.string({required_error: "O identificador do usuário é obrigatório"}),
  userDocumentsId: z.string({ required_error: "O identificador dos documentos do usuário é obrigatório" }),
  userValidationsId: z.string({required_error:"O identificador das validações do usuário é obrigatório"}),
  collegeId: z.string({required_error:"O identificador da faculdade do usuário é obrigatório"})
});

const updateUserCollegeRole = z.object({
  role: z.enum(["NORMAL", "ADMIN"], { required_error: "A permissão do usuário é obrigatória" }),
})

export type CreateUserCollegeInput = z.infer<typeof createUserCollegeSchema>;
export type UpdateUserCollegeRole = z.infer<typeof updateUserCollegeRole>;