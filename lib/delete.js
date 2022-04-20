import db from './db.js'

function deleteProcess(res, body) {
    if (res.redirect === undefined || typeof body !== 'object') {
        throw "Wrong parameter type"
    }
    db.query("DELETE FROM topic WHERE id = ?", [body.id], function(err, result) {
        if (err) {
            throw err
        }
        res.redirect('/')
    })
}

export default deleteProcess