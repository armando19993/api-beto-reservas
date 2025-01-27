const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear un nuevo cliente
const createCliente = async (req, res) => {
  const { name, phone } = req.body;

  try {
    const clienteExistente = await prisma.cliente.findFirst({
      where: { phone },
    });

    if (clienteExistente) {
      return res.status(400).json({ error: "El teléfono ya está registrado" });
    }

    // Crear el cliente
    const nuevoCliente = await prisma.cliente.create({
      data: {
        name,
        phone,
      },
    });

    res.status(201).json({ cliente: nuevoCliente });
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    res
      .status(400)
      .json({ error: "Error al crear el cliente", details: error.message });
  }
};

// Obtener todos los clientes
const getAllClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.status(200).json({ clientes });
  } catch (error) {
    res.status(400).json({ error: "Error al obtener los clientes" });
  }
};

// Obtener un cliente por ID
const getClienteById = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.status(200).json({ cliente });
  } catch (error) {
    res.status(400).json({ error: "Error al obtener el cliente" });
  }
};

// Actualizar un cliente
const updateCliente = async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;

  const validate = await prisma.cliente.findFirst({ where: { phone } });
  if (validate && validate.id !== id) {
    return res.status(400).json({ error: "El teléfono ya está registrado" });
  }

  try {
    const clienteActualizado = await prisma.cliente.update({
      where: { id },
      data: {
        name,
        phone,
      },
    });

    res.status(200).json({ cliente: clienteActualizado });
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar el cliente" });
  }
};

// Eliminar un cliente
const deleteCliente = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.cliente.delete({ where: { id } });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar el cliente" });
  }
};

module.exports = {
  createCliente,
  getAllClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
};
