import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): Promise<void> {
  console.log("here");

  if (err instanceof z.ZodError) {
    res.status(400).send({
      status: "error",
      message: "Invalid input",
      details: err.issues,
    });
  } else if (err instanceof Error) {
    res.status(500).send({
      status: "error",
      message: "Unexpected error",
      details: err.message,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: "Unexpected error",
      details: "Internal server error",
    });
  }
}
