import db from './db.js'
import template from './template.js'

function home(req, res) {
    if (req.topicList === undefined || res.send === undefined) {
        throw "Wrong parameter"
    }
    const title = 'Welcome';
    const description = "Hello, Node.js";

    const list = template.list(req.topicList);
    const html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
    );
    res.send(html)
}

function page(req, res) {
    if (req.topicList === undefined || res.send === undefined || req.params === null) {
        throw "Wrong parameter"
    }
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ?`, [req.params.pageId], function(err, data) {
        if (err) {
            throw err;
        }

        const description = data[0].description;
        const title = data[0].title;
        const author = data[0].name;

        const list = template.list(req.topicList);
        const html = template.HTML(title, list,
            `<h2>${title}</h2>
             ${description} 
             <p>by ${author}</p>`,
            `<a href="/create">create</a> 
             <a href="/update/${req.params.pageId}">update</a>
             <form action="/delete" method="post">
                 <input type="hidden" name="id" value="${req.params.pageId}">
                 <input type="submit" value="delete">
             </form>`
        );
        res.send(html)
    })
}

export { home, page }