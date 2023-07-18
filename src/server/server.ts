import Express from 'express';
import 'dotenv/config';
import { router } from './routes';

const server = Express();

server.use(Express.json());

server.use(router);

export {server};