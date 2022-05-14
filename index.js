const express = require('express');
const compression = require('compression')

const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const sessionStore = new mysqlStore({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'khlm8107',
  database: 'opentutorials'
})

const db = require('./src/lib/template/db.js')
const homeRouter = require('./src/routes/home.route.js')
const postRouter = require('./src/routes/post.route.js')
const authorRouter = require('./src/routes/author.route.js')

const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
  secret: "khlm8107",
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
}))
app.use((req, res, next) => {
  if (req.session.isLogined === true) next();
  else {
    req.session.isLogined = false; 
    next();
  }
})
app.get('*', (req, res, next) => {
  db.query("SELECT * FROM post", (err, topicList) => {
    if (err) {
      throw err
    }
    req.topicList = topicList;
    next()
  })
})

app.use(homeRouter);
app.use('/post', postRouter);
app.use('/auth', authorRouter);

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