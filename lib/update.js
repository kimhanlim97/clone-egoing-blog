import db from './db.js'
import template from './template.js'

function update(response, queryData) {
    db.query("SELECT * FROM topic", function(err1, resAll) {
        if (err1) {
            throw err1
        }
        db.query("SELECT * FROM topic WHERE id = ?", [queryData.id], function(err2, res) {
            if (err2) {
                throw err2
            }
            db.query("SELECT * FROM author", function(err3, authors) {
                if (err3) {
                    throw err3
                }
                var list = template.list(resAll);
                var authorList = template.authorList(authors, res[0].author_id);
                var html = template.HTML(res[0].title, list, 
                    `<form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${res[0].id}"/>
                        <p>
                            <input type="text" name="title" placeholder="title" value="${res[0].title}"/>
                        </p>
                        <p>
                            <textarea name="description" placeholder="description">${res[0].description}</textarea>
                        </p>
                        <p>
                            <select name='author'>
                                ${authorList}
                            </select>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${res[0].title}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    })
}

function updateProcess(request, response) {
    var body = ''

    request.on('data', function(data) {
        body = body + data;
    })

    request.on('end', function() {
        var title = new URLSearchParams(body).get('title')
        var description = new URLSearchParams(body).get('description')
        var authorID = new URLSearchParams(body).get('author')
        var id = new URLSearchParams(body).get('id'); 
        db.query("UPDATE topic SET title = ?, description = ?, author_id = ? WHERE id = ?", [title, description, authorID , id], function(err, res) {
            if (err) {
                throw err
            }
            response.writeHead(302, {Location: `/?id=${id}`});
            response.end();
        })
    })
}

export { update, updateProcess }