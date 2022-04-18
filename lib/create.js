import db from './db.js'
import template from './template.js'

function create(response) {
    db.query(`SELECT * FROM topic`, function(error, topics){
        db.query("SELECT * FROM author", function(err2, authors) {
            var title = 'Create';

            var list = template.list(topics);
            var authorList = template.authorList(authors);
            var html = template.HTML(title, list,
            `<form action="/create_process" method="post">
                <p>
                    <input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
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
            `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

function createProcess(request, response) {
    var body = ''

        request.on('data', function(data) {
            body = body + data;
        })

        request.on('end', function() {
            var title = new URLSearchParams(body).get('title')
            var description = new URLSearchParams(body).get('description')
            var authorID = new URLSearchParams(body).get('author');
            db.query(`INSERT INTO topic (title, description, created, author_id) 
                VALUES (?, ?, NOW(), ?)`,
                [title, description, authorID],
                function(err, res) {
                    if (err) {
                        throw err
                    }
                    response.writeHead(302, {Location: `/?id=${res.insertId}`});
                    response.end('success');
                }
            );
        })
}

export { create, createProcess }