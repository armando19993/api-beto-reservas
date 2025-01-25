const express = require('express');
const {
  createPago,
  getAllPagos,
  getPagoById,
  updatePago,
  deletePago,
} = require('../controllers/pagoController');
const authenticate = require('../middlewares/authMiddleware'); // Middleware de autenticación

const router = express.Router();

// Aplicar el middleware de autenticación a todas las rutas de pagos
router.use(authenticate);

// Rutas para Pagos
router.post('/pagos', createPago);
router.get('/pagos', getAllPagos);
router.get('/pagos/:id', getPagoById);
router.put('/pagos/:id', updatePago);
router.delete('/pagos/:id', deletePago);

module.exports = router;