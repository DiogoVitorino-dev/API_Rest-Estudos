import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - GetAll', () => {
	it('Deve retorna todas as cidade',async () => {
		const resultCreated =  await testServer.post('/cidades').send({nome:'paulista'});
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);

		const resGetAll =  await testServer.get('/cidades');
		expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
		expect(Number(resGetAll.header['x-total-count'])).toBeGreaterThan(0);
		expect(resGetAll.body.length).toBeGreaterThan(0);
	});
	
	it('Query params - page,limit devem ser Number',async () => {		
		const resGetAll = await testServer.get('/cidades').query({
			page:'test',
			limit:'test'
		});

		expect(resGetAll.statusCode).toEqual(StatusCodes.BAD_REQUEST);

		expect(resGetAll.body)
			.toHaveProperty('errors.query.page','Formato digitado é invalido');
			
		expect(resGetAll.body)
			.toHaveProperty('errors.query.limit','Formato digitado é invalido');
	});
	
	it('Query params - page,limit devem ser inteiros',async () => {		
		const resGetAll = await testServer.get('/cidades').query({
			page:1.5,
			limit:25.7
		});

		expect(resGetAll.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		
		expect(resGetAll.body)
			.toHaveProperty('errors.query.page','Deve ser um número inteiro');
			
		expect(resGetAll.body)
			.toHaveProperty('errors.query.limit','Deve ser um número inteiro');
	});
	
	it('Query params - page,limit devem ser maior que 0',async () => {		
		const resGetAll = await testServer.get('/cidades').query({
			page:0,
			limit:-1
		});

		expect(resGetAll.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		
		expect(resGetAll.body)
			.toHaveProperty('errors.query.page','Deve ser maior que 0');
			
		expect(resGetAll.body)
			.toHaveProperty('errors.query.limit','Deve ser maior que 0');
	});	
});