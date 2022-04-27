const db = require('./template/db.js')
const template = require('./template/template.js')

function read(req, res) {
    if (req.topicList === undefined || res.send === undefined) {
        throw "Wrong parameter"
    }
    db.query("SELECT * FROM author", function(err, authors) {
        if (err) {
            throw err
        }

        const title = "author"
        const list = template.list(req.topicList);
        const authorTag = template.authorTable(authors)
        const html = template.HTML(title, list, 
        `
        <h2>Authors</h2>
        <table>
            ${authorTag}
        </table>
        <form action="/author/create" method="post">
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
        `);
        res.send(html);
    })
}

function createProcess(req, res) {
    if (req.body === undefined || res.redirect === undefined) {
        throw "Wrong Parameter"
    }
    const author = req.body.name;
    const profile = req.body.profile;
    db.query("INSERT INTO author (name, profile) VALUES (?, ?)", [author, profile], (err, data) => {
        if (err) throw err
        res.redirect('/author');
    })
}

function update(req, res) {
    if (req.topicList === undefined || res.send === undefined || req.params === null) {
        throw "Wrong parameter"
    }
    db.query("SELECT * FROM author", function(err, authors) {
        if (err) throw err
        db.query("SELECT * FROM author WHERE id = ?", [req.params.authorId], function(err, author) {
            if (err) throw err
    
            const title = "author"
            const list = template.list(req.topicList)
            const authorTag = template.authorTable(authors)
            const html = template.HTML(title, list, 
                `
                <h2>Authors</h2>
                <table>
                    ${authorTag}
                </table>
                <form action="/author/update" method="post">
                    <p>
                        <input type="hidden" name="id" value="${req.params.authorId}">
                    </p>
                    <p>
                        <input type="text" name="name" value="${author[0].name}">
                    </p>
                    <p>
                        <textarea name="profile">${author[0].profile}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `    
            )
            res.send(html);
        })
    })
}

function updateProcess(req, res) {
    if (req.body === undefined || res.redirect === undefined) {
        throw "Wrong Parameter"
    }
    const body = req.body
    db.query("UPDATE author SET name = ?, profile = ? WHERE id = ?", 
        [body.name, body.profile, body.id],
        (err, result) => {
            if (err) throw err
            res.redirect('/author');
        }
    )
}

function deleteProcess(req, res) {
    if (req.body === undefined || res.redirect === undefined) {
        throw "Wrong Parameter"
    }
    db.query("DELETE FROM topic WHERE author_id = ? ", [req.body.id], (err1, result1) => {
        if (err1) throw err1
        db.query("DELETE FROM author WHERE id = ?", [req.body.id], (err2, result2) => {
            res.redirect('/author');
        })
    })
}

module.exports = {
    read,
    createProcess,
    update, 
    updateProcess,
    deleteProcess
}