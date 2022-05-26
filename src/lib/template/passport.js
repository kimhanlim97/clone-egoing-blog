module.exports = function (app, loginProcessURL) {
    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy
    const bcrypt = require('bcrypt');

    const db = require('./db.js');

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new LocalStrategy({
            usernameField: 'id',
            passwordField: 'password'
        },
        function (username, password, done) {

            const id = username;
            const pw = password;

            db.query('SELECT * FROM author WHERE user_id = ?', [id], (err, data) => {
                if (data.length === 0) {
                    return done(null, false, {message: 'Incorrect ID'})
                }
                else {
                    const pwMatch = bcrypt.compareSync(password, data[0].user_pw)
                    if (!pwMatch) {
                        return done(null, false, {message: 'Incorrect PW'})
                    }
                    else {
                        return done(null, data[0])
                    }
                }
            })
        })
    )

    app.post(loginProcessURL, 
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: loginProcessURL
        })
    )
}
