import { z } from "zod";

const createUserSchema = z.object({
  email: z.string({required_error:"O e-mail é obrigatório"}).email().endsWith("fatec.sp.gov.br", "E-mail inválido"),
  password: z.string({required_error:"A senha é obrigatória"}).min(8, "A senha precisa conter no mínimo 8 caracteres"),
  name: z.string({required_error:"O nome é obrigatório"}).min(3, "Nome inválido"),
  photo: z.string({required_error:"A foto é obrigatória"}),
  phone: z.string({required_error:"O número de celular é obrigatório"}),
  identityDocument: z.string({required_error:"O CPF é obrigatório"}).min(11, "CPF inválido"),
  gender: z.enum(["MALE", "FEMALE"], {required_error: "O sexo é obrigatório"})
});

const signinUserSchema = z.object({
  email: z.string({required_error:"O e-mail é obrigatório"}).email().endsWith("fatec.sp.gov.br", "E-mail inválido"),
  password: z.string({required_error:"A senha é obrigatória"}).min(8, "A senha precisa conter no mínimo 8 caracteres"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type SigninUserInput = z.infer<typeof signinUserSchema>;