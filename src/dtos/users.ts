import { z } from "zod";

export const createUserRequestSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	document: z.string().length(11),
	password: z
		.string()
		.min(8, {
			message: "O campo [password] deve conter no mínimo 8 caracteres",
		})
		.regex(
			/(?=.*?[A-Z])/,
			"O campo [password] deve conter no mínimo uma letra maiúscula",
		)
		.regex(
			/(?=.*?[a-z])/,
			"O campo [password] deve conter no mínimo uma letra minúscula",
		)
		.regex(/(?=.*?\d)/, "O campo [password] deve conter no mínimo um número"),
});
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;

export const userLoginRequestSchema = z.object({
	email: z.string(),
	password: z.string(),
});
export type userLoginRequest = z.infer<typeof userLoginRequestSchema>;
