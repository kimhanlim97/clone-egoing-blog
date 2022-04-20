import db from './db.js'
import template from './template.js'

function home(res) {
    if (res.send === undefined) {
        throw "Wrong parameter type"
    }
    db.query('SELECT * FROM topic', function(err, data) {
        if (err) {
            throw err
        }
        const title = 'Welcome';
        const description = "Hello, Node.js";

        const list = template.list(data);
        const html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
        res.send(html)
    });
}

function page(res, params) {
    if (res.send === undefined || typeof params !== "object") {
        throw "Wrong parameter type"
    }
    db.query('SELECT * FROM topic', function(err, dataAll) {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ?`, [params.pageId], function(err, data) {
            if (err) {
                throw err;
            }

            const description = data[0].description;
            const title = data[0].title;
            const author = data[0].name;

            const list = template.list(dataAll);
            const html = template.HTML(title, list,
                `<h2>${title}</h2>
                ${description} 
                <p>by ${author}</p>`,
                `<a href="/create">create</a> 
                 <a href="/update?id=${params.pageId}">update</a>
                 <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${params.pageId}">
                    <input type="submit" value="delete">
                 </form>`
            );
            res.send(html)
        })
    })
}

export { home, page }