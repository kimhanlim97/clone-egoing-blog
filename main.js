import http from 'http'
import fs from 'fs'
import url from 'url'
import path from 'path'
import sanitizeHTML from 'sanitize-html'

import template from './lib/template.js'

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    var title = queryData.id
    
    if (pathName === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function(err, fileList) {
                var title = 'Welcome';
                var description = "Hello, Node.js"
                var list = template.list(fileList);
                var html = template.html(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
            })
        }
        else {
            fs.readdir('./data', function(err, fileList) {
                var filteredID = path.parse(queryData.id).base;              
                fs.readFile(`data/${filteredID}`, 'utf8', function(err, description){
                    var title = queryData.id;
                    var sanitizedTitle = sanitizeHTML(title)
                    var sanitizedDescription = sanitizeHTML(description)
                    var list = template.list(fileList);
                    var html = template.html(sanitizedTitle, list, 
                        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                        `<a href="/create">create</a> 
                         <a href="/update?id=${sanitizedTitle}">update</a>
                         <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="delete">
                         </form>`
                    )
                    response.writeHead(200);
                    response.end(html);
                })
            });
            
        } 
    }
    else if (pathName === '/create') {
        fs.readdir('./data', function(err, fileList) {
            var title = 'WEB - create';
            var list = template.list(fileList)
            var html = template.html(title, list, `
                <form action="http://localhost:3000/create_process" method="post">
                    <p>
                        <input type="text" name="title" placeholder="title">
                    </p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>`,
                ``
            );
            response.writeHead(200);
            response.end(html);
        })
    }
    else if (pathName === '/create_process') {
        var body = ''

        request.on('data', function(data) {
            body = body + data;
        })

        request.on('end', function() {
            var title = new URLSearchParams(body).get('title')
            var description = new URLSearchParams(body).get('description')
            console.log(title, description);
            fs.writeFile(`./data/${title}`, description, 'utf8', function(err) {
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end('success');
            })
        })
    }
    else if (pathName === "/update") {
        fs.readdir('./data', function(err, fileList) {
            var filteredID = path.parse(queryData.id).base;               
            fs.readFile(`data/${filteredID}`, 'utf8', function(err, description){
                var title = queryData.id;
                var list = template.list(fileList);
                var html = template.html(title, list, 
                    `<form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}"/>
                        <p>
                            <input type="text" name="title" placeholder="title" value="${title}"/>
                        </p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                )
                response.writeHead(200);
                response.end(html);
            })
        });
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
            fs.rename(`data/${id}`, `data/${title}`, function(error) {
                fs.writeFile(`./data/${title}`, description, 'utf8', function(err) {
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                })
            }); 
        })
    }
    else if (pathName === "/delete_process") {
        var body = ''

        request.on('data', function(data) {
            body = body + data;
        })

        request.on('end', function() {
            var id = new URLSearchParams(body).get('id');
            var filteredID = path.parse(id).base
            fs.unlink(`./data/${filteredID}`, function(err) {
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