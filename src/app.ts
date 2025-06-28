import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import "dotenv/config";
import { publicRouter } from "./routes/public.route";

const PORT = process.env.PORT || 5000;

const main = (): void => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  app.use(publicRouter);

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

main();
