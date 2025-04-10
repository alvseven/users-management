import swaggerJSDoc from "swagger-jsdoc";
import { parsedEnvs } from "../envs";
import { userSchemas } from "./user/schemas";

const { securitySchemes, ...schemas } = userSchemas;

const swaggerOptions = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Users Management API",
			version: "1.0.0",
			description: "Users management API with JWT authentication",
		},
		servers: [
			{
				url: parsedEnvs.API_URL,
			},
		],
		components: {
			securitySchemes,
			schemas,
		},
	},
	apis: ["src/routes/users.ts"],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
