import { RequestHandler } from "express";

export const getSettingsEndpoint: RequestHandler = (req, res) => {
  const { user } = res.locals;
  res.json({ settings: { username: user.username, isDarkMode: true } });
};
