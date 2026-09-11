const express = require('express');
const rateLimit = require('express-rate-limit');
const { create } = require('../controllers/consignmentsController');
const { upload } = require('../middleware/upload');

const router = express.Router();

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiadas solicitudes. Probá de nuevo en unos minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', formLimiter, upload.array('images', 5), create);

module.exports = router;
