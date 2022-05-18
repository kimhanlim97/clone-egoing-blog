const db = require('./template/db.js')
const template = require('./template/template.js')
const validate = require('./template/validate.js')

function login(req, res) {
    const title = 'Login';
    const list = template.list(req.topicList);
    const html = template.HTML(title, list,
    `
    <form action="/auth/login" method="post">
        <p>
            <input type="text" name="id" placeholder="id">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `
    , '', req)
    res.send(html);
}

function logout(req, res) {
    validate.login(req, res, () => {
        req.logout();
        req.session.regenerate(() => {
            res.redirect('/');
        });
    })
}

function register(req, res) {
    const title = 'Register';
    const html = template.HTML(title, '', `
        <form action="/auth/register" method="post">
            <p>
                id: <input type="text" name="user_id"/>
            </p>
            <p>
                pw: <input type="password" name="user_pw"/>
            </p>
            <p>
                name: <input type="text" name="user_name"/>
            </p>
            <p>
                <p>profile</p>
                <textarea name="profile"></textarea>
            </p>
            <p>
                <input type="submit"/>
            </p>
        </form>
    `, '', req)

    res.send(html);
}

function registerProcess(req, res) {
    const userId = req.body.user_id;
    const userPw = req.body.user_pw;
    const userName = req.body.user_name;
    const profile = req.body.profile;

    db.query('SELECT user_id from author WHERE user_id = ?', [userId], (err1, userOverlap) => {
        if (userOverlap[0]) {
            res.send('id가 중복되었습니다')
        }
        else {
            db.query('INSERT INTO author (user_id, user_pw, user_name, profile) VALUES (?, ?, ?, ?)', 
            [userId, userPw, userName, profile], (err2, result) => {
                if (err2) throw err2

                req.login({id: result.insertId}, () => {
                    return res.redirect('/');
                })
            })
        }
    }) 
}

function read(req, res) {
    validate.login(req, res, () => {
        db.query('SELECT user_id, user_name, profile FROM author WHERE id = ?', [req.session.passport.user], (err, data) => {
            if (err) throw err

            const title = "My Information"
            const html = template.HTML(title, '', 
            `
            <h2>My Information</h2>
            <p>id: ${data[0].user_id}</p>
            <p>name: ${data[0].user_name}</p>
            <p>profile: ${data[0].profile}</p>
            `, `
            <a href="/auth/update">update</a>
            <form action="/auth/delete" method="post">
                <input type="submit" value="delete">
            </form>
            `, req);

            res.send(html);
        })
    })
}

function update(req, res) {
    validate.login(req, res, () => {
        db.query('SELECT * FROM author WHERE id = ?', [req.session.passport.user], (err, data) => {
            if (err) throw err
    
            const title = "Update My Information"
            const html = template.HTML(title, '', 
            `
            <h2>Update My Information</h2>
            <form action="/auth/update" method="post">
                <p>
                    id: <input type="text" name="user_id" value="${data[0].user_id}">
                </p>
                <p>
                    pw: <input type="password" name="user_pw" value="${data[0].user_pw}">
                </p>
                <p>
                    name: <input type="text" name="user_name" value="${data[0].user_name}">
                </p>
                <p>
                    <p>profile</p> 
                    <textarea name="profile">${data[0].profile}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `    
            , '', req)

            res.send(html);
        })
    })
}

function updateProcess(req, res) {
    validate.login(req, res, () => {
        const body = req.body

        db.query("UPDATE author SET user_id = ?, user_pw = ?, user_name = ?, profile = ? WHERE id = ?", 
            [body.user_id, body.user_pw, body.user_name, body.profile, req.session.passport.user], (err, result) => {
                if (err) throw err;

                res.redirect('/auth');
        })
    })
}

function deleteProcess(req, res) {
    validate.login(req, res, () => {
        db.query("DELETE FROM post WHERE author_id = ?", [req.session.passport.user], (err1, result1) => {
            if (err1) throw err1

            db.query("DELETE FROM author WHERE id = ?", [req.session.passport.user], (err2, result2) => {
                if (err2) throw err3

                req.session.regenerate(() => {
                    res.redirect('/auth/login');
                });
            })
        })
    })
}

module.exports = {
    login,
    logout,
    register,
    registerProcess,
    read,
    update, 
    updateProcess,
    deleteProcess
}