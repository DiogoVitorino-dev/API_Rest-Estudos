import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - GetById', () => {
	it('Deve retorna cidade pelo parâmetro id',async () => {
		const resultCreated =  await testServer.post('/cidades').send({nome:'paulista'});
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);

		const resGetById =  await testServer.get(`/cidades/${resultCreated.body}`);
		expect(resGetById.statusCode).toEqual(StatusCodes.OK);		
		expect(resGetById.body).toHaveProperty('nome');	
	});

	it('Tentar retorna uma cidade que não existe',async () => {		
		const resGetById =  await testServer.get('/cidades/99999');
		expect(resGetById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resGetById.body).toHaveProperty('errors.default');
	});
	
	it('Parâmetro id deve ser um Number',async () => {		
		const resGetById = await testServer.get('/cidades/test');

		expect(resGetById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resGetById.body)
			.toHaveProperty('errors.params.id','Formato digitado é invalido');		
	});
	
	it('Parâmetro id deve ser um inteiro',async () => {		
		const resGetById =  await testServer.get('/cidades/1.2');	

		expect(resGetById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resGetById.body)
			.toHaveProperty('errors.params.id','Deve ser um número inteiro');		
	});
	
	it('Parâmetro id deve ser maior que 0',async () => {		
		const resGetById =  await testServer.get('/cidades/0');	

		expect(resGetById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resGetById.body)
			.toHaveProperty('errors.params.id','Deve ser maior que 0');		
	});	
});