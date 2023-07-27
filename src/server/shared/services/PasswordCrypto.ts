import { hash, genSalt, compare } from 'bcryptjs';

const SALT_RANDOMS = 8;

const hashPassword = async (password:string) => {
	const saltGenerated = await genSalt(SALT_RANDOMS);

	return hash(password,saltGenerated);
};

const verifyPassword = (password: string, hashPassword: string) => compare(password,hashPassword);

export const PasswordCrypto = {
	hashPassword,
	verifyPassword
};