import { z } from "zod";

const createCourseSchema = z.object({
  name: z.string({required_error: "O nome é obrigatório"}).min(3, "Nome inválido"),
  time: z.enum(["AM", "PM"], {required_error: "O horário é obrigatório"}),
  collegeId: z.string({required_error: "O identificador da faculdade é obrigatório"})
});

const updateCourseSchema = z.object({
  name: z.string().min(3, "Nome inválido").nullable(),
  time: z.enum(["AM", "PM"]).nullable(),
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;