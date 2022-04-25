const template =  {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control === undefined ? '' : control}
      ${body}
    </body>
    </html>
    `;
  },
  list:function(filelist){
    let list = '<ul>';
    let i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/page/${filelist[i].id}">${filelist[i].title}</a></li>`;
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
                <td><a href="/author/update/${author.id}">update</a></td>
                <td>
                  <form action="/author/delete" method="post">
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

export default template