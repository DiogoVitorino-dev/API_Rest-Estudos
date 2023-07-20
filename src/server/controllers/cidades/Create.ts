import { Request, Response } from 'express';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';

interface ICidade {
	nome:string
}

export const createValidation = validation( getSchema => ({
	body: getSchema<ICidade>( yup.object().shape({
		nome: yup.string().required().min(3),
	})),
}));

export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {	
	
	return res.status(StatusCodes.CREATED).json(1);
};
