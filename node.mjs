import express, { request } from 'express'
import compression from 'compression'

import db from './lib/db.js'
import { home, page } from './lib/topic.js'
import { create, createProcess } from './lib/create.js'
import { update, updateProcess } from './lib/update.js'
import deleteProcess from './lib/delete.js'

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
  home(req, res);
});

app.get('/page/:pageId', (req, res) => {
  console.log(req.topicList, req.params);
  page(req, res);
});

app.get('/create', (req, res) => {
  create(req, res)
})

app.post('/create', (req, res) => {
  createProcess(req, res);
})

app.get('/update/:pageId', (req, res) => {
  update(req, res);
})

app.post('/update', (req, res) => {
  updateProcess(req, res);
})

app.post('/delete', (req, res) => {
  deleteProcess(req, res);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});