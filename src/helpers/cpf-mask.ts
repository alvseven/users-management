export const cpfMask = (cpf: string) => {
	const maskedCpf = `${cpf.slice(0, 3)}.***.***-${cpf.slice(9)}`;

	return maskedCpf;
};
