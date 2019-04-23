const http = require('http');
const fileSystem = require('fs');

let _404;
fileSystem.readFile('public/404.html', 'utf-8', (err, data) => {
  if (err){
    console.log('error');
  }
  _404 = data;
})

let server = http.createServer();

server.listen(8080, 'localhost');

server.on('request', (message, response) => {
  if (message.method === 'GET'){
    if (message.url === '/' || message.url === '/index.html'){
      fileSystem.readFile('public/index.html', 'utf-8', (err, data) => {
        if (err){
          
          response.write(_404);
          response.end();
          return;
        }
        response.write(data);
        response.end();
      });
    } else {
      fileSystem.readFile(`public/${message.url}`, 'utf-8', (err, data) => {
        if (err){
          response.write(_404);
          response.end();
          return;
        }
        response.write(data);
        response.end();
      });
    }
  }
  if (message.method === 'POST' && message.url.includes('/elements')){
    let x = message.url.substring(message.url.indexOf('?') + 1);
    x = x.split('&');
    x = x.map((item) => {
      return item.split('=')[1];
    })
    fileSystem.writeFile(`public/${x[0]}.html`, `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>The Elements - ${x[0]}</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>${x[0]}</h1>
      <h2>${x[1]}</h2>
      <h3>Atomic number ${x[2]}</h3>
      <p>${x[3]}</p>
      <p><a href="/">back</a></p>
    </body>
    </html>`, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
    let newBody;
    fileSystem.readFile(`public/index.html`, 'utf-8', (err, data) => {
      if (err) throw err;
      //console.log(data);
      let start = data.slice(0, data.lastIndexOf('</li>') + 5);
      let end = data.slice(data.lastIndexOf('</li>') + 5)
      console.log(start);
      console.log(end);
      let link = `<li>
      <a href="/${x[0]}.html">${x[0]}</a>
      </li>`;
      newBody = start + link + end;
      console.log(newBody);
      updateIndex(newBody);
    })
    
    response.writeHead(200, 'OK', {
      'Content-Type' : 'application.json',
    });
    response.write('{ "success" : true }');
    response.end();
  }

  function updateIndex(body){
    fileSystem.writeFile('public/index.html', body, (err) => {
      console.log(err);
    })
  }
});
    

// fs.readFile('/etc/passwd', (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });