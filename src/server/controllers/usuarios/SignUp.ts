import { Request, Response } from 'express';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import { IUsuario } from '../../database/models';
import { UsuariosProvider } from '../../database/providers/usuarios';

interface IBodyProps extends Omit<IUsuario,'id'> {}

export const signUpValidation = validation( getSchema => ({
	body: getSchema<IBodyProps>( yup.object().shape({
		nome: yup.string().required().min(3).max(32),
		email: yup.string().email().required().min(5).max(255),
		senha: yup.string().required().min(6).max(32),
	})),
}));

export const signUp = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
	const result = await UsuariosProvider.create(req.body);

	if (result instanceof Error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			errors:{
				default: result.message
			}
		});

	return res.status(StatusCodes.CREATED).json(result);
};
