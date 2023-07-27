import { server } from './server/server';

const startServer = () => server.listen(process.env.PORT || 3333, () => console.log('App funcionando'));

startServer();
