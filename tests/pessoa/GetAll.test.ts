import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';
import { IPessoa } from '../../src/server/database/models';

interface IBodyTest {
	nomeCompleto?:string
	email?: string
	cidadeid?: number
}

describe('Pessoas - GetAll', () => {
	let bodyTest:IBodyTest = {};

	beforeAll(async () => {
		const resPost = await testServer.post('/cidades').send({ nome: 'paulista' });
		bodyTest = {
			nomeCompleto: 'teste da silva',
			email: 'teste@outlook.test',
			cidadeid: resPost.body
		};

		for (let count = 1; count <= 5; count++) {
			// alternador
			if(count % 2 === 0)
				await testServer.post('/pessoas').send({
					...bodyTest,
					email: `teste${count}@outlook.test`,
					nomeCompleto:'testPar',
				});

			else
				await testServer.post('/pessoas').send({
					...bodyTest,
					email: `teste${count}@outlook.test`,
					nomeCompleto:'testImpar',
				});
		}
	});

	it('Deve retorna todos os registros',async () => {
		const resGetAll =  await testServer.get('/pessoas');
		expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
		expect(Number(resGetAll.header['x-total-count'])).toBeGreaterThan(0);
		expect(resGetAll.body.length).toBeGreaterThan(0);
	});

	it('Deve retorna apenas 2 registros quando o Query Param limit é definido 2',
		async () => {
			const resGetAll = await testServer.get('/pessoas').query({
				page:1,
				limit:2,
			});

			expect(resGetAll.statusCode).toEqual(StatusCodes.OK);

			expect(
				resGetAll.body.find((pessoa:IPessoa) => pessoa.id === 2)
			).toBeDefined();

			expect(
				resGetAll.body.find((pessoa:IPessoa) => pessoa.id === 4)
			).toBeUndefined();
		}
	);

	it('Deve retorna os registros que ultrapassarem o Query Param limit apenas na página seguinte',
		async () => {
			const resGetAll = await testServer.get('/pessoas').query({
				page:2,
				limit:2,
			});

			expect(resGetAll.statusCode).toEqual(StatusCodes.OK);

			expect(
				resGetAll.body.find((pessoa:IPessoa) => pessoa.id === 4)
			).toBeDefined();

			expect(
				resGetAll.body.find((pessoa:IPessoa) => pessoa.id === 2)
			).toBeUndefined();
		}
	);

	it('Deve retorna apenas os registros filtrados pelo Query Param filter',
		async () => {
			const resGetAll = await testServer.get('/pessoas').query({
				page:1,
				filter:'testI'
			});

			expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
			expect(
				resGetAll.body.find((pessoa:IPessoa) => pessoa.nomeCompleto === 'testImpar')
			).toBeDefined();

			expect(
				resGetAll.body.find((pessoa:IPessoa) => pessoa.nomeCompleto === 'testPar')
			).toBeUndefined();
		}
	);

	it('Query params - page,limit devem ser Number',async () => {
		const resGetAll = await testServer.get('/pessoas').query({
			page:'test',
			limit:'test'
		});

		expect(resGetAll.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resGetAll.body).toHaveProperty('errors.query.page');
		expect(resGetAll.body).toHaveProperty('errors.query.limit');
	});

	it('Query params - page,limit devem ser inteiros',async () => {
		const resGetAll = await testServer.get('/pessoas').query({
			page:1.5,
			limit:25.7
		});

		expect(resGetAll.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resGetAll.body).toHaveProperty('errors.query.page');
		expect(resGetAll.body).toHaveProperty('errors.query.limit');
	});

	it('Query params - page,limit devem ser maior que 0',async () => {
		const resGetAll = await testServer.get('/pessoas').query({
			page:0,
			limit:-1,
		});

		expect(resGetAll.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resGetAll.body).toHaveProperty('errors.query.page');
		expect(resGetAll.body).toHaveProperty('errors.query.limit');
	});
});