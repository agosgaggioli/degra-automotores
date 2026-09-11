const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const vehiclesController = require('../controllers/vehiclesController');
const consignmentsController = require('../controllers/consignmentsController');
const contactController = require('../controllers/contactController');
const statsController = require('../controllers/statsController');

const router = express.Router();

// Todas las rutas de este archivo requieren estar logueado
router.use(requireAuth);

// Dashboard
router.get('/stats', statsController.getStats);

// Vehículos
router.get('/vehicles', vehiclesController.listAdmin);
router.get('/vehicles/:id', vehiclesController.getOneAdmin);
router.post('/vehicles', upload.array('images', 10), vehiclesController.create);
router.put('/vehicles/:id', upload.array('images', 10), vehiclesController.update);
router.delete('/vehicles/:id', vehiclesController.remove);
router.delete('/vehicles/:id/images/:imageId', vehiclesController.removeImage);

// Consignaciones
router.get('/consignments', consignmentsController.list);
router.get('/consignments/:id', consignmentsController.getOne);
router.patch('/consignments/:id', consignmentsController.update);
router.delete('/consignments/:id', consignmentsController.remove);

// Consultas / contacto
router.get('/contact', contactController.list);
router.patch('/contact/:id', contactController.update);
router.delete('/contact/:id', contactController.remove);

module.exports = router;
