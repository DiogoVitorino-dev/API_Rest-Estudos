import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const count = async (filter = ''):Promise<number | Error> => {
	try {
		let [{count}] = await Knex(ETableNames.pessoa)			
			.where('nomeCompleto','like',`%${filter}%`)
			.count<[{count: number}]>('* as count');

		count = Number(count);
		
		if(Number.isInteger(count)) return count;

		return new Error('Erro ao consultar a quantidade total de registros');
	} catch (error) {
		console.log(error);		
		return new Error('Erro ao consultar a quantidade total de registros');
	}
};