const db = require('./db.js')

function deleteAuthorProcess(req, res) {
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

exports.deleteAuthorProcess = deleteAuthorProcess;