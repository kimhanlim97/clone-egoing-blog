import db from './db.js'
import template from './template.js'

function create(res) {
    if (res.send === undefined) {
        throw "Wrong parameter type"
    }
    db.query(`SELECT * FROM topic`, function(err1, topics){
        if (err1) {
            throw err1
        }
        db.query("SELECT * FROM author", function(err2, authors) {
            if (err2) {
                throw err2
            }
            const title = 'Create';

            const list = template.list(topics);
            const authorList = template.authorList(authors);
            const html = template.HTML(title, list,
            `<form action="/create" method="post">
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
            res.send(html)
        });
    });
}

function createProcess(res, body) {
    if (res.redirect === undefined || typeof body !== "object") {
        throw "Wrong parameter type"
    }

    const title = body.title
    const description = body.description
    const authorId = body.author
    
    db.query(`INSERT INTO topic (title, description, created, author_id) 
        VALUES (?, ?, NOW(), ?)`, [title, description, authorId], function(err1, result) {
            if (err1) {
                throw err1
            }
            db.query("SELECT * FROM topic WHERE title = ?", [title], (err2, data) => {
                if (err2) {
                    throw err2
                }
                const topicId = data[0].id
                res.redirect(`/page/${topicId}`);
            })
            
        }
    );
}

export { create, createProcess }