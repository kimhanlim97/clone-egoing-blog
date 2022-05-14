const db = require('./template/db.js');
const template = require('./template/template.js')
const loginValidation = require('./template/loginValidation.js');

function create(req, res) {
    loginValidation(res, req.session.login, () => {
        db.query("SELECT * FROM author", function(err, authors) {
            if (err) throw err;
    
            const title = 'Create';
            const list = template.list(req.topicList);
            const authorList = template.authorList(authors);
    
            const html = template.HTML(title, list,
            `<form action="/post/create" method="post">
                 <p>
                     <input type="text" name="title" placeholder="title">
                </p>
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
            '', req.session.login);
            res.send(html)
        });
    })
}

function createProcess(req, res) {
    loginValidation(res, req.session.login, () => {
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
                    res.redirect(`/post/read/${topicId}`);
                })
            }
        );
    })
}

function read(req, res) {
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ?`, [req.params.pageId], function(err, data) {
        if (err) {
            throw err;
        }

        const description = data[0].description;
        const title = data[0].title;
        const author = data[0].name;

        const list = template.list(req.topicList);
        const html = template.HTML(title, list,
            `<h2>${title}</h2>
             ${description} 
             <p>by ${author}</p>`,
            `<a href="/post/create">create</a> 
             <a href="/post/update/${req.params.pageId}">update</a>
             <form action="/post/delete" method="post">
                 <input type="hidden" name="id" value="${req.params.pageId}">
                 <input type="submit" value="delete">
             </form>`
        , req.session.login);
        res.send(html)
    })
}

function update(req, res) {
    loginValidation(res, req.session.login, () => {
        db.query("SELECT * FROM topic WHERE id = ?", [req.params.pageId], function(err1, topic) {
            if (err1) throw err1
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
                    `<form action="/post/update" method="post">
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
                    `<a href="/post/create">create</a> <a href="/post/update/${topicId}">update</a>`
                , req.session.login);
                res.send(html)
            });
        });
    })
}

function updateProcess(req, res) {
    loginValidation(res, req.session.login, () => {
        const topicId = req.body.id
        const title = req.body.title
        const description = req.body.description
        const authorId = req.body.author
        
        db.query("UPDATE topic SET title = ?, description = ?, author_id = ? WHERE id = ?", [title, description, authorId , topicId], function(err, result) {
            if (err) {
                throw err
            }
            res.redirect(`/post/read/${topicId}`);   
        });
    })
}

function deleteProcess(req, res) {
    loginValidation(res, req.session.login, () => {
        db.query("DELETE FROM topic WHERE id = ?", [req.body.id], function(err, result) {
            if (err) {
                throw err
            }
            res.redirect('/')
        })
    })
}

module.exports = {
    create,
    createProcess,
    read,
    update, 
    updateProcess,
    deleteProcess
}