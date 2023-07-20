import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - Create', () => {
	it('Cria registro',async () => {		
		const resCreate =  await testServer.post('/cidades').send({ nome: 'paulista' });
		expect(resCreate.statusCode).toEqual(StatusCodes.CREATED);
		expect(typeof resCreate.body).toEqual('number');		
	});
	
	it('Não deve criar registro sem a propriedade nome',async () => {		
		const resCreate =  await testServer.post('/cidades').send({ nomeCidade: 'paulita' });	

		expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resCreate.body)
			.toHaveProperty('errors.body.nome','Este campo é obrigatório');		
	});
	
	it('Não deve criar registro com propriedade nome menor 3 caracteres',async () => {		
		const resCreate =  await testServer.post('/cidades').send({ nome: 'pa' });	

		expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resCreate.body)
			.toHaveProperty('errors.body.nome','Deve ter pelo menos 3 caracteres');		
	});	
	
	it('Não deve criar registro com tipo da propriedade nome diferente de String',async () => {
		const resCreate =  await testServer.post('/cidades')
			.send({ nome: {cidade:'paulista'} });	

		expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resCreate.body)
			.toHaveProperty('errors.body.nome','Formato digitado é invalido');
	});		
});