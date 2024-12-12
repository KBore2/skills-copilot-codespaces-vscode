// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const comments = require('./comments.json');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/comments') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(comments));
    } else if (req.method === 'POST' && req.url === '/comments') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newComment = JSON.parse(body);
            comments.push(newComment);
            fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments, null, 2), (err) => {
                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('Server Error');
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify(newComment));
                }
            });
        });
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});