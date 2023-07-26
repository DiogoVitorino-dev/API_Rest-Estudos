import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - UpdateById', () => {
	
	it('Modificar um registro',async () => {	
		const resultCreated =  await testServer.post('/cidades').send({nome:'paulista'});
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);

		const resUpdateById =  await testServer.put(`/cidades/${resultCreated.body}`).send({ nome: 'são paulo' });
		expect(resUpdateById.statusCode).toEqual(StatusCodes.NO_CONTENT);
		
		const resGetById =  await testServer.get(`/cidades/${resultCreated.body}`);
		expect(resGetById.body).toHaveProperty('nome','são paulo');		
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
			.toHaveProperty('errors.body.nome');		
	});
	
	it('Não deve modificar o registro com propriedade nome menor 3 caracteres',async () => {		
		const resUpdateById =  await testServer.put('/cidades/1').send({ nome: 'pa' });	

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body)
			.toHaveProperty('errors.body.nome');		
	});	
	
	it('Não deve modificar o registro com tipo da propriedade nome diferente de String',async () => {
		const resUpdateById =  await testServer.put('/cidades/1')
			.send({ nome: {cidade:'paulista'} });	

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body)
			.toHaveProperty('errors.body.nome');
	});

	it('Não deve criar registro com a propriedade nome possuindo número de caracteres maior que 150',async () => {
		const overflow = '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789.';

		const resCreate =  await testServer.put('/cidades/1')
			.send({ nome: overflow });	

		expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resCreate.body)
			.toHaveProperty('errors.body.nome');
	});	
	
	// param id	
	it('Parâmetro id deve ser um Number',async () => {		
		const resUpdateById = await testServer.put('/cidades/test').send({ nome: 'paulista' });

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body)
			.toHaveProperty('errors.params.id');		
	});
	
	it('Parâmetro id deve ser um inteiro',async () => {		
		const resUpdateById =  await testServer.put('/cidades/1.2').send({ nome: 'paulista' });	

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body)
			.toHaveProperty('errors.params.id');		
	});
	
	it('Parâmetro id deve ser maior que 0',async () => {		
		const resUpdateById =  await testServer.put('/cidades/0').send({ nome: 'paulista' });	

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body)
			.toHaveProperty('errors.params.id');		
	});
});