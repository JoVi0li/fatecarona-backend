import { z } from "zod";

const createUserCollegeSchema = z.object({
  courseId: z.string({required_error:"O identificador da faculdade do usuário é obrigatório"}),
  studentNumber: z.string({required_error: "O RA é obrigatório"}),
  conclusion: z.string({ required_error: "A data de conclusão do curso é obrigatória" }).datetime()
});

const createUserCollegeDatabase = z.object({
  courseId: z.string({required_error:"O identificador da faculdade do usuário é obrigatório"}),
  studentNumber: z.string({required_error: "O RA é obrigatório"}),
  userId: z.string({ required_error: "O identificador do usuário é obrigatório" }),
  conclusion: z.string({ required_error: "A data de conclusão do curso é obrigatória" }).datetime(),
});

const updateUserCollegeRole = z.object({
  role: z.enum(["NORMAL", "ADMIN"], { required_error: "A permissão do usuário é obrigatória" }),
})

export type CreateUserCollegeInput = z.infer<typeof createUserCollegeSchema>;
export type UpdateUserCollegeRole = z.infer<typeof updateUserCollegeRole>;
export type CreateUserCollegeDatabase = z.infer<typeof createUserCollegeDatabase>;