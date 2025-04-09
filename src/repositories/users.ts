import type { StrictOmit } from "src/helpers/types/strict-omit";
import { type UserModel, prisma } from "../database/prisma-client";

export const usersRepository = () => {
	const repository = prisma.user;

	const getAll = async () => {
		const users = repository.findMany();

		return users;
	};

	const create = async (user: StrictOmit<UserModel, "id" | "createdAt">) => {
		const createdUser = await repository.create({
			data: user,
			select: {
				id: true,
				name: true,
				email: true,
				document: true,
				createdAt: true,
				password: false,
			},
		});

		return createdUser;
	};

	const findByEmail = async (email: UserModel["email"]) => {
		const user = repository.findUnique({
			where: {
				email,
			},
		});

		return user;
	};

	const findByDocument = async (document: UserModel["document"]) => {
		const user = repository.findUnique({
			where: {
				document,
			},
		});

		return user;
	};

	return {
		create,
		getAll,
		findByEmail,
		findByDocument,
	};
};
