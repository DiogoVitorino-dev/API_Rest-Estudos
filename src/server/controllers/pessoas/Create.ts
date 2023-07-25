import { Request, Response } from 'express';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import { IPessoa } from '../../database/models';
import { PessoasProvider } from '../../database/providers/pessoas';

interface IBodyProps extends Omit<IPessoa,'id'> {}

export const createValidation = validation( getSchema => ({
	body: getSchema<IBodyProps>( yup.object().shape({
		nomeCompleto: yup.string().required().min(3).max(80),
		email: yup.string().email().required().max(255),
		cidadeid: yup.number().integer().required().moreThan(0),
	})),
}));

export const create = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
	const result = await PessoasProvider.create(req.body);
	
	if (result instanceof Error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			errors:{
				default: result.message
			}
		});

	return res.status(StatusCodes.CREATED).json(result);
};
