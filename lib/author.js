const template = require("./template.js")
const db = require("./db.js")

function author(req, res) {
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

exports.author = author;