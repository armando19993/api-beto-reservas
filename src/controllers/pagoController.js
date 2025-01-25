const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo pago
const createPago = async (req, res) => {
  const { usuarioId, reservaId, monto, status, comprobante } = req.body;

  try {
    const nuevoPago = await prisma.pago.create({
      data: {
        usuarioId,
        reservaId,
        monto,
        status,
        comprobante,
      },
    });
    res.status(201).json({ pago: nuevoPago });
  } catch (error) {
    console.error('Error al crear el pago:', error);
    res.status(400).json({ error: 'Error al crear el pago', details: error.message });
  }
};

// Obtener todos los pagos
const getAllPagos = async (req, res) => {
  try {
    const pagos = await prisma.pago.findMany({
      include: {
        usuario: true,
        reserva: true,
      },
    });
    res.status(200).json({ pagos });
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener los pagos' });
  }
};

// Obtener un pago por ID
const getPagoById = async (req, res) => {
  const { id } = req.params;

  try {
    const pago = await prisma.pago.findUnique({
      where: { id },
      include: {
        usuario: true,
        reserva: true,
      },
    });
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.status(200).json({ pago });
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener el pago' });
  }
};

// Actualizar un pago
const updatePago = async (req, res) => {
  const { id } = req.params;
  const { usuarioId, reservaId, monto, status, comprobante } = req.body;

  try {
    const pagoActualizado = await prisma.pago.update({
      where: { id },
      data: {
        usuarioId,
        reservaId,
        monto,
        status,
        comprobante,
      },
    });
    res.status(200).json({ pago: pagoActualizado });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el pago' });
  }
};

// Eliminar un pago
const deletePago = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.pago.delete({ where: { id } });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar el pago' });
  }
};

module.exports = {
  createPago,
  getAllPagos,
  getPagoById,
  updatePago,
  deletePago,
};