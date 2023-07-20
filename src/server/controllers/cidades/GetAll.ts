import { Request, Response } from 'express';
import { validation } from '../../shared/middleware';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';

interface IQueryProps {
	page?:number;
	limit?:number;
	filter?:string;
}

export const getAllValidation = validation( getSchema => ({
	query: getSchema<IQueryProps>( yup.object().shape({
		page: yup.number().integer().optional().moreThan(0),
		limit: yup.number().integer().optional().moreThan(0),
		filter: yup.string().optional()
	}))

}));

export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {	
	res.setHeader('access-control-expose-headers','x-total-count');
	res.setHeader('x-total-count',1);
	
	return res.status(StatusCodes.OK).json([
		{
			id:1,
			nome:'paulista'
		}
	]);
};
