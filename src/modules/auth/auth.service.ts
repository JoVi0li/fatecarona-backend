import { prisma } from "../../shared/utils/prisma";

export const verifyEmail = async (id: string) => {
  return await prisma.user.update({
    where: {
      id: id
    },
    data: {
      verifiedEmail: true
    }
  });
}