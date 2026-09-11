const express = require('express');
const rateLimit = require('express-rate-limit');
const { create } = require('../controllers/contactController');

const router = express.Router();

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Demasiadas solicitudes. Probá de nuevo en unos minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', formLimiter, create);

module.exports = router;
