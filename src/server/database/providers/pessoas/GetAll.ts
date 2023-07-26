import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const getAll = async (page:number, limit:number,filter:string) => {
	try {

		const result = await Knex(ETableNames.pessoa)
			.select('*')			
			.orWhere('nomeCompleto','like',`%${filter}%`)			
			.offset(page === 1 ? 0 : limit * page - limit)
			.limit(limit);

		return result;		
	} catch (error) {
		console.log(error);		
		return new Error('Erro ao recuperar os registros');
	}
};