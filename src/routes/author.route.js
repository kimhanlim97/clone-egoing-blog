const express = require('express');
const authorController = require('../lib/author.js')

const router = express.Router();


router.get('/', authorController.read)

router.get('/login', authorController.login)

router.post('/login', authorController.loginProcess)

router.get('/logout', authorController.logout)

router.post('/create', authorController.createProcess)

router.get('/update/:authorId', authorController.update)

router.post('/update', authorController.updateProcess)

router.post('/delete', authorController.deleteProcess)

module.exports = router;