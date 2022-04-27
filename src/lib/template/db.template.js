import mysql from 'mysql'

const db = mysql.createConnection({
    host : '',
    user : '',
    password : '',
    database : ''
});
db.connect();

export default db;