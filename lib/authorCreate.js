import db from "./db.js"

function createAuthorProcess(req, res) {
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

export default createAuthorProcess