import { Request, Response } from 'express';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import { UsuariosProvider } from '../../database/providers/usuarios';
import { IUsuario } from '../../database/models';
import { PasswordCrypto } from '../../shared/services';

interface IParamProps extends Omit<IUsuario,'id'|'nome'> {}

export const signInValidation = validation( getSchema => ({
	body: getSchema<IParamProps>( yup.object().shape({
		email: yup.string().required().email().min(5),
		senha: yup.string().required().min(6)
	}))
}));

export const signIn = async (req: Request<{}, {}, IParamProps>, res: Response) => {
	const {email,senha} = req.body;
	const result = await UsuariosProvider.getByEmail(email);

	if (result instanceof Error)
		return res.status(StatusCodes.UNAUTHORIZED).json({
			errors:{
				default: 'Email ou senha são inválidos'
			}
		});

	if (!(await PasswordCrypto.verifyPassword(senha,result.senha)))
		return res.status(StatusCodes.UNAUTHORIZED).json({
			errors:{
				default: 'Email ou senha são inválidos'
			}
		});


	return res.status(StatusCodes.OK).json({accessToken: 'teste.teste'});
};
