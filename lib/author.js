import template from "./template.js"
import db from "./db.js"

function show(request, response) {
    db.query("SELECT * FROM topic", function(err, topics) {
        if (err) {
            throw err
        }
        db.query("SELECT * FROM author", function(err, authors) {
            if (err) {
                throw err
            }
    
            const title = "author"
            const list = template.list(topics)
            const authorTag = template.authorTable(authors)
            const html = template.HTML(title, list, 
                `
                <h2>Authors</h2>
                <table>
                    ${authorTag}
                </table>
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="author">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="profile"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `    
            )
            response.writeHead(200);
            response.end(html);
        })
    })
}

function createAuthorProcess(request, response) {
    var body = ''

    request.on('data', function(data) {
        body = body + data;
    })

    request.on('end', function() {
        var author = new URLSearchParams(body).get('name')
        var profile = new URLSearchParams(body).get('profile')
        db.query(`INSERT INTO author (name, profile) VALUES (?, ?)`,
            [author, profile],
            function(err, res) {
                if (err) {
                    throw err
                }
                response.writeHead(302, {Location: `/author`});
                response.end();
            }
        );
    })
}

function updateAuthorProcess(request, response) {
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

export { show, createAuthorProcess, updateAuthorProcess }