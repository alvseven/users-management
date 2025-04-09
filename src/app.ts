import express from "express";
import pino from "pino-http";
import pinoPretty from "pino-pretty";

import { handleError } from "./middlewares/handle-error";

import { usersRoutes } from "./routes/users";

export const app = express();

app.use(express.json());

const stream = pinoPretty({
	colorize: true,
});

app.use(pino(stream));

app.use("/users", usersRoutes);

app.use(handleError);
