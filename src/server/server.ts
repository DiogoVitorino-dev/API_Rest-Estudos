import Express from 'express';
import 'dotenv/config';
import cors from 'cors';
import './shared/services/TranslationsYup';
import { router } from './routes';

const server = Express();

server.use(cors({
	origin:process.env.ENABLED_CORS?.split(/\s+/) || []
}));

server.use(Express.json());

server.use(router);

export {server};