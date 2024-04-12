import { db } from "@/lib/db";
import crypto from "node:crypto";

export const getTwoFactorToken = async (
  value: string,
  searchBy = "token | email",
) => {
  try {
    return searchBy === "token"
      ? await db.twoFactorToken.findUnique({ where: { token: value } })
      : await db.twoFactorToken.findFirst({ where: { email: value } });
  } catch {
    return null;
  }
};

export const deleteTwoFactorToken = async (twoFactorTokenId: string) => {
  try {
    return await db.twoFactorToken.delete({
      where: { id: twoFactorTokenId },
    });
  } catch (error) {
    console.error(error);
  }
};

export const createTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires: Date = new Date(new Date().getTime() + 60 * 15 * 1000);
  return db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};
