const template =  {
  HTML:function(title, list, body, control, login = false){
    if (typeof login !== 'boolean') {
      throw 'wrong parameter'
    }
    const loginFalse = `
      <a href='/auth/login'>login</a>
    `
    const loginTrue = `
      <a href='/auth/logout'>logout</a>
      <a href='/auth'>author</a>
    `
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${login ? loginTrue : loginFalse}
      ${list}
      ${body}
      ${login ? control : ''}
    </body>
    </html>
    `;
  },
  list:function(filelist){
    let list = '<ul>';
    let i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/post/read/${filelist[i].id}">${filelist[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },
  authorList: function(authors, selectedID = null) {
    var authorList = "";
    if (selectedID === null) {
      authors.forEach(function (author) {
        authorList += `<option value="${author.id}">${author.name}</option>`
      })
    }
    else {
      authors.forEach(function (author) {
        if (selectedID === author.id) {
          authorList += `<option value="${author.id}" selected>${author.name}</option>`
        }
        else {
          authorList += `<option value="${author.id}">${author.name}</option>`
        }
      })
    }
    return authorList
  },
  authorTable: function(authors) {
    let authorTag = ''
    authors.forEach(function (author) {
        authorTag += `
            <tr>
                <td>${author.name}</td>
                <td>${author.profile}</td>
                <td><a href="/auth/update/${author.id}">update</a></td>
                <td>
                  <form action="/auth/delete" method="post">
                    <input type="hidden" name="id" value="${author.id}">
                    <input type="submit" value="delete">
                  </form>
                </td>
            </tr>
        `
    })
    return authorTag
  }
}

module.exports = template