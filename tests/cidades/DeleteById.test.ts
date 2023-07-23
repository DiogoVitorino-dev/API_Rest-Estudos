import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - DeleteById', () => {
	it('Deve apagar uma cidade pelo parâmetro id',async () => {		
		const resultCreated =  await testServer.post('/cidades').send({nome:'paulista'});
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);
		
		const resDeleted =  await testServer.delete(`/cidades/${resultCreated.body}`);
		expect(resDeleted.statusCode).toEqual(StatusCodes.NO_CONTENT);
		
		const resGetById =  await testServer.get(`/cidades/${resultCreated.body}`);
		expect(resGetById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resGetById.body).not.toHaveProperty('nome','paulista');
	});
	
	it('Tentar apagar uma cidade que não existe',async () => {		
		const resDeleted =  await testServer.delete('/cidades/99999');
		expect(resDeleted.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resDeleted.body).toHaveProperty('errors.default');

	});
	
	it('Parâmetro id deve ser um Number',async () => {		
		const resDeleted = await testServer.delete('/cidades/test');

		expect(resDeleted.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resDeleted.body)
			.toHaveProperty('errors.params.id','Formato digitado é invalido');		
	});
	
	it('Parâmetro id deve ser um inteiro',async () => {		
		const resDeleted =  await testServer.delete('/cidades/1.2');	

		expect(resDeleted.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resDeleted.body)
			.toHaveProperty('errors.params.id','Deve ser um número inteiro');		
	});
	
	it('Parâmetro id deve ser maior que 0',async () => {		
		const resDeleted =  await testServer.delete('/cidades/0');	

		expect(resDeleted.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resDeleted.body)
			.toHaveProperty('errors.params.id','Deve ser maior que 0');		
	});	
});