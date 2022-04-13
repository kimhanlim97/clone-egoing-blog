var template =  {
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
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i].id}">${filelist[i].title}</a></li>`;
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
  }
}

export default template