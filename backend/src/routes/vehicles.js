const express = require('express');
const { listPublic, getFilters, getBySlug } = require('../controllers/vehiclesController');

const router = express.Router();

router.get('/', listPublic);
router.get('/filters', getFilters);
router.get('/:slug', getBySlug);

module.exports = router;
