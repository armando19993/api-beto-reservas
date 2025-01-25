const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);

// Rutas para Usuarios
router.get('/users', getAllUsers); 
router.get('/users/:id', getUserById); 
router.post('/users', createUser); 
router.put('/users/:id', updateUser); 
router.delete('/users/:id', deleteUser);

module.exports = router;