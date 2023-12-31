import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

interface IBodyTest {
	nomeCompleto?:string
	email?: string
	cidadeid?: number
}

describe('Pessoas - UpdateById', () => {
	let bodyTest:IBodyTest = {};
	let cidadeid = 1;

	let accessToken = '';
	beforeAll(async () => {
		await testServer.post('/cadastrar')
			.send({nome:'test', email:'gettoken@outlook.com', senha:'123456'});

		const {body} = await testServer.post('/entrar')
			.send({email:'gettoken@outlook.com', senha:'123456'});

		accessToken = body.accessToken;

		const resPost = await testServer.post('/cidades')
			.set({Authorization: `Bearer ${accessToken}`}).send({ nome: 'paulista' });
		cidadeid = resPost.body;
	});

	beforeEach(() => {
		bodyTest = {
			nomeCompleto: 'teste da silva',
			email: 'teste@outlook.test',
			cidadeid
		};
	});

	it('Modificar um registro',async () => {
		const resultCreated =  await testServer.post('/pessoas')
			.set({Authorization: `Bearer ${accessToken}`}).send(bodyTest);
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);

		const resUpdateById =  await testServer.put(`/pessoas/${resultCreated.body}`)
			.set({Authorization: `Bearer ${accessToken}`})
			.send({...bodyTest, nomeCompleto: 'test' });
		expect(resUpdateById.statusCode).toEqual(StatusCodes.NO_CONTENT);

		const resGetById =  await testServer.get(`/pessoas/${resultCreated.body}`)
			.set({Authorization: `Bearer ${accessToken}`});
		expect(resGetById.body).toHaveProperty('nomeCompleto','test');
	});

	it('Não deve modificar um registro sem o token de validação na requisição',async () => {
		const resultCreated =  await testServer.post('/pessoas')
			.set({Authorization: `Bearer ${accessToken}`})
			.send({...bodyTest, email:'token@outlook.com'});
		expect(resultCreated.statusCode).toEqual(StatusCodes.CREATED);

		const resUpdateById =  await testServer.put(`/pessoas/${resultCreated.body}`)
			.send({...bodyTest, nomeCompleto: 'test' });
		expect(resUpdateById.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		expect(resUpdateById.body).toHaveProperty('errors.default');
	});

	it('Tentar modificar um registro que não existe',async () => {
		const resUpdateById =  await testServer.put('/pessoas/99999')
			.set({Authorization: `Bearer ${accessToken}`})
			.send({...bodyTest, nomeCompleto: 'test' });

		expect(resUpdateById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resUpdateById.body).toHaveProperty('errors.default');
	});

	// body
	it('Não deve modificar o registro sem a propriedade nomeCompleto, email, cidadeid',
		async () => {
			const resUpdateById =  await testServer.put('/pessoas/1')
				.set({Authorization: `Bearer ${accessToken}`}).send({});

			expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resUpdateById.body).toHaveProperty('errors.body.nomeCompleto');
			expect(resUpdateById.body).toHaveProperty('errors.body.email');
			expect(resUpdateById.body).toHaveProperty('errors.body.cidadeid');
		});

	it('Não deve modificar o registro com propriedade nomeCompleto menor 3 caracteres',
		async () => {
			const resUpdateById =  await testServer.put('/pessoas/1')
				.set({Authorization: `Bearer ${accessToken}`})
				.send({...bodyTest, nomeCompleto:'12' });

			expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resUpdateById.body).toHaveProperty('errors.body.nomeCompleto');
		});

	it('Não deve modificar o registro com tipo das propriedades nomeCompleto, email diferente de String',
		async () => {
			const resUpdateById =  await testServer.put('/pessoas/1')
				.set({Authorization: `Bearer ${accessToken}`})
				.send({...bodyTest, nomeCompleto:{}, email:{}});

			expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resUpdateById.body).toHaveProperty('errors.body.nomeCompleto');
			expect(resUpdateById.body).toHaveProperty('errors.body.email');
		});

	it('Não deve modificar o registro com tipo da propriedade cidadeid diferente de number e numero inteiro',
		async () => {
			const resUpdateById =  await testServer.put('/pessoas/1')
				.set({Authorization: `Bearer ${accessToken}`})
				.send({...bodyTest, cidadeid:'test'});

			expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resUpdateById.body).toHaveProperty('errors.body.cidadeid');

			const resIntegerUpdateById =  await testServer.put('/pessoas/1')
				.set({Authorization: `Bearer ${accessToken}`})
				.send({...bodyTest, cidadeid:1.5});

			expect(resIntegerUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resIntegerUpdateById.body).toHaveProperty('errors.body.cidadeid');
		});

	it('Não deve modificar o registro com tipo da propriedade cidadeid menor 1',
		async () => {
			const resUpdateById =  await testServer.put('/pessoas/1')
				.set({Authorization: `Bearer ${accessToken}`})
				.send({...bodyTest, cidadeid: -1});

			expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resUpdateById.body).toHaveProperty('errors.body.cidadeid');
		});

	it('Não deve modificar o registro com a propriedade email com formato inválido',
		async () => {
			const resUpdateById =  await testServer.put('/pessoas/1')
				.set({Authorization: `Bearer ${accessToken}`})
				.send({...bodyTest, email:'asasdwadqwasasasaxz.com'});

			expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resUpdateById.body).toHaveProperty('errors.body.email');
		});

	it('Não deve modificar o registro com propriedade email maior 255 caracteres',
		async () => {
			bodyTest.email = '';
			for (let count = 1; count <= 256; count++) bodyTest.email += 0;

			const resCreate =  await testServer.put('/pessoas/1')
				.set({Authorization: `Bearer ${accessToken}`}).send(bodyTest);

			expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resCreate.body).toHaveProperty('errors.body.email');
		});

	it('Não deve modificar o registro com propriedade nomeCompleto maior 80 caracteres',
		async () => {
			bodyTest.nomeCompleto = '';
			for (let count = 1; count <= 81; count++)	bodyTest.nomeCompleto += 0;

			const resCreate =  await testServer.put('/pessoas/1')
				.set({Authorization: `Bearer ${accessToken}`}).send(bodyTest);

			expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resCreate.body).toHaveProperty('errors.body.nomeCompleto');
		});

	// param id
	it('Parâmetro id deve ser um Number',async () => {
		const resUpdateById = await testServer.put('/pessoas/test')
			.set({Authorization: `Bearer ${accessToken}`}).send(bodyTest);

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body).toHaveProperty('errors.params.id');
	});

	it('Parâmetro id deve ser um inteiro',async () => {
		const resUpdateById =  await testServer.put('/pessoas/1.2')
			.set({Authorization: `Bearer ${accessToken}`}).send(bodyTest);

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body).toHaveProperty('errors.params.id');
	});

	it('Parâmetro id deve ser maior que 0',async () => {
		const resUpdateById =  await testServer.put('/pessoas/0')
			.set({Authorization: `Bearer ${accessToken}`}).send(bodyTest);

		expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resUpdateById.body).toHaveProperty('errors.params.id');
	});
});