const db = require('./db.js');

function deleteProcess(req, res) {
    if (req.body === undefined || res.redirect === undefined) {
        throw "Wrong parameter"
    }
    db.query("DELETE FROM topic WHERE id = ?", [req.body.id], function(err, result) {
        if (err) {
            throw err
        }
        res.redirect('/')
    })
}

exports.deleteProcess = deleteProcess;