const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res) => {
  const { user, password, nombre, tipo, status, imagen, fechaNacimiento } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
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
    res.status(400).json({ error: 'User already exists' });
  }
};

const login = async (req, res) => {
  const { user, password } = req.body;

  const foundUser = await prisma.user.findUnique({ where: { user } });

  if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: foundUser.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ foundUser, token });
};

module.exports = { register, login };