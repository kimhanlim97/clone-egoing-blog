import db from './db.js'

function deleteProcess(request, response) {
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

export default deleteProcess