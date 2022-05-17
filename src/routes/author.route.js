const express = require('express');

const authorController = require('../lib/author.js')

const router = express.Router();

router.get('/login', authorController.login)

router.get('/logout', authorController.logout)

router.get('/register', authorController.register)

router.post('/register', authorController.registerProcess)

router.get('/', authorController.read)

router.get('/update', authorController.update)

router.post('/update', authorController.updateProcess)

router.post('/delete', authorController.deleteProcess)

module.exports = router;