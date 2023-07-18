import { Router } from 'express';
import {StatusCodes} from 'http-status-codes';

const router = Router();

router.get('/',(_,res) => {
	return res.send('ola');
});

router.post('/test',(req,res) => {
	console.log(req.query.tester);
	return res.status(StatusCodes.OK).json(req.body);
});

export {router};