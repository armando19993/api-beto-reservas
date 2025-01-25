const express = require("express");
const authRoutes = require("./authRoutes");
const sedeRoutes = require("./sedeRoutes");
const servicioRoutes = require("./servicioRoutes");
const reservaRoutes = require('./reservaRoutes'); 
const pagoRoutes = require('./pagoRoutes');
const userRoutes = require('./userRoutes');
const clienteRoutes = require('./clienteRoutes');
const router = express.Router();

router.use("/auth", authRoutes);
router.use(sedeRoutes);
router.use(servicioRoutes)
router.use(reservaRoutes)
router.use(pagoRoutes)
router.use(userRoutes)
router.use(clienteRoutes)

module.exports = router;
