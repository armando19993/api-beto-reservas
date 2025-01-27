const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createServicio = async (req, res) => {
  const { nombre, precio, tiempo, status } = req.body;

  // Validar que el status sea válido
  if (!['ACTIVO', 'INACTIVO'].includes(status)) {
    return res.status(400).json({ error: 'El status debe ser ACTIVO o INACTIVO' });
  }

  try {
    const nuevoServicio = await prisma.servicio.create({
      data: {
        nombre,
        precio: parseFloat(precio),
        tiempo: parseInt(tiempo),
        status, // Asegúrate de incluir el campo status
      },
    });
    res.status(201).json({ servicio: nuevoServicio });
  } catch (error) {
    console.error('Error al crear el servicio:', error); // Imprimir el error en la consola
    res.status(400).json({ error: 'Error al crear el servicio', details: error.message });
  }
};

const getAllServicios = async (req, res) => {
  try {
    const servicios = await prisma.servicio.findMany();
    res.status(200).json({ servicios });
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener los servicios' });
  }
};

const getServicioById = async (req, res) => {
  const { id } = req.params;

  try {
    const servicio = await prisma.servicio.findUnique({ where: { id } });
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.status(200).json({ servicio });
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener el servicio' });
  }
};


const updateServicio = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, tiempo, status } = req.body;

  try {
    const servicioActualizado = await prisma.servicio.update({
      where: { id },
      data: {
        nombre,
        precio,
        tiempo,
        status
      },
    });
    res.status(200).json({ servicio: servicioActualizado });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el servicio' });
  }
};


const deleteServicio = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.servicio.delete({ where: { id } });
    res.status(204).send(); 
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar el servicio' });
  }
};

module.exports = {
  createServicio,
  getAllServicios,
  getServicioById,
  updateServicio,
  deleteServicio,
};