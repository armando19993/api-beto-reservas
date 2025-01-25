const express = require('express');
const {
  createCliente,
  getAllClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
} = require('../controllers/clienteController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);

// Rutas para Clientes
router.post('/clientes', createCliente); 
router.get('/clientes', getAllClientes); 
router.get('/clientes/:id', getClienteById);
router.put('/clientes/:id', updateCliente); 
router.delete('/clientes/:id', deleteCliente); 

module.exports = router;