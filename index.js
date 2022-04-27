const express = require('express');
const compression = require('compression')

const db = require('./src/lib/template/db.js')
const homeRouter = require('./src/routes/home.route.js')
const postRouter = require('./src/routes/post.route.js')
const authorRouter = require('./src/routes/author.route.js')

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

app.use(homeRouter);
app.use('/post', postRouter);
app.use('/author', authorRouter);

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