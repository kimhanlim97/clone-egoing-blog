import db from './db.js'

function deleteAuthorProcess(request, response) {
    var body = ''

    request.on('data', function(data) {
        body = body + data;
    })

    request.on('end', function() {
        var id = new URLSearchParams(body).get('id');
        db.query("DELETE FROM topic WHERE author_id = ?", [id], function(err, res) {
            if (err) {
                throw err
            }
            db.query("DELETE FROM author WHERE id = ?", [id], function(err, res) {
                if (err) {
                    throw err
                }
                response.writeHead(302, {Location: '/author'})
                response.end();
            })
        })
    })
}

export default deleteAuthorProcess