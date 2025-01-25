const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear una nueva reserva
const createReserva = async (req, res) => {
  const {
    clienteId,
    creadorId,
    empleadoId,
    fecha,
    horaInicio,
    horaFin,
    servicioId,
    monto,
    abonado,
    pendiente,
    sedeId,
  } = req.body;

  try {
    // Verificar que el cliente, creador, empleado, servicio y sede existan
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });
    const creador = await prisma.user.findUnique({ where: { id: creadorId } });
    const empleado = await prisma.user.findUnique({
      where: { id: empleadoId },
    });
    const servicio = await prisma.servicio.findUnique({
      where: { id: servicioId },
    });
    const sede = await prisma.sede.findUnique({ where: { id: sedeId } });

    if (!cliente || !creador || !empleado || !servicio || !sede) {
      return res
        .status(404)
        .json({ error: "Uno o más IDs no existen en la base de datos" });
    }

    // Crear la reserva
    const nuevaReserva = await prisma.reserva.create({
      data: {
        clienteId,
        creadorId,
        empleadoId,
        fecha: new Date(fecha),
        horaInicio: new Date(horaInicio),
        horaFin: new Date(horaFin),
        servicioId,
        monto,
        abonado,
        pendiente,
        sedeId,
      },
      include: {
        cliente: true,
        creador: true,
        empleado: true,
        servicio: true,
        sede: true,
      },
    });

    if (abonado > 0) {
      await prisma.pago.create({
        data: {
          usuarioId: creadorId, // El creador de la reserva es quien registra el pago
          reservaId: nuevaReserva.id,
          monto: abonado,
          status: "CANCELADO",
        },
      });
    }

    res.status(201).json({ reserva: nuevaReserva });
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    res
      .status(400)
      .json({ error: "Error al crear la reserva", details: error.message });
  }
};

// Obtener todas las reservas
const getAllReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        cliente: true,
        creador: true,
        empleado: true,
        servicio: true,
        sede: true,
        pagos: true,
      },
    });
    res.status(200).json({ reservas });
  } catch (error) {
    res.status(400).json({ error: "Error al obtener las reservas" });
  }
};

// Obtener una reserva por ID
const getReservaById = async (req, res) => {
  const { id } = req.params;

  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id },
      include: {
        cliente: true,
        creador: true,
        empleado: true,
        servicio: true,
        sede: true,
        pagos: true,
      },
    });

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.status(200).json({ reserva });
  } catch (error) {
    res.status(400).json({ error: "Error al obtener la reserva" });
  }
};

// Actualizar una reserva
const updateReserva = async (req, res) => {
  const { id } = req.params;
  const {
    clienteId,
    creadorId,
    empleadoId,
    fecha,
    horaInicio,
    horaFin,
    servicioId,
    monto,
    abonado,
    pendiente,
    sedeId,
  } = req.body;

  try {
    // Verificar que los IDs existan (opcional, dependiendo de los campos que se actualicen)
    if (clienteId) {
      const cliente = await prisma.cliente.findUnique({
        where: { id: clienteId },
      });
      if (!cliente)
        return res.status(404).json({ error: "Cliente no encontrado" });
    }
    if (creadorId) {
      const creador = await prisma.user.findUnique({
        where: { id: creadorId },
      });
      if (!creador)
        return res.status(404).json({ error: "Creador no encontrado" });
    }
    if (empleadoId) {
      const empleado = await prisma.user.findUnique({
        where: { id: empleadoId },
      });
      if (!empleado)
        return res.status(404).json({ error: "Empleado no encontrado" });
    }
    if (servicioId) {
      const servicio = await prisma.servicio.findUnique({
        where: { id: servicioId },
      });
      if (!servicio)
        return res.status(404).json({ error: "Servicio no encontrado" });
    }
    if (sedeId) {
      const sede = await prisma.sede.findUnique({ where: { id: sedeId } });
      if (!sede) return res.status(404).json({ error: "Sede no encontrada" });
    }

    // Actualizar la reserva
    const reservaActualizada = await prisma.reserva.update({
      where: { id },
      data: {
        clienteId,
        creadorId,
        empleadoId,
        fecha: fecha ? new Date(fecha) : undefined,
        horaInicio: horaInicio ? new Date(horaInicio) : undefined,
        horaFin: horaFin ? new Date(horaFin) : undefined,
        servicioId,
        monto,
        abonado,
        pendiente,
        sedeId,
      },
      include: {
        cliente: true,
        creador: true,
        empleado: true,
        servicio: true,
        sede: true,
      },
    });

    res.status(200).json({ reserva: reservaActualizada });
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar la reserva" });
  }
};

// Eliminar una reserva
const deleteReserva = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.reserva.delete({ where: { id } });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar la reserva" });
  }
};

module.exports = {
  createReserva,
  getAllReservas,
  getReservaById,
  updateReserva,
  deleteReserva,
};
