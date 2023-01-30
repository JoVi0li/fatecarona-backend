import { z } from "zod";

const createParticipantSchema = z.object({
  eventId: z.string({required_error: "O identificador do evento é obrigatório"}),
  userCollegeId: z.string({required_error: "O identificador do estudante é obrigatório"})
});

const disableParticipantSchema = z.object({
  participantId: z.string({required_error: "O identificador do participante é obrigatório"}),
});

export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;
export type DisableParticipantInput = z.infer<typeof disableParticipantSchema>;