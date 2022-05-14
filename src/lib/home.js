const template = require('./template/template.js')

function get(req, res) {
    const title = 'Welcome';
    const description = "Hello, Node.js";
    const list = template.list(req.topicList);
    const login = req.session.login;

    const html = template.HTML(title, list,
    `<h2>${title}</h2>
    <p>${description}</p>
    <img src="/img.jpg" style="width: 300px; height:300px;">`,
    `<a href="/post/create">create</a>`
    , login);
    res.send(html);
}

module.exports = {
    get
}