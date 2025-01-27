const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors());

// O bien, configurar CORS con opciones específicas
app.use(cors({
  origin: '*', // Permitir solo este dominio
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));


app.use(express.json());

// Rutas
app.use('/api', routes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;