import { type UserModel, prisma } from "../database/prisma-client";
import { cpfMask } from "../helpers/cpf-mask";
import type { StrictOmit } from "../helpers/types/strict-omit";

export const usersRepository = () => {
	const repository = prisma.user;

	const getAll = async () => {
		const users = await repository.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				document: true,
				createdAt: true,
				password: false,
			},
		});

		const usersWithMaskedCpf = users.map((user) => {
			return {
				...user,
				document: cpfMask(user.document),
			};
		});

		return usersWithMaskedCpf;
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

		return { ...createdUser, document: cpfMask(createdUser.document) };
	};

	const findByEmail = async (email: UserModel["email"]) => {
		const user = await repository.findUnique({
			where: {
				email,
			},
		});

		return user;
	};

	const findByDocument = async (document: UserModel["document"]) => {
		const user = await repository.findUnique({
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
