import { compareSync, hashSync } from "bcryptjs";
import jwt from "jsonwebtoken";

import { parsedEnvs } from "src/config/envs";

import type { CreateUserRequest, userLoginRequest } from "src/dtos/users";

import { error, success } from "src/helpers/api-response";

import { usersRepository } from "src/repositories/users";

export const usersService = () => {
	const { create, getAll, findByEmail, findByDocument } = usersRepository();

	const createUser = async (user: CreateUserRequest) => {
		const [emailIsBeingUsed, documentIsBeingUsed] = await Promise.all([
			findByEmail(user.email),
			findByDocument(user.document),
		]);

		if (emailIsBeingUsed) {
			return error("O email já está sendo utilizado", 409);
		}

		if (documentIsBeingUsed) {
			return error("O CPF já está sendo utilizado", 409);
		}

		const hashedPassword = hashSync(user.password);

		const createdUser = await create({ ...user, password: hashedPassword });

		return success(createdUser, 201);
	};

	const getUsers = async () => {
		const users = await getAll();

		return success(users);
	};

	const authenticate = async (user: userLoginRequest) => {
		const userFound = await findByEmail(user.email);

		if (!userFound) {
			return error("Email e/ou senha incorreto(s)", 401);
		}

		const passwordIsCorrect = compareSync(user.password, userFound.password);

		if (!passwordIsCorrect) {
			return error("Email e/ou senha incorreto(s)", 401);
		}

		const token = jwt.sign(
			{
				id: userFound.id,
				email: userFound.email,
			},
			parsedEnvs.JWT_SECRET,
			{
				expiresIn: parsedEnvs.JWT_EXPIRES_IN,
			},
		);

		return success({ token }, 200);
	};

	return {
		createUser,
		getUsers,
		authenticate,
	};
};
