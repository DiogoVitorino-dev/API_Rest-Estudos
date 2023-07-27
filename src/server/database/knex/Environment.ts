import { Knex } from 'knex';
import path from 'path';

export const development:Knex.Config = {
	client:'sqlite3',
	useNullAsDefault:true,
	connection:{
		filename:path.resolve(__dirname,'..','..','..','..','database.sqlite')
	},
	migrations:{
		directory: path.resolve(__dirname,'..','migrations')
	},
	seeds:{
		directory: path.resolve(__dirname,'..','seeds')
	},
	pool:{
		afterCreate: (connection: any, done: Function) => {
			connection.run('PRAGMA foreign_key = ON');
			done();
		}
	}
};

export const test:Knex.Config = {
	...development,
	connection:':memory:'
};

export const production:Knex.Config = {
	client:'mysql',
	migrations:{
		directory: path.resolve(__dirname,'..','migrations')
	},
	seeds:{
		directory: path.resolve(__dirname,'..','seeds')
	},
	connection:{
		host: process.env.DATABASE_HOST,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		port: Number(process.env.DATABASE_PORT) || 3306,
		ssl:{rejectUnauthorized:false}
	},
};