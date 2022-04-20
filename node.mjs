import express from 'express'

import { home, page } from './lib/topic.js'
import { create, createProcess } from './lib/create.js'

const app = express()
app.use(express.json());
app.use(express.urlencoded());
const port = 3000

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});