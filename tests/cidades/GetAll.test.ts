import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';
import { ICidade } from '../../src/server/database/models';

describe('Cidades - GetAll', () => {
	let accessToken = '';
	beforeAll(async () => {
		await testServer.post('/cadastrar')
			.send({nome:'test', email:'gettoken@outlook.com', senha:'123456'});

		const {body} = await testServer.post('/entrar')
			.send({email:'gettoken@outlook.com', senha:'123456'});
		accessToken = body.accessToken;

		for (let count = 1; count <= 5; count++){
			// alternador
			if(count % 2 === 0)
				await testServer.post('/cidades')
					.set({Authorization: `Bearer ${accessToken}`}).send({nome: 'testPar'});
			else
				await testServer.post('/cidades')
					.set({Authorization: `Bearer ${accessToken}`}).send({nome: 'testImpar'});
		}
	});

	it('Deve retorna todos os registros',async () => {
		const resGetAll =  await testServer.get('/cidades')
			.set({Authorization: `Bearer ${accessToken}`});
		expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
		expect(Number(resGetAll.header['x-total-count'])).toBeGreaterThan(0);
		expect(resGetAll.body.length).toBeGreaterThan(0);
	});

	it('Deve retorna apenas 2 registros quando o Query Param limit é definido 2',
		async () => {
			const resGetAll = await testServer.get('/cidades')
				.set({Authorization: `Bearer ${accessToken}`}).query({
					page:1,
					limit:2,
				});

			expect(resGetAll.statusCode).toEqual(StatusCodes.OK);

			expect(
				resGetAll.body.find((cidade:ICidade) => cidade.id === 2)
			).toBeDefined();

			expect(
				resGetAll.body.find((cidade:ICidade) => cidade.id === 4)
			).toBeUndefined();
		}
	);

	it('Deve retorna os registros que ultrapassarem o Query Param limit apenas na página seguinte',
		async () => {
			const resGetAll = await testServer.get('/cidades')
				.set({Authorization: `Bearer ${accessToken}`}).query({
					page:2,
					limit:2,
				});

			expect(resGetAll.statusCode).toEqual(StatusCodes.OK);

			expect(
				resGetAll.body.find((cidade:ICidade) => cidade.id === 4)
			).toBeDefined();

			expect(
				resGetAll.body.find((cidade:ICidade) => cidade.id === 2)
			).toBeUndefined();
		}
	);

	it('Deve retorna apenas os registros filtrados pelo Query Param filter',
		async () => {
			const resGetAll = await testServer.get('/cidades')
				.set({Authorization: `Bearer ${accessToken}`}).query({
					page:1,
					filter:'testI'
				});

			expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
			expect(
				resGetAll.body.find((cidade:ICidade) => cidade.nome === 'testImpar')
			).toBeDefined();

			expect(
				resGetAll.body.find((cidade:ICidade) => cidade.nome === 'testPar')
			).toBeUndefined();
		}
	);

	it('Query params - page,limit e id devem ser Number',async () => {
		const resGetAll = await testServer.get('/cidades')
			.set({Authorization: `Bearer ${accessToken}`}).query({
				page:'test',
				limit:'test',
				id:'test'
			});

		expect(resGetAll.statusCode).toEqual(StatusCodes.BAD_REQUEST);

		expect(resGetAll.body).toHaveProperty('errors.query.page');

		expect(resGetAll.body).toHaveProperty('errors.query.limit');

		expect(resGetAll.body).toHaveProperty('errors.query.id');
	});

	it('Query params - page,limit e id devem ser inteiros',async () => {
		const resGetAll = await testServer.get('/cidades')
			.set({Authorization: `Bearer ${accessToken}`}).query({
				page:1.5,
				limit:25.7,
				id:1.1
			});

		expect(resGetAll.statusCode).toEqual(StatusCodes.BAD_REQUEST);

		expect(resGetAll.body).toHaveProperty('errors.query.page');

		expect(resGetAll.body).toHaveProperty('errors.query.limit');

		expect(resGetAll.body).toHaveProperty('errors.query.id');
	});

	it('Query params - page,limit devem ser maior que 0',async () => {
		const resGetAll = await testServer.get('/cidades')
			.set({Authorization: `Bearer ${accessToken}`}).query({
				page:0,
				limit:-1,
			});

		expect(resGetAll.statusCode).toEqual(StatusCodes.BAD_REQUEST);

		expect(resGetAll.body).toHaveProperty('errors.query.page');

		expect(resGetAll.body).toHaveProperty('errors.query.limit');
	});
});