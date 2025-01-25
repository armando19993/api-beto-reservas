const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSede = async (req, res) => {
  const { nombre, status, horarioInicio, horarioFin } = req.body;

  try {
    const nuevaSede = await prisma.sede.create({
      data: {
        nombre,
        status,
        horarioInicio: new Date(horarioInicio), 
        horarioFin: new Date(horarioFin),
      },
    });
    res.status(201).json({ sede: nuevaSede });
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la sede' });
  }
};

const getAllSedes = async (req, res) => {
  try {
    const sedes = await prisma.sede.findMany();
    res.status(200).json({ sedes });
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener las sedes' });
  }
};

const getSedeById = async (req, res) => {
  const { id } = req.params;

  try {
    const sede = await prisma.sede.findUnique({ where: { id } });
    if (!sede) {
      return res.status(404).json({ error: 'Sede no encontrada' });
    }
    res.status(200).json({ sede });
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener la sede' });
  }
};

const updateSede = async (req, res) => {
  const { id } = req.params;
  const { nombre, status, horarioInicio, horarioFin } = req.body;

  try {
    const sedeActualizada = await prisma.sede.update({
      where: { id },
      data: {
        nombre,
        status,
        horarioInicio: new Date(horarioInicio),
        horarioFin: new Date(horarioFin), 
      },
    });
    res.status(200).json({ sede: sedeActualizada });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la sede' });
  }
};


const deleteSede = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.sede.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar la sede' });
  }
};

module.exports = {
  createSede,
  getAllSedes,
  getSedeById,
  updateSede,
  deleteSede,
};