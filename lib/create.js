const db = require('./db.js')
const template = require('./template.js')

function create(req, res) {
    if (req.topicList === undefined || res.send === undefined) {
        throw "Wrong parameter"
    }
    db.query("SELECT * FROM author", function(err, authors) {
        if (err) {
            throw err
        }
        const title = 'Create';

        const list = template.list(req.topicList);
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
}

function createProcess(req, res) {
    if (req.body === undefined || res.redirect === undefined) {
        throw "Wrong parameter"
    }

    const title = req.body.title
    const description = req.body.description
    const authorId = req.body.author
    
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

module.exports = {
    create,
    createProcess
}