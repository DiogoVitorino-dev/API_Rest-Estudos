import { Knex } from './server/database/knex';
import { server } from './server/server';

const startServer = () => server.listen(process.env.PORT || 3333, () => console.log('App funcionando'));


if (process.env.IS_LOCALHOST !== 'true')
	Knex.migrate.latest()
		.then(async ()=> await Knex.seed.run())
		.catch(error => console.log(error))
		.finally(() => startServer());

else
	startServer();
