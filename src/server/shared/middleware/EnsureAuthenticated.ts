import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JWTService } from '../services';

export const ensureAuthenticated: RequestHandler = (req, res, next) => {
	const {authorization} = req.headers;

	if (!authorization)
		return res.status(StatusCodes.UNAUTHORIZED).json({
			errors: { default: 'Não autenticado' }
		});

	const [prefix, token] = authorization.split(/\s+/);

	if (prefix !== 'Bearer')
		return res.status(StatusCodes.UNAUTHORIZED).json({
			errors: { default: 'Não autenticado' }
		});

	const jwtData = JWTService.verify(token);
	if (jwtData === 'JWT_SECRET_NOT_FOUND')
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			errors: { default: 'Erro ao verificar o token' }
		});

	if (jwtData === 'INVALID_TOKEN')
		return res.status(StatusCodes.UNAUTHORIZED).json({
			errors: { default: 'Não autenticado' }
		});

	req.headers.idUsuario = jwtData.uid.toString();

	return next();
};