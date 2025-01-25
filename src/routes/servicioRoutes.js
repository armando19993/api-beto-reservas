const express = require('express');
const {
  createServicio,
  getAllServicios,
  getServicioById,
  updateServicio,
  deleteServicio,
} = require('../controllers/servicioController');
const authenticate = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authenticate);

router.post('/servicios', createServicio);
router.get('/servicios', getAllServicios);
router.get('/servicios/:id', getServicioById);
router.put('/servicios/:id', updateServicio);
router.delete('/servicios/:id', deleteServicio);

module.exports = router;