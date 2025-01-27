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
  const { user, password, nombre, tipo, status, imagen, fechaNacimiento, sedeId } = req.body;

  try {
    // Validate required fields
    if (!user || !password || !nombre || !tipo || !status) {
      return res.status(400).json({ 
        error: 'Datos incompletos',
        details: 'Usuario, contraseña, nombre, tipo y estado son campos requeridos'
      });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(user)) {
      return res.status(400).json({ 
        error: 'Nombre de usuario inválido',
        details: 'El usuario debe contener entre 3 y 20 caracteres alfanuméricos o guiones bajos'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Contraseña débil',
        details: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Validate user type
    if (!['ADMIN', 'OPERADOR', 'CLIENTE', 'EMPLEADO'].includes(tipo)) {
      return res.status(400).json({ 
        error: 'Tipo de usuario inválido',
        details: 'El tipo debe ser ADMIN, OPERADOR, CLIENTE o EMPLEADO'
      });
    }

    // Validate user status
    if (!['ACTIVO', 'SUSPENDIDO'].includes(status)) {
      return res.status(400).json({ 
        error: 'Estado de usuario inválido',
        details: 'El estado debe ser ACTIVO o SUSPENDIDO'
      });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { user }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Usuario ya existe',
        details: 'El nombre de usuario ya está registrado'
      });
    }

    // Validate sede if provided
    if (sedeId) {
      const sede = await prisma.sede.findUnique({
        where: { id: sedeId }
      });

      if (!sede) {
        return res.status(400).json({ 
          error: 'Sede inválida',
          details: 'La sede especificada no existe'
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with validated data
    const newUser = await prisma.user.create({
      data: {
        user,
        password: hashedPassword,
        nombre,
        tipo,
        status,
        imagen: imagen || null,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        sedeId: sedeId || null
      },
      include: {
        sede: true // Include sede information in response
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ 
      message: 'Usuario creado exitosamente',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error al crear el usuario:', error);

    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'Error de restricción única',
        details: 'El usuario o algún otro campo único ya existe'
      });
    }

    // Handle date parsing errors
    if (error instanceof Date && isNaN(error)) {
      return res.status(400).json({ 
        error: 'Fecha inválida',
        details: 'El formato de la fecha de nacimiento es inválido'
      });
    }

    res.status(400).json({ 
      error: 'Error al crear el usuario',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { user, password, nombre, tipo, status, imagen, fechaNacimiento, sedeId } = req.body;

  try {
    // First verify if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Build update data object with all provided fields
    const data = {
      ...(user && { user }),
      ...(password && { password: await bcrypt.hash(password, 10) }),
      ...(nombre && { nombre }),
      ...(tipo && { tipo }),
      ...(status && { status }),
      ...(imagen && { imagen }),
      ...(fechaNacimiento && { fechaNacimiento: new Date(fechaNacimiento) }),
      ...(sedeId === null ? { sedeId: null } : sedeId ? { sedeId } : {}),
      updatedAt: new Date(),
    };

    // If no data to update, return early
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
    }

    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      include: {
        sede: true  // Include sede information in response
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.status(200).json({ 
      message: 'Usuario actualizado exitosamente',
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }

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