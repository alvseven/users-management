import type { ZodSchema } from "zod";

import { zodCustomErrorMap } from "../config/zod-error-map";

type SuccessParse<T> = {
	success: true;
	data: T;
};

type ErrorParse = {
	success: false;
	errors: string[];
};

export type ParseResult<T> = SuccessParse<T> | ErrorParse;

export const validateSchema = <T>(
	schema: ZodSchema<T>,
	data: unknown,
): ParseResult<T> => {
	const result = schema.safeParse(data, {
		errorMap: zodCustomErrorMap,
	});

	if (result.success) {
		return { success: true, data: result.data };
	}

	const errorMessages = result.error.errors.map((error) => error.message);

	return { success: false, errors: errorMessages };
};
