import { z } from "zod";

const createUserSchema = z.object({
  email: z.string({required_error:"O e-mail é obrigatório"}).email().endsWith("fatec.sp.gov.br", "E-mail inválido"),
  password: z.string({required_error:"A senha é obrigatória"}).min(8, "A senha precisa conter no mínimo 8 caracteres"),
  name: z.string({required_error:"O nome é obrigatório"}).min(3, "Nome inválido"),
  phone: z.string({required_error:"O número de celular é obrigatório"}),
  identityDocument: z.string({required_error:"O CPF é obrigatório"}).min(11, "CPF inválido"),
  gender: z.enum(["MALE", "FEMALE"], {required_error: "O sexo é obrigatório"})
});

const createUserDatabase = z.object({
  email: z.string({required_error:"O e-mail é obrigatório"}).email().endsWith("fatec.sp.gov.br", "E-mail inválido"),
  password: z.string({required_error:"A senha é obrigatória"}).min(8, "A senha precisa conter no mínimo 8 caracteres"),
  name: z.string({required_error:"O nome é obrigatório"}).min(3, "Nome inválido"),
  phone: z.string({required_error:"O número de celular é obrigatório"}),
  identityDocument: z.string({required_error:"O CPF é obrigatório"}).min(11, "CPF inválido"),
  gender: z.enum(["MALE", "FEMALE"], {required_error: "O sexo é obrigatório"})
});



const updateUserSchema = z.object({
  name: z.string().min(3, "Nome inválido").nullable(),
  phone: z.string().nullable(),
  gender: z.enum(["MALE", "FEMALE"]).nullable(),
});

const updateUserDatabase = z.object({
  name: z.string().min(3, "Nome inválido").nullable(),
  phone: z.string({required_error:"O número de celular é obrigatório"}).nullable(),
  gender: z.enum(["MALE", "FEMALE"], {required_error: "O sexo é obrigatório"}).nullable(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateUserDatabase = z.infer<typeof createUserDatabase>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserDatabase = z.infer<typeof updateUserDatabase>;