export const userSchemas = {
	CreateUserRequest: {
		type: "object",
		required: ["name", "email", "document", "password"],
		properties: {
			name: {
				type: "string",
				example: "John Doe",
			},
			email: {
				type: "string",
				format: "email",
				example: "john@email.com",
			},
			document: {
				type: "string",
				description: "CPF do usuário",
				example: "12345678909",
			},
			password: {
				type: "string",
				format: "password",
				minLength: 8,
				example: "Password@123",
			},
		},
	},

	LoginRequest: {
		type: "object",
		required: ["email", "password"],
		properties: {
			email: {
				type: "string",
				format: "email",
				example: "john@email.com",
			},
			password: {
				type: "string",
				format: "password",
				example: "Password@123",
			},
		},
	},

	Error: {
		type: "object",
		properties: {
			status: {
				type: "string",
				example: "error",
			},
			message: {
				type: "string",
				example: "Mensagem de erro detalhada",
			},
		},
	},

	TokenNotFoundResponse: {
		type: "object",
		properties: {
			status: {
				type: "string",
				example: "error",
			},
			message: {
				type: "string",
				example: "Token não encontrado",
			},
		},
	},

	InvalidTokenResponse: {
		type: "object",
		properties: {
			status: {
				type: "string",
				example: "error",
			},
			message: {
				type: "string",
				example: "Token inválido",
			},
		},
	},

	EmailConflictResponse: {
		type: "object",
		properties: {
			status: {
				type: "string",
				example: "error",
			},
			message: {
				type: "string",
				example: "O email já está sendo utilizado",
			},
		},
	},

	DocumentConflictResponse: {
		type: "object",
		properties: {
			status: {
				type: "string",
				example: "error",
			},
			message: {
				type: "string",
				example: "O CPF já está sendo utilizado",
			},
		},
	},

	CreateUserResponse: {
		type: "object",
		properties: {
			id: {
				type: "string",
				value: "83588f3c-37cd-405b-b15e-25367b345344",
			},
			name: {
				type: "string",
				value: "John Doe",
			},
			email: {
				type: "string",
				format: "email",
				value: "john@email.com",
			},
			document: {
				type: "string",
				description: "CPF do usuário com parte dos números ocultos",
				value: "123.***.***-09",
			},
			createdAt: {
				type: "string",
				format: "date-time",
				value: "2025-04-10T11:46:43.263Z",
			},
		},
	},

	LoginResponse: {
		type: "object",
		properties: {
			token: {
				type: "string",
				example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
			},
		},
	},

	ListUsersResponse: {
		type: "array",
		items: {
			type: "object",
			properties: {
				id: {
					type: "string",
					value: "83588f3c-37cd-405b-b15e-25367b345344",
				},
				name: {
					type: "string",
					value: "John Doe",
				},
				email: {
					type: "string",
					format: "email",
					value: "john@email.com",
				},
				document: {
					type: "string",
					description: "CPF do usuário com parte dos números ocultos",
					value: "123.***.***-09",
				},
				createdAt: {
					type: "string",
					format: "date-time",
					value: "2025-04-10T11:56:32.131Z",
				},
			},
		},
	},

	securitySchemes: {
		bearerAuth: {
			type: "http",
			scheme: "bearer",
			bearerFormat: "JWT",
			description: "Token JWT obtido no endpoint de login",
		},
	},
};
