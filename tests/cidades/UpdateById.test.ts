import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - UpdateById', () => {
	it('Modificar um registro',async () => {	
		const resultCreated =  await testServer.post('/cidades').send({nome:'paulista'});
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);

		const resUpdateById =  await testServer.put(`/cidades/${resultCreated.body}`).send({ nome: 'paulista' });
		expect(resUpdateById.statusCode).toEqual(StatusCodes.NO_CONTENT);			
	});

	it('Tentar modificar uma cidade que não existe',async () => {		
		const resUpdateById =  await testServer.put('/cidades/99999').send({ nome: 'paulista' });
		expect(resUpdateById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resUpdateById.body).toHaveProperty('errors.default');
	});

	// body
	it('Não deve modificar o registro sem a propriedade nome',async () => {		
		const resUpdateById =  await testServer.put('/cidades/1').send({ nomeCidade: 'paulita' });	

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body)
			.toHaveProperty('errors.body.nome','Este campo é obrigatório');		
	});
	
	it('Não deve modificar o registro com propriedade nome menor 3 caracteres',async () => {		
		const resUpdateById =  await testServer.put('/cidades/1').send({ nome: 'pa' });	

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body)
			.toHaveProperty('errors.body.nome','Deve ter pelo menos 3 caracteres');		
	});	
	
	it('Não deve modificar o registro com tipo da propriedade nome diferente de String',async () => {
		const resultShouldThrowError =  await testServer.put('/cidades/1')
			.send({ nome: {cidade:'paulista'} });	

		expect(resultShouldThrowError.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resultShouldThrowError.body)
			.toHaveProperty('errors.body.nome','Formato digitado é invalido');
	});
	
	// param id
	it('Parâmetro id deve ser um Number',async () => {		
		const resUpdateById = await testServer.put('/cidades/test').send({ nome: 'paulista' });

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body)
			.toHaveProperty('errors.params.id','Formato digitado é invalido');		
	});
	
	it('Parâmetro id deve ser um inteiro',async () => {		
		const resUpdateById =  await testServer.put('/cidades/1.2').send({ nome: 'paulista' });	

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body)
			.toHaveProperty('errors.params.id','Deve ser um número inteiro');		
	});
	
	it('Parâmetro id deve ser maior que 0',async () => {		
		const resUpdateById =  await testServer.put('/cidades/0').send({ nome: 'paulista' });	

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body)
			.toHaveProperty('errors.params.id','Deve ser maior que 0');		
	});
});