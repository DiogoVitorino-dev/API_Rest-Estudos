import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex) {
	return knex
		.schema
		.createTable(ETableNames.pessoa,table => {
			table.bigIncrements('id').primary().index();
			table.string('nomeCompleto',80).checkLength('<=',80).index().notNullable();
			table.string('email',255).checkLength('<=',255).unique().notNullable();

			table
				.bigInteger('cidadeid')
				.index()
				.notNullable()
				.references('id')
				.inTable(ETableNames.cidade)
				.onUpdate('CASCADE')
				.onDelete('RESTRICT');

			table.comment('Tabela usada para armazenar pessoas');
		}).then(() => {
			console.log(`# create table ${ETableNames.pessoa}`);
		});
}


export async function down(knex: Knex) {
	return knex.schema.dropTable(ETableNames.pessoa)
		.then(() => {
			console.log(`# dropped table ${ETableNames.pessoa}`);
		});
}

