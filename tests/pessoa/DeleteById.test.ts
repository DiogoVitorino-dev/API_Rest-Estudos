import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

interface IBodyTest {
	nomeCompleto?:string
	email?: string
	cidadeid?: number
}

describe('Pessoas - DeleteById', () => {
	let bodyTest:IBodyTest = {};

	beforeAll(async () => {
		const resPost = await testServer.post('/cidades').send({ nome: 'paulista' });
		bodyTest = {
			nomeCompleto: 'teste da silva',
			email: 'teste@outlook.test',
			cidadeid: resPost.body
		};
	});

	it('Deve apagar um registro pelo parâmetro id',async () => {
		const resultCreated =  await testServer.post('/pessoas').send(bodyTest);
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);

		const resDeleted =  await testServer.delete(`/pessoas/${resultCreated.body}`);
		expect(resDeleted.statusCode).toEqual(StatusCodes.NO_CONTENT);

		const resGetById =  await testServer.get(`/pessoas/${resultCreated.body}`);
		expect(resGetById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resGetById.body).not.toHaveProperty('nomeCompleto','teste da silva');
	});

	it('Tentar apagar uma registro que não existe',async () => {
		const resDeleted =  await testServer.delete('/pessoas/99999');
		expect(resDeleted.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resDeleted.body).toHaveProperty('errors.default');

	});

	it('Parâmetro id deve ser um Number',async () => {
		const resDeleted = await testServer.delete('/pessoas/test');

		expect(resDeleted.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resDeleted.body)
			.toHaveProperty('errors.params.id');
	});

	it('Parâmetro id deve ser um inteiro',async () => {
		const resDeleted =  await testServer.delete('/pessoas/1.2');

		expect(resDeleted.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resDeleted.body)
			.toHaveProperty('errors.params.id');
	});

	it('Parâmetro id deve ser maior que 0',async () => {
		const resDeleted =  await testServer.delete('/pessoas/0');

		expect(resDeleted.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resDeleted.body)
			.toHaveProperty('errors.params.id');
	});
});