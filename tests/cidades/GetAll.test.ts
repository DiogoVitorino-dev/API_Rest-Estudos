import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - GetAll', () => {	
	beforeAll(async () => {
		for (let count = 1; count <= 5; count++){
			// alternador
			// recife - id impar / paulista - id par
			if(count % 2 === 0)
				await testServer.post('/cidades').send({nome: 'paulista'});
			else
				await testServer.post('/cidades').send({nome: 'recife'});		}
	});

	it('Deve retorna todos os registros',async () => {
		const resGetAll =  await testServer.get('/cidades');
		expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
		expect(Number(resGetAll.header['x-total-count'])).toBeGreaterThan(0);
		expect(resGetAll.body.length).toBeGreaterThan(0);
	});
	
	it('Deve retorna apenas 2 registros quando o Query Param limit é definido 2',
		async () => {		
			const resGetAll = await testServer.get('/cidades').query({
				page:1,
				limit:2,			
			});

			expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
			expect(resGetAll.body).toContainEqual({id:2,nome:'paulista'});
			expect(resGetAll.body).not.toContainEqual({id:4,nome:'paulista'});
		}
	);
	
	it('Deve retorna os registros que ultrapassarem o Query Param limit apenas na página seguinte',
		async () => {		
			const resGetAll = await testServer.get('/cidades').query({
				page:2,
				limit:2,	
			});

			expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
			expect(resGetAll.body).toContainEqual({id:4,nome:'paulista'});
			expect(resGetAll.body).not.toContainEqual({id:2,nome:'paulista'});
		}
	);
	
	it('Deve retorna apenas os registros filtrados pelo Query Param filter',
		async () => {		
			const resGetAll = await testServer.get('/cidades').query({
				page:1,
				filter:'rec'
			});

			expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
			expect(resGetAll.body).toContainEqual({id:1,nome:'recife'});
			expect(resGetAll.body).not.toContainEqual({id:2,nome:'paulista 2'});
		}
	);
	
	it('Query params - page,limit e id devem ser Number',async () => {		
		const resGetAll = await testServer.get('/cidades').query({
			page:'test',
			limit:'test',
			id:'test'
		});

		expect(resGetAll.statusCode).toEqual(StatusCodes.BAD_REQUEST);

		expect(resGetAll.body).toHaveProperty('errors.query.page');
			
		expect(resGetAll.body).toHaveProperty('errors.query.limit');
			
		expect(resGetAll.body).toHaveProperty('errors.query.id');
	});
	
	it('Query params - page,limit e id devem ser inteiros',async () => {		
		const resGetAll = await testServer.get('/cidades').query({
			page:1.5,
			limit:25.7,
			id:1.1
		});

		expect(resGetAll.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		
		expect(resGetAll.body).toHaveProperty('errors.query.page');
			
		expect(resGetAll.body).toHaveProperty('errors.query.limit');

		expect(resGetAll.body).toHaveProperty('errors.query.id');
	});
	
	it('Query params - page,limit devem ser maior que 0',async () => {		
		const resGetAll = await testServer.get('/cidades').query({
			page:0,
			limit:-1,
		});

		expect(resGetAll.statusCode).toEqual(StatusCodes.BAD_REQUEST);
		
		expect(resGetAll.body).toHaveProperty('errors.query.page');
			
		expect(resGetAll.body).toHaveProperty('errors.query.limit');		
	});	
});