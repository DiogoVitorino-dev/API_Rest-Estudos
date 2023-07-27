import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - GetById', () => {
	let accessToken = '';
	beforeAll(async () => {
		await testServer.post('/cadastrar')
			.send({nome:'test', email:'gettoken@outlook.com', senha:'123456'});

		const {body} = await testServer.post('/entrar')
			.send({email:'gettoken@outlook.com', senha:'123456'});

		accessToken = body.accessToken;
	});

	it('Deve retorna cidade pelo parâmetro id',async () => {
		const resultCreated =  await testServer.post('/cidades').send({nome:'paulista'})
			.set({Authorization: `Bearer ${accessToken}`});
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);

		const resGetById =  await testServer.get(`/cidades/${resultCreated.body}`)
			.set({Authorization: `Bearer ${accessToken}`});
		expect(resGetById.statusCode).toEqual(StatusCodes.OK);
		expect(resGetById.body).toHaveProperty('nome');
	});

	it('Tenta retornar uma cidade que não existe',async () => {
		const resGetById =  await testServer.get('/cidades/99999').set({Authorization: `Bearer ${accessToken}`});
		expect(resGetById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resGetById.body).toHaveProperty('errors.default');
	});

	it('Parâmetro id deve ser um Number',async () => {
		const resGetById = await testServer.get('/cidades/test').set({Authorization: `Bearer ${accessToken}`});

		expect(resGetById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resGetById.body)
			.toHaveProperty('errors.params.id');
	});

	it('Parâmetro id deve ser um inteiro',async () => {
		const resGetById =  await testServer.get('/cidades/1.2').set({Authorization: `Bearer ${accessToken}`});

		expect(resGetById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resGetById.body)
			.toHaveProperty('errors.params.id');
	});

	it('Parâmetro id deve ser maior que 0',async () => {
		const resGetById =  await testServer.get('/cidades/0').set({Authorization: `Bearer ${accessToken}`});

		expect(resGetById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resGetById.body)
			.toHaveProperty('errors.params.id');
	});
});