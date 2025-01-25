const express = require('express');
const {
  createSede,
  getAllSedes,
  getSedeById,
  updateSede,
  deleteSede,
} = require('../controllers/sedeController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authenticate);

// Rutas para Sedes
router.post('/sedes', createSede);
router.get('/sedes', getAllSedes);
router.get('/sedes/:id', getSedeById);
router.patch('/sedes/:id', updateSede);
router.delete('/sedes/:id', deleteSede);

module.exports = router;