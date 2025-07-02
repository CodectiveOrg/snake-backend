export const validateEnv = (): void => {
  if (!process.env.TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET does not exist in .env file.");
  }

  if (!process.env.TOKEN_KEY) {
    throw new Error("TOKEN_KEY does not exist in .env file.");
  }
};
