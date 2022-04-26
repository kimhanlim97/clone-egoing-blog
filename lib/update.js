const db = require('./db.js')
const template = require('./template.js')

function update(req, res) {
    if (req.topicList === undefined ||req.params === null || res.send === undefined) {
        throw "Wrong parameter"
    }
    db.query("SELECT * FROM topic WHERE id = ?", [req.params.pageId], function(err1, topic) {
        if (err1) {
            throw err1
        }
        db.query("SELECT * FROM author", function(err2, authors) {
            if (err2) {
                throw err2
            }

            const title = topic[0].title
            const description = topic[0].description
            const topicId = topic[0].id
            const list = template.list(req.topicList);
            const authorList = template.authorList(authors, topic[0].author_id);

            const html = template.HTML(title, list, 
                `<form action="/update" method="post">
                    <input type="hidden" name="id" value="${topicId}"/>
                    <p>
                        <input type="text" name="title" placeholder="title" value="${title}"/>
                    </p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
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
                `<a href="/create">create</a> <a href="/update/${topicId}">update</a>`
            );
            res.send(html)
        });
    });
}

function updateProcess(req, res) {
    if (req.body === undefined || res.redirect === undefined) {
        throw "Wrong parameter"
    }

    const topicId = req.body.id
    const title = req.body.title
    const description = req.body.description
    const authorId = req.body.author
    
    db.query("UPDATE topic SET title = ?, description = ?, author_id = ? WHERE id = ?", [title, description, authorId , topicId], function(err, result) {
        if (err) {
            throw err
        }
        res.redirect(`/page/${topicId}`);   
    });
}

module.exports = {
    update,
    updateProcess
}