import type { Request, Response } from "express";

import { usersService } from "../services/users";
import { validateSchema } from "../dtos/validate-schema";
import { createUserRequestSchema, userLoginRequestSchema } from "src/dtos/users";
import { Result } from "src/helpers/api-response";

const handleResponse = <T>(result: Result<T>, response: Response) => {
	if (result.status === "error") {
		return response.status(result.code).json({ message: result.message });
	}

	return response.status(result.code).json(result.data);
};

export const usersController = () => {
	const { createUser, getUsers, authenticate } = usersService();

	const create = async (request: Request, response: Response) => {

    const parsedRequest = validateSchema(createUserRequestSchema, request.body);

    if (!parsedRequest.success) {
      return response.status(400).json({
        status: "error",
        message: parsedRequest.errors,
      });
    }

		const userCreationResult = await createUser(parsedRequest.data);

		return handleResponse(userCreationResult, response);
	};

	const getAll = async (_request: Request, response: Response) => {
		const users = await getUsers();

		return handleResponse(users, response);
	};

	const login = async (request: Request, response: Response) => {
    const parsedRequest = validateSchema(userLoginRequestSchema, request.body);

        if (!parsedRequest.success) {
      return response.status(400).json({
        status: "error",
        message: parsedRequest.errors,
      });
    }

		const userAuthenticationResult = await authenticate(parsedRequest.data);

		return handleResponse(userAuthenticationResult, response);
	};

	return {
		create,
		getAll,
		login,
	};
};
