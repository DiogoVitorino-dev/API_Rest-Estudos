import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

interface IBodyTest {
	nomeCompleto?:string
	email?: string
	cidadeid?: number
}

describe('Pessoas - Create', () => {
	let bodyTest:IBodyTest = {};
	let cidadeid = 1;

	beforeAll(async () => {
		const resPost = await testServer.post('/cidades').send({ nome: 'paulista' });
		cidadeid = resPost.body;
	});

	beforeEach(() => {
		bodyTest = {
			nomeCompleto: 'teste da silva',
			email: 'teste@outlook.test',
			cidadeid
		};
	});

	it('Cria registro',async () => {
		const resCreate =  await testServer.post('/pessoas').send(bodyTest);
		expect(resCreate.statusCode).toEqual(StatusCodes.CREATED);
		expect(typeof resCreate.body).toEqual('number');

		const resGetById =  await testServer.get(`/pessoas/${resCreate.body}`);
		expect(resGetById.statusCode).toEqual(StatusCodes.OK);
		expect(resGetById.body).toHaveProperty('nomeCompleto','teste da silva');
	});

	it('Não deve cria registro com email ja cadastrado',async () => {
		const resCreate =  await testServer.post('/pessoas')
			.send({...bodyTest, email:'duplicado@test.com'});
		expect(resCreate.statusCode).toEqual(StatusCodes.CREATED);

		const resCreateDuplicado =  await testServer.post('/pessoas')
			.send({...bodyTest, email:'duplicado@test.com'});
		expect(resCreateDuplicado.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resCreateDuplicado.body).toHaveProperty('errors.default');
	});

	it('Não deve criar registro sem as propriedades nomeCompleto, email, cidadeid',
		async () => {
			const resCreate =  await testServer.post('/pessoas').send({});

			expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resCreate.body).toHaveProperty('errors.body.nomeCompleto');
			expect(resCreate.body).toHaveProperty('errors.body.email');
			expect(resCreate.body).toHaveProperty('errors.body.cidadeid');
		});

	it('Não deve criar registro com propriedade nomeCompleto maior 80 caracteres',
		async () => {
			bodyTest.nomeCompleto = '';
			for (let count = 1; count <= 81; count++)	bodyTest.nomeCompleto += 0;

			const resCreate =  await testServer.post('/pessoas').send(bodyTest);

			expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resCreate.body).toHaveProperty('errors.body.nomeCompleto');
		});

	it('Não deve criar registro com propriedade nomeCompleto menor 3 caracteres',
		async () => {
			bodyTest.nomeCompleto = '12';
			const resCreate =  await testServer.post('/pessoas').send(bodyTest);

			expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resCreate.body).toHaveProperty('errors.body.nomeCompleto');
		});

	it('Não deve criar registro com propriedade email maior 255 caracteres',
		async () => {
			bodyTest.email = '';
			for (let count = 1; count <= 256; count++) bodyTest.email += 0;

			const resCreate =  await testServer.post('/pessoas').send(bodyTest);

			expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resCreate.body)
				.toHaveProperty('errors.body.email');
		});

	it('Não deve modificar o registro com a propriedade email com formato inválido',
		async () => {
			const resUpdateById =  await testServer.put('/pessoas/1')
				.send({...bodyTest, email:'asasdwadqwasasasaxz.com'});

			expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resUpdateById.body).toHaveProperty('errors.body.email');
		});

	it('Não deve criar registro com tipo das propriedades nomeCompleto, email diferente de String',
		async () => {
			const resCreate =  await testServer.post('/pessoas').send({
				...bodyTest,
				nomeCompleto:{},
				email:{}
			});

			expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resCreate.body).toHaveProperty('errors.body.nomeCompleto');
			expect(resCreate.body).toHaveProperty('errors.body.email');
		});

	it('Não deve criar registro com tipo da propriedade cidadeid diferente de number',
		async () => {
			const resCreate =  await testServer.post('/pessoas').send({
				...bodyTest,
				cidadeid:'test'
			});

			expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resCreate.body).toHaveProperty('errors.body.cidadeid');
		});

	it('Não deve criar registro com propriedade cidadeid diferente de numero inteiro',
		async () => {
			const resCreate =  await testServer.post('/pessoas').send({
				...bodyTest,
				cidadeid:1.5
			});

			expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resCreate.body).toHaveProperty('errors.body.cidadeid');
		});

	it('Não deve criar registro com propriedade cidadeid menor que 1',
		async () => {
			const resCreate =  await testServer.post('/pessoas').send({
				...bodyTest,
				cidadeid: -1
			});

			expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resCreate.body).toHaveProperty('errors.body.cidadeid');
		});

	it('Não deve criar registro com o valor da propriedade cidadeid não seja encontrada no banco',
		async () => {
			const resCreate =  await testServer.post('/pessoas').send({
				...bodyTest,
				cidadeid: 9989898
			});

			expect(resCreate.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		});
});