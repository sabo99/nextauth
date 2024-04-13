"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGGED_IN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";
import { getUser } from "@/data/user";
import { sendTwoFactorEmail } from "@/lib/mail";
import {
  deleteTwoFactorToken,
  getTwoFactorToken,
} from "@/data/two-factor-token";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmation,
} from "@/data/two-factor-confirmation";
import bcrypt from "bcryptjs";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Login failed. Please try again later." };
  }
  const { email, password, code } = validatedFields.data;

  const existingUser = await getUser(email, "email");
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email doesn't exists!" };
  }

  // Check Password
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    return { error: "Passwords do not match!" };
  }

  if (!existingUser.emailVerified) {
    return {
      error: "Your email isn't verified. Please check your email verification.",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // Verify 2FA code
      const twoFactorToken = await getTwoFactorToken(existingUser.email);
      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "Code expired!" };
      }

      await deleteTwoFactorToken(twoFactorToken.id);

      const existingConfirmation = await getTwoFactorConfirmation(
        existingUser.id,
      );
      if (existingConfirmation) {
        await deleteTwoFactorConfirmation(existingConfirmation.id);
      }

      // Create Two Factor Confirmation
      await createTwoFactorConfirmation(existingUser.id);
    } else {
      await sendTwoFactorEmail(existingUser.email);

      return { twoFactor: true };
    }
  }

  try {
    const response = await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGGED_IN_REDIRECT,
    });
    return { success: "Logged in successfully!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        case "AccessDenied":
          return { error: "Your account has not been verified" };
        default:
          return { error: "Login failed. Something went wrong." };
      }
    }
    throw error;
  }
};
