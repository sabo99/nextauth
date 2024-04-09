"use server";

import { db } from "@/lib/db";
import { getUser } from "@/data/user";
import { getVerificationToken } from "@/data/verification-token";

export const authVerify = async (token: string) => {
  /**
   * Check existing the token
   */
  const existingToken = await getVerificationToken(token, "token");
  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  /**
   * Check if existingToken hasExpired
   */
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  /**
   * Check existingUser
   */
  const existingUser = await getUser(existingToken.email, "email");

  if (!existingUser) {
    return { error: "Email doesn't exist!" };
  }

  try {
    await db.$transaction(async (trx) => {
      await db.user.update({
        where: { id: existingUser.id },
        data: {
          emailVerified: new Date(),
          email: existingToken.email,
        },
      });

      await db.verificationToken.delete({
        where: { id: existingToken.id },
      });
    });

    return { success: "Email verified!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
