import { z } from "zod";

const signinUserSchema = z.object({
  email: z.string({required_error:"O e-mail é obrigatório"}).email().endsWith("fatec.sp.gov.br" || "etec.sp.gov.br", "E-mail inválido"),
  password: z.string({required_error:"A senha é obrigatória"}).min(8, "A senha precisa conter no mínimo 8 caracteres"),
});

export type SigninUserInput = z.infer<typeof signinUserSchema>;