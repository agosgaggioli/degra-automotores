const express = require('express');
const { listPublic } = require('../controllers/financingsController');

const router = express.Router();

router.get('/', listPublic);

module.exports = router;