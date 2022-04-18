import http from 'http'
import url from 'url'

import { detail, home } from './lib/topic.js'
import { create, createProcess } from './lib/create.js'
import { update, updateProcess } from './lib/update.js'
import deleteProcess from './lib/delete.js'
import { show, createAuthorProcess } from './lib/author.js'
import { updateAuthor, updateAuthorProcess } from './lib/authorUpdate.js'
import deleteAuthorProcess from './lib/authorDelete.js'

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    
    if (pathName === '/') {
        if (queryData.id === undefined) {
            home(response);
        }
        else {
            detail(response, queryData);
        } 
    }
    else if (pathName === '/create') {
        create(response);
    }
    else if (pathName === '/create_process') {
        createProcess(request, response);
    }
    else if (pathName === "/update") {
        update(response, queryData);
    }
    else if (pathName === "/update_process") {
        updateProcess(request, response);
    }
    else if (pathName === "/delete_process") {
        deleteProcess(request, response);
    }
    else if (pathName === "/author") {
        show(request, response);
    }
    else if (pathName === "/author/create_process") {
        createAuthorProcess(request, response);
    }
    else if (pathName === "/author/update") {
        updateAuthor(request, response, queryData);
    }
    else if (pathName === "/author/update_process") {
        updateAuthorProcess(request, response);
    }
    else if (pathName === "/author/delete_process") {
        deleteAuthorProcess(request, response);
    }
    else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);