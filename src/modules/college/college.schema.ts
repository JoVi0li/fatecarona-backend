import { z } from "zod";

const createCollegeSchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório" }).min(3, "Nome inválido"),
  localization: z.array(z.string({ required_error: "Localização inválida" })).min(2, "Localização inválida").max(2, "Localização inválida"),
});

const updateCollegeNameSchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório" }).min(3, "Nome inválido"),
});

export type CreateCollegeInput = z.infer<typeof createCollegeSchema>;
export type UpdateCollegeNameInput = z.infer<typeof updateCollegeNameSchema>;