import { Request, Response } from 'express';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import { UsuariosProvider } from '../../database/providers/usuarios';
import { IUsuario } from '../../database/models';
import { JWTService, PasswordCrypto } from '../../shared/services';

interface IParamProps extends Omit<IUsuario,'id'|'nome'> {}

export const signInValidation = validation( getSchema => ({
	body: getSchema<IParamProps>( yup.object().shape({
		email: yup.string().required().email().min(5),
		senha: yup.string().required().min(6)
	}))
}));

export const signIn = async (req: Request<{}, {}, IParamProps>, res: Response) => {
	const {email,senha} = req.body;
	const usuario = await UsuariosProvider.getByEmail(email);

	if (usuario instanceof Error)
		return res.status(StatusCodes.UNAUTHORIZED).json({
			errors:{
				default: 'Email ou senha são inválidos'
			}
		});

	if (!(await PasswordCrypto.verifyPassword(senha,usuario.senha)))
		return res.status(StatusCodes.UNAUTHORIZED).json({
			errors:{
				default: 'Email ou senha são inválidos'
			}
		});

	const accessToken = JWTService.sign({uid:usuario.id});

	if(accessToken === 'JWT_SECRET_NOT_FOUND')
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			errors:{
				default: 'Erro ao gerar o token de acesso'
			}
		});

	return res.status(StatusCodes.OK).json({id:usuario.id,nome:usuario.nome,accessToken});
};
