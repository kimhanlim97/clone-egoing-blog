import db from './db.js'
import template from './template.js'

function update(res, params) {
    if (res.send === undefined || typeof params !== "object") {
        throw "Wrong parameter type"
    }
    db.query("SELECT * FROM topic", function(err1, topicAll) {
        if (err1) {
            throw err1
        }
        db.query("SELECT * FROM topic WHERE id = ?", [params.pageId], function(err2, topic) {
            if (err2) {
                throw err2
            }
            db.query("SELECT * FROM author", function(err3, authors) {
                if (err3) {
                    throw err3
                }

                const title = topic[0].title
                const description = topic[0].description
                const topicId = topic[0].id
                const list = template.list(topicAll);
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
    })
}

function updateProcess(res, body) {
    if (res.redirect === undefined || typeof body !== "object") {
        throw "Wrong parameter type"
    }

    const topicId = body.id
    const title = body.title
    const description = body.description
    const authorId = body.author
    
    db.query("UPDATE topic SET title = ?, description = ?, author_id = ? WHERE id = ?", [title, description, authorId , topicId], function(err, result) {
            if (err) {
                throw err
            }
            res.redirect(`/page/${topicId}`);   
        }
    );
}

export { update, updateProcess }