import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPessoa } from '../../models';

export const create = async (pessoa: Omit<IPessoa,'id'>):Promise<number | Error> => {
	try {
		const [{count}] = await Knex(ETableNames.cidade)
			.where('id','=', pessoa.cidadeid)
			.count<[{count: number}]>('* as count');

		if (count === 0) return new Error('A cidade usada no cadastro não foi encontrado');

		const [result] = await Knex(ETableNames.pessoa).insert(pessoa).returning('id');
		
		if (typeof result === 'object') 
			return result.id;
			
		else if(typeof result === 'number')
			return result;

		return new Error('Erro ao cadastrar o registro');
	} catch (error) {
		console.log(error);		
		return new Error('Erro ao cadastrar o registro');
	}
};