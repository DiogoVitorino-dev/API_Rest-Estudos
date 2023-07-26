import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';
import { IUsuario } from '../../src/server/database/models';

const usuarioTest:Omit<IUsuario,'id'> = {
	nome:'test da silva',
	email:'test@outlook.test',
	senha:'test123'
};

describe('Usuarios - SignUp', () => {
	it('Deve realizar cadastro',async () => {
		const resSignUp =  await testServer.post('/cadastrar').send(usuarioTest);

		expect(resSignUp.statusCode).toEqual(StatusCodes.CREATED);
		expect(typeof resSignUp.body).toEqual('number');
	});

	it('Não deve realizar o cadastro com email já cadastro',async () => {
		const resSignUp = await testServer.post('/cadastrar')
			.send({...usuarioTest, email:'duplicado@outlook.test'});

		expect(resSignUp.statusCode).toEqual(StatusCodes.CREATED);
		expect(typeof resSignUp.body).toEqual('number');

		const resSignUpDuplicado =  await testServer.post('/cadastrar')
			.send({...usuarioTest, email:'duplicado@outlook.test'});

		expect(resSignUpDuplicado.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(resSignUpDuplicado.body).toHaveProperty('errors.default');
	});

	// body
	it('Não deve realizar o cadastro com a propriedade email com formato inválido',async () => {
		const resSignUp = await testServer.post('/cadastrar')
			.send({...usuarioTest, email:'test outlook.test'});

		expect(resSignUp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resSignUp.body).toHaveProperty('errors.body.email');
	});

	it('Não deve realizar o cadastro com a propriedade email muito grande',
		async () => {
			let overflow = '';
			for (let count = 1; count <= 255; count++)
				overflow += 't';

			overflow += '@outlook.test';

			const resSignUp = await testServer.post('/cadastrar')
				.send({...usuarioTest, email:overflow});

			expect(resSignUp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resSignUp.body).toHaveProperty('errors.body.email');
		});

	it('Não deve realizar o cadastro com a propriedade senha muito grande',
		async () => {
			let overflow = '';
			for (let count = 1; count <= 33; count++)
				overflow += 't';

			const resSignUp = await testServer.post('/cadastrar')
				.send({...usuarioTest, senha:overflow});

			expect(resSignUp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resSignUp.body).toHaveProperty('errors.body.senha');
		});

	it('Não deve realizar o cadastro com a propriedade nome muito grande',
		async () => {
			let overflow = '';
			for (let count = 1; count <= 33; count++)
				overflow += 't';

			const resSignUp = await testServer.post('/cadastrar')
				.send({...usuarioTest, nome:overflow});

			expect(resSignUp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resSignUp.body).toHaveProperty('errors.body.nome');
		});

	it('Não deve realizar o cadastro com a propriedade email diferente de String',async () => {
		const resSignUp = await testServer.post('/cadastrar')
			.send({...usuarioTest, email:{}});

		expect(resSignUp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resSignUp.body).toHaveProperty('errors.body.email');
	});

	it('Não deve realizar o cadastro com a propriedade email muito curto',async () => {
		const resSignUp = await testServer.post('/cadastrar')
			.send({...usuarioTest, email:'L@ma'});

		expect(resSignUp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resSignUp.body).toHaveProperty('errors.body.email');
	});

	it('Não deve realizar o cadastro com a propriedade senha muito curto',async () => {
		const resSignUp = await testServer.post('/cadastrar')
			.send({...usuarioTest, senha:'errad'});

		expect(resSignUp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resSignUp.body).toHaveProperty('errors.body.senha');
	});

	it('Não deve realizar o cadastro com a propriedade nome muito curto',
		async () => {
			const resSignUp = await testServer.post('/cadastrar')
				.send({...usuarioTest, nome:'te'});

			expect(resSignUp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(resSignUp.body).toHaveProperty('errors.body.nome');
		});

	it('Não deve realizar o cadastro sem as propriedades email,senha,nome',async () => {
		const resSignUp = await testServer.post('/cadastrar').send({});

		expect(resSignUp.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resSignUp.body).toHaveProperty('errors.body.email');
		expect(resSignUp.body).toHaveProperty('errors.body.senha');
		expect(resSignUp.body).toHaveProperty('errors.body.nome');
	});
});