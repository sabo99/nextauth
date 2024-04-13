"use server";

import { z } from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetToken } from "@/data/password-reset-token";
import { getUser } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetToken(token, "token");
  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUser(existingToken.email, "email");
  if (!existingUser) {
    return { error: "Email doesn't exist!" };
  }

  const hashPassword = await bcrypt.hash(password, 12);
  try {
    await db.$transaction(async (trx) => {
      await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashPassword },
      });

      await db.passwordResetToken.delete({
        where: { id: existingToken.id },
      });
    });

    return { success: "Password updated!" };
  } catch (error) {
    console.error("New Password", error);
    return { error: "Something went wrong!" };
  }
};
