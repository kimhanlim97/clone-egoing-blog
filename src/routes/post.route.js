const express = require('express');
const postController = require('../lib/post.js')

const router = express.Router();

router.get('/read/:pageId', postController.read)

router.get('/create', postController.create)

router.post('/create', postController.createProcess)

router.get('/update/:pageId', postController.update)

router.post('/update/:pageId', postController.updateProcess)

router.post('/delete/:pageId', postController.deleteProcess)

module.exports = router;