import { db } from "@/lib/db";
import { PasswordResetToken } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const getPasswordResetToken = async (
  value: string,
  searchBy = "token | email",
): Promise<PasswordResetToken | null> => {
  try {
    return searchBy === "token"
      ? await db.passwordResetToken.findUnique({ where: { token: value } })
      : await db.passwordResetToken.findFirst({ where: { email: value } });
  } catch {
    return null;
  }
};

export const deletePasswordResetToken = async (existingTokenId: string) => {
  try {
    return await db.passwordResetToken.delete({
      where: { id: existingTokenId },
    });
  } catch (error) {
    console.error(error);
  }
};

export const createPasswordResetToken = async (email: string) => {
  const token: string = uuidv4();
  const expires: Date = new Date(new Date().getTime() + 60 * 60 * 1000);
  return db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};
