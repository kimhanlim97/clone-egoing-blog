const express = require('express');
const compression = require('compression')

const db = require('./lib/db.js')
const topic = require('./lib/topic.js')
const create = require('./lib/create.js')
const update = require('./lib/update.js')
const deleteProcess = require('./lib/delete.js')
const author = require('./lib/author.js')
const createAuthorProcess = require('./lib/authorCreate.js')
const updateAuthor = require('./lib/authorUpdate.js')
const deleteAuthorProcess = require('./lib/authorDelete.js')

const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(compression());
app.get('*', (req, res, next) => {
  db.query("SELECT * FROM topic", (err, topicList) => {
    if (err) {
      throw err
    }
    req.topicList = topicList;
    next()
  })
})

app.get('/', (req, res) => {
  topic.home(req, res);
});

app.get('/page/:pageId', (req, res) => {
  topic.page(req, res);
});

app.get('/create', (req, res) => {
  create.create(req, res)
})

app.post('/create', (req, res) => {
  create.createProcess(req, res);
})

app.get('/update/:pageId', (req, res) => {
  update.update(req, res);
})

app.post('/update', (req, res) => {
  update.updateProcess(req, res);
})

app.post('/delete', (req, res) => {
  deleteProcess.deleteProcess(req, res);
})

app.get('/author', (req, res) => {
  author.author(req, res);
})

app.post('/author/create', (req, res) => {
  createAuthorProcess.createAuthorProcess(req, res);
})

app.get('/author/update/:authorId', (req, res) => {
  updateAuthor.updateAuthor(req, res);
})

app.post('/author/update', (req, res) => {
  updateAuthor.updateAuthorProcess(req, res);
})

app.post('/author/delete', (req, res) => {
  deleteAuthorProcess.deleteAuthorProcess(req, res);
})

app.use((req, res, next) => {
  res.status(404).send({status: 400, message: "Sorry can't find that", type: 'client'})
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({status: 500, message: 'internal error', type: 'server'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});