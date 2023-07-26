import * as create from './Create';
import * as updateById from './UpdateById';
import * as getById from './GetById';
import * as getAll from './GetAll';
import * as deleteById from './DeleteById';
import * as count from './Count';

export const PessoasProvider = {
	...create,
	...getAll,
	...getById,
	...updateById,
	...deleteById,
	...count,
};
