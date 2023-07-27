import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - DeleteById', () => {
	let accessToken = '';
	beforeAll(async () => {
		await testServer.post('/cadastrar')
			.send({nome:'test', email:'gettoken@outlook.com', senha:'123456'});

		const {body} = await testServer.post('/entrar')
			.send({email:'gettoken@outlook.com', senha:'123456'});

		accessToken = body.accessToken;
	});

	it('Deve apagar uma cidade pelo parâmetro id',async () => {
		const resultCreated =  await testServer.post('/cidades').set({Authorization: `Bearer ${accessToken}`}).send({nome:'paulista'});
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);

		const resDeleted =  await testServer.delete(`/cidades/${resultCreated.body}`).set({Authorization: `Bearer ${accessToken}`});
		expect(resDeleted.statusCode).toEqual(StatusCodes.NO_CONTENT);

		const resGetById =  await testServer.get(`/cidades/${resultCreated.body}`).set({Authorization: `Bearer ${accessToken}`});
		expect(resGetById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resGetById.body).not.toHaveProperty('nome','paulista');
	});

	it('Tentar apagar uma cidade que não existe',async () => {
		const resDeleted =  await testServer.delete('/cidades/99999').set({Authorization: `Bearer ${accessToken}`});
		expect(resDeleted.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resDeleted.body).toHaveProperty('errors.default');

	});

	it('Parâmetro id deve ser um Number',async () => {
		const resDeleted = await testServer.delete('/cidades/test').set({Authorization: `Bearer ${accessToken}`});

		expect(resDeleted.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resDeleted.body)
			.toHaveProperty('errors.params.id');
	});

	it('Parâmetro id deve ser um inteiro',async () => {
		const resDeleted =  await testServer.delete('/cidades/1.2').set({Authorization: `Bearer ${accessToken}`});

		expect(resDeleted.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resDeleted.body)
			.toHaveProperty('errors.params.id');
	});

	it('Parâmetro id deve ser maior que 0',async () => {
		const resDeleted =  await testServer.delete('/cidades/0').set({Authorization: `Bearer ${accessToken}`});

		expect(resDeleted.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resDeleted.body)
			.toHaveProperty('errors.params.id');
	});
});