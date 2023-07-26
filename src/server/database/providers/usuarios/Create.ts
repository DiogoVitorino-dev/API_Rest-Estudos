import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IUsuario } from '../../models';

export const create = async (usuario: Omit<IUsuario,'id'>):Promise<number | Error> => {
	try {
		usuario.senha = String(usuario.senha);
		const [result] = await Knex(ETableNames.usuario).insert(usuario).returning('id');

		if (typeof result === 'object')
			return result.id;

		else if(typeof result === 'number')
			return result;

		return new Error('Erro ao cadastrar o registro');
	} catch (error:any) {

		switch (error.code) {
			case 'SQLITE_CONSTRAINT':
				return new Error('O email ja cadastro');
			default:
				return new Error('Erro ao cadastrar o registro');
		}

	}
};