import express from 'express'

import { home, page } from './lib/topic.js'
import { create, createProcess } from './lib/create.js'
import { update, updateProcess } from './lib/update.js'

const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  home(res);
});

app.get('/page/:pageId', (req, res) => {
  page(res, req.params)
});

app.get('/create', (req, res) => {
  create(res)
})

app.post('/create', (req, res) => {
  createProcess(res, req.body);
})

app.get('/update/:pageId', (req, res) => {
  update(res, req.params);
})

app.post('/update', (req, res) => {
  updateProcess(res, req.body);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});