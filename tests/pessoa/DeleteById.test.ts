import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

interface IBodyTest {
	nomeCompleto?:string
	email?: string
	cidadeid?: number
}

describe('Pessoas - DeleteById', () => {
	let bodyTest:IBodyTest = {};

	let accessToken = '';
	beforeAll(async () => {
		await testServer.post('/cadastrar')
			.send({nome:'test', email:'gettoken@outlook.com', senha:'123456'});

		const {body} = await testServer.post('/entrar')
			.send({email:'gettoken@outlook.com', senha:'123456'});

		accessToken = body.accessToken;

		const resPost = await testServer.post('/cidades')
			.set({Authorization: `Bearer ${accessToken}`}).send({ nome: 'paulista' });
		bodyTest = {
			nomeCompleto: 'teste da silva',
			email: 'teste@outlook.test',
			cidadeid: resPost.body
		};
	});

	it('Deve apagar um registro pelo parâmetro id',async () => {
		const resultCreated =  await testServer.post('/pessoas')
			.set({Authorization: `Bearer ${accessToken}`}).send(bodyTest);
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);

		const resDeleted =  await testServer.delete(`/pessoas/${resultCreated.body}`)
			.set({Authorization: `Bearer ${accessToken}`});
		expect(resDeleted.statusCode).toEqual(StatusCodes.NO_CONTENT);

		const resGetById =  await testServer.get(`/pessoas/${resultCreated.body}`)
			.set({Authorization: `Bearer ${accessToken}`});
		expect(resGetById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resGetById.body).not.toHaveProperty('nomeCompleto','teste da silva');
	});

	it('Tentar apagar uma registro que não existe',async () => {
		const resDeleted =  await testServer.delete('/pessoas/99999')
			.set({Authorization: `Bearer ${accessToken}`});
		expect(resDeleted.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resDeleted.body).toHaveProperty('errors.default');

	});

	it('Parâmetro id deve ser um Number',async () => {
		const resDeleted = await testServer.delete('/pessoas/test')
			.set({Authorization: `Bearer ${accessToken}`});

		expect(resDeleted.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resDeleted.body)
			.toHaveProperty('errors.params.id');
	});

	it('Parâmetro id deve ser um inteiro',async () => {
		const resDeleted =  await testServer.delete('/pessoas/1.2')
			.set({Authorization: `Bearer ${accessToken}`});

		expect(resDeleted.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resDeleted.body)
			.toHaveProperty('errors.params.id');
	});

	it('Parâmetro id deve ser maior que 0',async () => {
		const resDeleted =  await testServer.delete('/pessoas/0')
			.set({Authorization: `Bearer ${accessToken}`});

		expect(resDeleted.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resDeleted.body)
			.toHaveProperty('errors.params.id');
	});
});