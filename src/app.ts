import express from "express";
import pino from "pino-http";
import pinoPretty from "pino-pretty";
import { handleError } from "./middlewares/handle-error";
import { usersRoutes } from "./routes/users";

import swaggerUi from "swagger-ui-express";

import { swaggerDocs } from "./config/docs/swagger-config";

export const app = express();

const stream = pinoPretty({
	colorize: true,
});
app.use(pino(stream));

app.use(express.json());

app.use("/users", usersRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(handleError);
