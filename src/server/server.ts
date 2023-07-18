import Express from 'express';

const server = Express();

interface teste {

}

server.get('/',(req,res) => {
	return res.send('ola');
});

export {server};