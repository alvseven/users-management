import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "debug"]),
	PORT: z.coerce.number().positive(),
	API_URL: z.string().startsWith("http"),
	JWT_SECRET: z.string().min(1),
	JWT_EXPIRES_IN: z.number(),
});

export const parsedEnvs = Object.freeze(envSchema.parse(process.env));
