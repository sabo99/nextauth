import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationToken,
} from "@/data/verification-token";

import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetToken,
} from "@/data/password-reset-token";

import {
  createTwoFactorToken,
  deleteTwoFactorToken,
  getTwoFactorToken,
} from "@/data/two-factor-token";

export const generateVerificationToken = async (email: string) => {
  const existingToken = await getVerificationToken(email, "email");
  if (existingToken) {
    await deleteVerificationToken(existingToken.id);
  }

  return await createVerificationToken(email);
};

export const generatePasswordResetToken = async (email: string) => {
  const existingToken = await getPasswordResetToken(email, "email");

  if (existingToken) {
    await deletePasswordResetToken(existingToken.id);
  }

  return await createPasswordResetToken(email);
};

export const generateTwoFactorToken = async (email: string) => {
  const existingToken = await getTwoFactorToken(email, "email");

  if (existingToken) {
    await deleteTwoFactorToken(existingToken.id);
  }

  return await createTwoFactorToken(email);
};
