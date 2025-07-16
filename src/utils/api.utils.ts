import { Response } from "express";
import { z } from "zod";

export async function wrapWithTryCatch(
  res: Response,
  callback: () => Promise<void>,
): Promise<void> {
  try {
    await callback();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).send({
        status: "error",
        message: "Invalid input",
        details: error.issues,
      });
    } else if (error instanceof Error) {
      res.status(500).send({
        status: "error",
        message: "Unexpected error",
        details: error.message,
      });
    } else {
      res.status(500).send({
        status: "error",
        message: "Unexpected error",
        details: "Internal server error",
      });
    }
  }
}
