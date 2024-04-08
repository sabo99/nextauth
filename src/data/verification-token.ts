import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const getVerificationToken = async (
  value: string,
  searchBy: "token" | "email",
) => {
  try {
    return searchBy === "token"
      ? await db.verificationToken.findUnique({ where: { token: value } })
      : await db.verificationToken.findFirst({ where: { email: value } });
  } catch {
    return null;
  }
};

export const createVerificationToken = async (email: string) => {
  const token: string = uuidv4();
  const expires: Date = new Date(new Date().getTime() + 60 * 60 * 1000);
  return db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};

export const deleteVerificationToken = async (existingTokenId: string) => {
  try {
    return await db.verificationToken.delete({
      where: { id: existingTokenId },
    });
  } catch (error) {
    console.error(error);
  }
};
