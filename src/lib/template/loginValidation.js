function loginValidation(res, login, func) {
    if (login === true) {
        func();
    } else {
        res.send('access denied');
    }
};

module.exports = loginValidation