const template =  {
  HTML:function(title, list, body, control, isLogined = false){
    if (typeof isLogined !== 'boolean') {
      throw 'wrong parameter'
    }
    const loginFalse = `
      <a href='/auth/login'>login</a>
      <a href='/auth/register'>register</a>
    `
    const loginTrue = `
      <a href='/auth/logout'>logout</a>
      <a href='/auth'>My Information</a>
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
      ${isLogined ? loginTrue : loginFalse}
      ${list}
      ${body}
      ${isLogined ? control : ''}
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
}

module.exports = template