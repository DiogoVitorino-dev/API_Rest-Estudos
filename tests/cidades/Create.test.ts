import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';



describe('Cidades - Create', () => {
	let accessToken = '';
	beforeAll(async () => {
		await testServer.post('/cadastrar')
			.send({nome:'test', email:'gettoken@outlook.com', senha:'123456'});

		const {body} = await testServer.post('/entrar')
			.send({email:'gettoken@outlook.com', senha:'123456'});

		accessToken = body.accessToken;
	});

	it('Cria registro',async () => {
		const resCreate =  await testServer.post('/cidades').set({Authorization: `Bearer ${accessToken}`}).send({ nome: 'paulista' });
		expect(resCreate.statusCode).toEqual(StatusCodes.CREATED);
		expect(typeof resCreate.body).toEqual('number');
	});

	it('Não deve cria registro sem o token de validação na requisição',async () => {
		const resCreate =  await testServer.post('/cidades').send({ nome: 'paulista' });
		expect(resCreate.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		expect(resCreate.body).toHaveProperty('errors.default');
	});

	it('Não deve criar registro sem a propriedade nome',async () => {
		const resCreate =  await testServer.post('/cidades').set({Authorization: `Bearer ${accessToken}`}).send({ nomeCidade: 'paulita' });

		expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resCreate.body)
			.toHaveProperty('errors.body.nome');
	});

	it('Não deve criar registro com propriedade nome menor 3 caracteres',async () => {
		const resCreate =  await testServer.post('/cidades').set({Authorization: `Bearer ${accessToken}`}).send({ nome: 'pa' });

		expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resCreate.body)
			.toHaveProperty('errors.body.nome');
	});

	it('Não deve criar registro com tipo da propriedade nome diferente de String',async () => {
		const resCreate =  await testServer.post('/cidades')
			.set({Authorization: `Bearer ${accessToken}`}).send({ nome: {cidade:'paulista'} });

		expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resCreate.body)
			.toHaveProperty('errors.body.nome');
	});

	it('Não deve criar registro com a propriedade nome possuindo número de caracteres maior que 150',async () => {
		const overflow = '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789.';

		const resCreate =  await testServer.post('/cidades')
			.set({Authorization: `Bearer ${accessToken}`}).send({ nome: overflow });

		expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resCreate.body)
			.toHaveProperty('errors.body.nome');
	});
});