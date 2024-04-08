import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationToken,
} from "@/data/verification-token";

export const generateVerificationToken = async (email: string) => {
  const existingToken = await getVerificationToken(email, "email");
  if (existingToken) {
    await deleteVerificationToken(existingToken.id);
  }

  return await createVerificationToken(email);
};
