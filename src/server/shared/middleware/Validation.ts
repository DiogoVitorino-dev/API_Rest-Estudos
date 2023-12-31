import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import {AnyObject, Maybe, ObjectSchema, ValidationError} from 'yup';

type TProperty = 'body' | 'header' | 'query' | 'params'

type TAllSchemas = Record<TProperty,ObjectSchema<any>>


type TGetSchema = <T extends Maybe<AnyObject>>(schema:ObjectSchema<T>) => ObjectSchema<T>

type TGetAllSchemas = (getSchema:TGetSchema) => Partial<TAllSchemas>

type TValidation = (getAllSchemas:TGetAllSchemas) => RequestHandler


export const validation:TValidation = (getAllSchemas) => async (req, res, next) => {
	const schemas = getAllSchemas(schema => schema);
	

	const errors:Record<string, Record<string,string>> = {};
	
	Object.entries(schemas).forEach(([key,schema]) => {
		try {
			schema.validateSync(req[key as TProperty],{abortEarly:false});
		} catch (err) {
			const yupError = err as ValidationError;
			const errorsFound:Record<string,string> = {};
	
			yupError.inner.forEach(error => {
				if(!error.path) return;
				errorsFound[error.path] = error.message;
			});

			errors[key] = errorsFound;
		}
	});

	if(!Object.entries(errors).length)
		return next();
	else
		return res.status(StatusCodes.BAD_REQUEST).json({errors});
};