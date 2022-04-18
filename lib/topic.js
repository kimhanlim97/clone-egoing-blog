import db from './db.js'
import template from './template.js'

function home(response) {
    db.query('SELECT * FROM topic', function(err, res) {
        if (err) {
            throw err
        }
        var title = 'Welcome';
        var description = "Hello, Node.js";
        var list = template.list(res);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
        }
    );
}

function detail(response, queryData) {
    db.query('SELECT * FROM topic', function(err, resAll) {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ?`, [queryData.id], function(err, res) {
            if (err) {
                throw err;
            }

            var description = res[0].description;
            var title = res[0].title;
            var author = res[0].name;

            var list = template.list(resAll);
            var html = template.HTML(title, list,
                `<h2>${title}</h2>
                ${description} 
                <p>by ${author}</p>`,
                `<a href="/create">create</a> 
                 <a href="/update?id=${queryData.id}">update</a>
                 <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <input type="submit" value="delete">
                 </form>`
            );
            response.writeHead(200);
            response.end(html);
        })
        
    })
}

export { home, detail }