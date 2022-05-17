const db = require('./db.js')

function login(req, res, func) {
    if (!req.user) res.send('access denied');
    else func();
};

function userMatch(req, res, func) {
    db.query("SELECT author_id FROM post WHERE id = ?", [req.params.pageId], (err, authorId) => {
        if (err) throw err
        
        if (authorId[0].author_id !== req.user) res.send('access denied')
        else func();
    });
}

module.exports = {
    login,
    userMatch,
}