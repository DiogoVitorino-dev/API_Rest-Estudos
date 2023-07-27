import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';
import { IUsuario } from '../../src/server/database/models';

const usuarioTest:Omit<IUsuario,'id' | 'nome'> = {
	email:'test@outlook.test',
	senha:'test123'
};

describe('Usuarios - SignIn', () => {

	beforeAll(async () => {
		await testServer.post('/cadastrar').send({
			...usuarioTest,
			nome:'test da silva',
		});
	});

	it('Deve fazer login',async () => {
		const resSignIn =  await testServer.post('/entrar').send(usuarioTest);
		
		expect(resSignIn.statusCode).toEqual(StatusCodes.OK);
		expect(resSignIn.body).toHaveProperty('accessToken');
	});

	it('Não deve realizar login com email errado',async () => {
		const resSignIn =  await testServer.post('/entrar')
			.send({...usuarioTest, email:'errado@outlook.test'});

		expect(resSignIn.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		expect(resSignIn.body).toHaveProperty('errors.default');
	});

	it('Não deve realizar login com senha errada',async () => {
		const resSignIn =  await testServer.post('/entrar')
			.send({...usuarioTest, senha:'errado123'});

		expect(resSignIn.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		expect(resSignIn.body).toHaveProperty('errors.default');
	});

	// body
	it('Não deve realizar login com a propriedade email com formato inválido',async () => {
		const resSignIn = await testServer.post('/entrar')
			.send({...usuarioTest, email:'test outlook.test'});

		expect(resSignIn.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resSignIn.body).toHaveProperty('errors.body.email');
	});

	it('Não deve realizar login com a propriedade email diferente de String',async () => {
		const resSignIn = await testServer.post('/entrar')
			.send({...usuarioTest, email:{}});

		expect(resSignIn.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resSignIn.body).toHaveProperty('errors.body.email');
	});

	it('Não deve realizar login com a propriedade email muito curto',async () => {
		const resSignIn = await testServer.post('/entrar')
			.send({...usuarioTest, email:'L@ma'});

		expect(resSignIn.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resSignIn.body).toHaveProperty('errors.body.email');
	});

	it('Não deve realizar login com a propriedade senha muito curto',async () => {
		const resSignIn = await testServer.post('/entrar')
			.send({...usuarioTest, senha:'errad'});

		expect(resSignIn.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resSignIn.body).toHaveProperty('errors.body.senha');
	});

	it('Não deve realizar login sem as propriedades email,senha',async () => {
		const resSignIn = await testServer.post('/entrar').send({});

		expect(resSignIn.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		expect(resSignIn.body).toHaveProperty('errors.body.email');
		expect(resSignIn.body).toHaveProperty('errors.body.senha');
	});
});