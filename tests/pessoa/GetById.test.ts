import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

interface IBodyTest {
	nomeCompleto?:string
	email?: string
	cidadeid?: number
}

describe('Pessoas - GetById', () => {
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

	it('Deve retorna pessoa pelo parâmetro id',async () => {
		const resultCreated =  await testServer.post('/pessoas')
			.set({Authorization: `Bearer ${accessToken}`}).send(bodyTest);
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);

		const resGetById =  await testServer.get(`/pessoas/${resultCreated.body}`)
			.set({Authorization: `Bearer ${accessToken}`});
		expect(resGetById.statusCode).toEqual(StatusCodes.OK);
		expect(resGetById.body).toHaveProperty('nomeCompleto','teste da silva');
	});

	it('Não deve retorna pessoa sem o token de validação na requisição',async () => {
		const resultCreated =  await testServer.post('/pessoas')
			.set({Authorization: `Bearer ${accessToken}`})
			.send({...bodyTest, email:'token@outlook.com'});
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);

		const resGetById =  await testServer.get(`/pessoas/${resultCreated.body}`);
		expect(resGetById.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		expect(resGetById.body).toHaveProperty('errors.default');
	});

	it('Tenta retornar um registro que não existe',async () => {
		const resGetById =  await testServer.get('/pessoas/99999')
			.set({Authorization: `Bearer ${accessToken}`});
		expect(resGetById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resGetById.body).toHaveProperty('errors.default');
	});

	it('Parâmetro id deve ser um Number',async () => {
		const resGetById = await testServer.get('/pessoas/test')
			.set({Authorization: `Bearer ${accessToken}`});

		expect(resGetById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resGetById.body).toHaveProperty('errors.params.id');
	});

	it('Parâmetro id deve ser um inteiro',async () => {
		const resGetById =  await testServer.get('/pessoas/1.2')
			.set({Authorization: `Bearer ${accessToken}`});

		expect(resGetById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resGetById.body).toHaveProperty('errors.params.id');
	});

	it('Parâmetro id deve ser maior que 0',async () => {
		const resGetById =  await testServer.get('/pessoas/0')
			.set({Authorization: `Bearer ${accessToken}`});

		expect(resGetById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resGetById.body).toHaveProperty('errors.params.id');
	});
});