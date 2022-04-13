import http from 'http'
import url from 'url'

import mysql from 'mysql'
var db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'khlm8107',
    database : 'opentutorials'
});
db.connect();

import template from './lib/template.js'

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    var title = queryData.id
    
    if (pathName === '/') {
        if (queryData.id === undefined) {
            db.query('SELECT * FROM topic', function(err, res) {
                if (err) {
                    throw err
                }
                var title = 'Welcome';
                var description = "Hello, Node.js";
                var list = template.list(res);
                var html = template.HTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
            })
        }
        else {
            db.query('SELECT * FROM topic', function(err, resAll) {
                if (err) {
                    throw err;
                }
                db.query("SELECT * FROM topic WHERE id = ?", [queryData.id], function(err, res) {
                    if (err) {
                        throw err;
                    }
                    var title = res[0].title;
                    var description = res[0].description;
                    var list = template.list(resAll);
                    var html = template.HTML(title, list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a> 
                         <a href="/update?id=${queryData.id}">update</a>
                         <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${queryData.id}">
                            <input type="submit" value="delete">
                         </form>`
                    );
                    response.writeHead(200);
                    response.end(html);
                })
                
            })
        } 
    }
    else if (pathName === '/create') {
        db.query(`SELECT * FROM topic`, function(error, topics){
            var title = 'Create';
            var list = template.list(topics);
            var html = template.HTML(title, list,
              `
              <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
              `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        });
    }
    else if (pathName === '/create_process') {
        var body = ''

        request.on('data', function(data) {
            body = body + data;
        })

        request.on('end', function() {
            var title = new URLSearchParams(body).get('title')
            var description = new URLSearchParams(body).get('description')
            db.query(`INSERT INTO topic (title, description, created, author_id) 
                VALUES (?, ?, NOW(), ?)`,
                [title, description, 1],
                function(err, res) {
                    if (err) {
                        throw err
                    }
                    response.writeHead(302, {Location: `/?id=${res.insertId}`});
                    response.end('success');
                }
            );
        })
    }
    else if (pathName === "/update") {
        db.query("SELECT * FROM topic", function(err1, resAll) {
            if (err1) {
                throw err1
            }
            db.query("SELECT * FROM topic WHERE id = ?", [queryData.id], function(err2, res) {
                if (err2) {
                    throw err2
                }
                var list = template.list(resAll);
                var html = template.HTML(res[0].title, list, 
                    `<form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${res[0].id}"/>
                        <p>
                            <input type="text" name="title" placeholder="title" value="${res[0].title}"/>
                        </p>
                        <p>
                            <textarea name="description" placeholder="description">${res[0].description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${res[0].title}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        })
    }
    else if (pathName === "/update_process") {
        var body = ''

        request.on('data', function(data) {
            body = body + data;
        })

        request.on('end', function() {
            var title = new URLSearchParams(body).get('title')
            var description = new URLSearchParams(body).get('description')
            var id = new URLSearchParams(body).get('id'); 
            db.query("UPDATE topic SET title = ?, description = ? WHERE id = ?", [title, description, id], function(err, res) {
                if (err) {
                    throw err
                }
                response.writeHead(302, {Location: `/?id=${id}`});
                response.end();
            })
        })
    }
    else if (pathName === "/delete_process") {
        var body = ''

        request.on('data', function(data) {
            body = body + data;
        })

        request.on('end', function() {
            var id = new URLSearchParams(body).get('id');
            db.query("DELETE FROM topic WHERE id = ?", [id], function(err, res) {
                response.writeHead(302, {Location: '/'})
                response.end();
            })
        })
    }
    else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);