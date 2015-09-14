import eio from 'express.io';
import path from 'path';

let app = eio();
app.http().io();

app.configure(() => {
    'use strict';
    app.use('/css', eio.static(path.join(__dirname, 'css')));
    app.use('/vendor', eio.static(path.join(__dirname, 'vendor')));
    app.use('/img', eio.static(path.join(__dirname, 'img')));
    app.use('/js', eio.static(path.join(__dirname, 'js')));
    app.use('/dist', eio.static(path.join(__dirname, 'dist')));
});

app.get('/test-wiring.html', function(req, res) {
    res.sendfile(__dirname + '/test-wiring.html');
});

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});



app.listen(9692);
