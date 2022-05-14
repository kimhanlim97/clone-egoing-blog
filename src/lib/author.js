const db = require('./template/db.js')
const template = require('./template/template.js')
const loginValidation = require('./template/loginValidation.js')

const info = {
    id: 'rlagksfla123',
    pw: 'khlm8107'
}

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
    , '', req.session.login)
    res.send(html);
}

function loginProcess(req, res) {
    const id = req.body.id;
    const pw = req.body.password;
    if (id === info.id || pw === info.pw) {
        req.session.login = true;
        req.session.user = id;
        res.redirect('/');

        // 0. author 테이블의 비밀번호와 아이디 항목을 추가하는 등 구조를 바꾼다
        // 1. 회원가입 UI와 기능을 만든다
        // 2. 위 'if (id === info.id || pw === info.pw)'문을 id와 pw를 비교하는 쿼리문으로 변경한다
        // 3. autor.js와 post.js의 UI를 설계 및 수정한다.
        // 4. author.js와 post.js의 수정 및 삭제 권한을 해당 사용자만 가능할 수 있게 변경한다
    }
    else {
        res.send('wrong info');
    }
}

function logout(req, res) {
    loginValidation(res, req.session.login, () => {
        req.session.regenerate(() => {
            res.redirect('/');
        });
    })
}

function read(req, res) {
    loginValidation(res, req.session.login, () => {
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
            <form action="/auth/create" method="post">
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
            `, '', req.session.login);
            res.send(html);
        })
    })
}

function createProcess(req, res) {
    loginValidation(res, req.session.login, () => {
        const author = req.body.name;
        const profile = req.body.profile;
        db.query("INSERT INTO author (name, profile) VALUES (?, ?)", [author, profile], (err, data) => {
            if (err) throw err
            res.redirect('/auth');
        })
    })
}

function update(req, res) {
    loginValidation(res, req.session.login, () => {
        db.query("SELECT * FROM author", function(err, authors) {
            if (err) throw err
            db.query("SELECT * FROM author WHERE id = ?", [req.params.authorId], function(err, author) {
                if (err) throw err
        
                const title = "author"
                const list = template.list(req.topicList)
                const authorTag = template.authorTable(authors)
                const html = template.HTML(title, list, 
                    `
                    <h2>Authors</h2>
                    <table>
                        ${authorTag}
                    </table>
                    <form action="/auth/update" method="post">
                        <p>
                            <input type="hidden" name="id" value="${req.params.authorId}">
                        </p>
                        <p>
                            <input type="text" name="name" value="${author[0].name}">
                        </p>
                        <p>
                            <textarea name="profile">${author[0].profile}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `    
                , '', req.session.login)
                res.send(html);
            })
        })
    })
}

function updateProcess(req, res) {
    loginValidation(res, req.session.login, () => {
        const body = req.body
        db.query("UPDATE author SET name = ?, profile = ? WHERE id = ?", 
            [body.name, body.profile, body.id],
            (err, result) => {
                if (err) throw err
                res.redirect('/author');
            }
        )
    })
}

function deleteProcess(req, res) {
    loginValidation(res, req.session.login, () => {
        db.query("DELETE FROM topic WHERE author_id = ? ", [req.body.id], (err1, result1) => {
            if (err1) throw err1
            db.query("DELETE FROM author WHERE id = ?", [req.body.id], (err2, result2) => {
                res.redirect('/auth');
            })
        })
    })
}

module.exports = {
    login,
    loginProcess,
    logout,
    read,
    createProcess,
    update, 
    updateProcess,
    deleteProcess
}