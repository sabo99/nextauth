import { db } from "@/lib/db";

export const getTwoFactorConfirmation = async (userId: string) => {
  try {
    return await db.twoFactorConfirmation.findUnique({
      where: { userId: userId },
    });
  } catch {
    return null;
  }
};

export const deleteTwoFactorConfirmation = async (
  twoFactorConfirmationId: string,
) => {
  try {
    return await db.twoFactorConfirmation.delete({
      where: { id: twoFactorConfirmationId },
    });
  } catch {
    return null;
  }
};

export const createTwoFactorConfirmation = async (userId: string) => {
  try {
    return await db.twoFactorConfirmation.create({
      data: { userId },
    });
  } catch {
    return null;
  }
};
