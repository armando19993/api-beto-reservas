const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        publicId: true,
        user: true,
        nombre: true,
        tipo: true,
        status: true,
        imagen: true,
        fechaNacimiento: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener los usuarios' });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        publicId: true,
        user: true,
        nombre: true,
        tipo: true,
        status: true,
        imagen: true,
        fechaNacimiento: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener el usuario' });
  }
};

// Crear un nuevo usuario (solo para ADMIN)
const createUser = async (req, res) => {
  const { user, password, nombre, tipo, status, imagen, fechaNacimiento } = req.body;

  // Validar que el tipo de usuario sea válido
  if (!['ADMIN', 'OPERADOR', 'CLIENTE', 'EMPLEADO'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo de usuario inválido' });
  }

  // Validar que el estado sea válido
  if (!['ACTIVO', 'SUSPENDIDO'].includes(status)) {
    return res.status(400).json({ error: 'Estado de usuario inválido' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash de la contraseña
    const newUser = await prisma.user.create({
      data: {
        user,
        password: hashedPassword,
        nombre,
        tipo,
        status,
        imagen,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
      },
    });
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(400).json({ error: 'Error al crear el usuario', details: error.message });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { user, password, nombre, tipo, status, imagen, fechaNacimiento } = req.body;

  try {
    const data = {};
    if (user) data.user = user;
    if (password) data.password = await bcrypt.hash(password, 10); // Hash de la contraseña
    if (nombre) data.nombre = nombre;
    if (tipo) data.tipo = tipo;
    if (status) data.status = status;
    if (imagen) data.imagen = imagen;
    if (fechaNacimiento) data.fechaNacimiento = new Date(fechaNacimiento);

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el usuario' });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar el usuario' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};