import type { NextFunction, Request, Response } from "express";

import { verify } from "jsonwebtoken";

import { parsedEnvs } from "../config/envs";

export const verifyToken = async (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	const {
		headers: { authorization },
	} = request;

	const hasAuthHeader =
		typeof authorization === "string" && authorization.startsWith("Bearer ");

	if (!hasAuthHeader) {
		return response
			.status(401)
			.json({ status: "error", message: "Token não encontrado" });
	}

	const [_, token] = authorization.split(" ");

	verify(token, parsedEnvs.JWT_SECRET, (error) => {
		if (error) {
			return response.status(403).json({
				status: "error",
				message: "Token inválido",
			});
		}
		next();
	});
};
