import template from "./template.js"
import db from "./db.js"

function updateAuthor(request, response, queryData) {
    db.query("SELECT * FROM topic", function(err, topics) {
        if (err) {
            throw err
        }
        db.query("SELECT * FROM author", function(err, authors) {
            if (err) {
                throw err
            }
            db.query("SELECT * FROM author WHERE id = ?", [queryData.id], function(err, res) {
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
                    <form action="/author/update_process" method="post">
                        <p>
                            <input type="hidden" name="id" value="${queryData.id}">
                        </p>
                        <p>
                            <input type="text" name="name" value="${res[0].name}">
                        </p>
                        <p>
                            <textarea name="profile">${res[0].profile}</textarea>
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
    })
}

function updateAuthorProcess(request, response) {
    var body = ''

    request.on('data', function(data) {
        body = body + data;
    })

    request.on('end', function() {
        var author = new URLSearchParams(body).get('name')
        var profile = new URLSearchParams(body).get('profile')
        var authorID = new URLSearchParams(body).get('id');
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
            [author, profile, authorID],
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

export { updateAuthor, updateAuthorProcess }