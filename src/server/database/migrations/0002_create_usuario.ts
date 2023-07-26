import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
	return knex
		.schema
		.createTable(ETableNames.usuario, table => {
			table.bigIncrements('id').primary().index();
			table.string('nome',32).checkLength('>=',3).checkLength('<=',32).notNullable();
			table.string('email',255).checkLength('>=',5).checkLength('<=',255).index().unique().notNullable();
			table.string('senha',32).notNullable().checkLength('>=',6).checkLength('<=',255);

			table.comment('Tabela usada para armazenar usuários');
		}).then(() => {
			console.log(`# create table ${ETableNames.usuario}`);
		});
}


export async function down(knex: Knex) {
	return knex.schema.dropTable(ETableNames.usuario)
		.then(() => {
			console.log(`# dropped table ${ETableNames.usuario}`);
		});
}

