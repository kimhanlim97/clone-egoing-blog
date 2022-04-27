const express = require('express');
const homeController = require('../lib/home.js')

const router = express.Router();

router.get('/', homeController.get)

module.exports = router;