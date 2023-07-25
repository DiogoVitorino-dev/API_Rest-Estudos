import { Router } from 'express';
import { CidadesController, PessoaController } from '../controllers';

const router = Router();

router.get('/',(_,res) => {
	return res.send('ola');
});

router.get('/cidades',CidadesController.getAllValidation, CidadesController.getAll);
router.get('/cidades/:id',CidadesController.getByIdValidation, CidadesController.getById);
router.post('/cidades',CidadesController.createValidation, CidadesController.create);
router.put('/cidades/:id',CidadesController.updateByIdValidation, CidadesController.updateById);
router.delete('/cidades/:id',CidadesController.deleteByIdValidation, CidadesController.deleteById);

router.get('/pessoas',PessoaController.getAllValidation, PessoaController.getAll);
router.get('/pessoas/:id',PessoaController.getByIdValidation, PessoaController.getById);
router.post('/pessoas',PessoaController.createValidation, PessoaController.create);
router.put('/pessoas/:id',PessoaController.updateByIdValidation, PessoaController.updateById);
router.delete('/pessoas/:id',PessoaController.deleteByIdValidation, PessoaController.deleteById);

export {router};