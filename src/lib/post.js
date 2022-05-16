const db = require('./template/db.js');
const template = require('./template/template.js')
const validate = require('./template/validate.js');

function create(req, res) {
    validate.login(req, res, () => {
        const title = 'Post Create';
        const list = template.list(req.topicList);
        const html = template.HTML(title, list,
        `<form action="/post/create" method="post">
            <p>
                <input type="text" name="title" placeholder="title">
            </p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>`,
        '', req.session.isLogined);

        res.send(html)
    });
}

function createProcess(req, res) {
    validate.login(req, res, () => {
        const title = req.body.title
        const description = req.body.description
        const authorId = req.session.author_id
        
        db.query(`INSERT INTO post (title, description, created, author_id) 
            VALUES (?, ?, NOW(), ?)`, [title, description, authorId], (err1, result) => {
                if (err1) throw err1

                const postId = result.insertId

                db.query("SELECT * FROM post WHERE id = ?", [postId], (err2, data) => {
                    if (err2) throw err2

                    res.redirect(`/post/read/${postId}`);
                })
            }
        );
    })
}

function read(req, res) {
    db.query(`SELECT * FROM post LEFT JOIN author ON post.author_id = author.id WHERE post.id = ?`, [req.params.pageId], (err, data) => {
        if (err) throw err;

        const description = data[0].description;
        const title = data[0].title;
        const author = data[0].user_name;

        const list = template.list(req.topicList);
        const html = template.HTML(title, list,
        `<h2>${title}</h2>
         ${description} 
         <p>by ${author}</p>`,
        `<a href="/post/create">create</a> 
         <a href="/post/update/${req.params.pageId}">update</a>
         <form action="/post/delete/${req.params.pageId}" method="post">
             <input type="submit" value="delete">
         </form>`, req.session.isLogined);

        res.send(html)
    })
}

function update(req, res) {
    validate.login(req, res, () => {
        validate.userMatch(req, res, () => {
            db.query("SELECT * FROM post WHERE id = ?", [req.params.pageId], (err, post) => {
                if (err) throw err
    
                const title = post[0].title
                const description = post[0].description
                const postId = post[0].id
                const list = template.list(req.topicList);
    
                const html = template.HTML(title, list, 
                `<form action="/post/update/${postId}" method="post">
                    <p>
                        <input type="text" name="title" placeholder="title" value="${title}"/>
                    </p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>`,
                `<a href="/post/create">create</a>`, req.session.isLogined);
    
                res.send(html)
            });
        })
    })
}

function updateProcess(req, res) {
    validate.login(req, res, () => {
        validate.userMatch(req, res, () => {
            const postId = req.params.pageId
            const title = req.body.title
            const description = req.body.description
            
            db.query("UPDATE post SET title = ?, description = ? WHERE id = ? ", [title, description, postId], (err, result) => {
                if (err) throw err

                res.redirect(`/post/read/${postId}`);   
            });
        })
    })
}

function deleteProcess(req, res) {
    validate.login(req, res, () => {
        validate.userMatch(req, res, () => {
            const postId = req.params.pageId

            db.query("DELETE FROM post WHERE id = ?", [postId], (err, result) => {
                if (err) throw err

                res.redirect('/')
            })
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