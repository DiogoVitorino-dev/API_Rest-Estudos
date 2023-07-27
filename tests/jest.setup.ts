import supertest from 'supertest';
import { server } from '../src/server/server';
import { Knex } from '../src/server/database/knex';

export const testServer = supertest(server);

beforeAll(async () => {
	await Knex.migrate.latest();
	await Knex.seed.run();
});

afterAll(async () => await Knex.destroy());

