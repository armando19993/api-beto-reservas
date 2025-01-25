const express = require('express');
const {
  createReserva,
  getAllReservas,
  getReservaById,
  updateReserva,
  deleteReserva,
} = require('../controllers/reservaController');
const authenticate = require('../middlewares/authMiddleware'); // Middleware de autenticación

const router = express.Router();

// Aplicar el middleware de autenticación a todas las rutas de reservas
router.use(authenticate);

// Rutas para Reservas
router.post('/reservas', createReserva);
router.get('/reservas', getAllReservas);
router.get('/reservas/:id', getReservaById);
router.put('/reservas/:id', updateReserva);
router.delete('/reservas/:id', deleteReserva);

module.exports = router;