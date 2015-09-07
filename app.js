import eio from 'express.io';
import path from 'path';
let app = eio();

app.configure(() => {
    'use strict';
    app.use('/css', eio.static(path.join(__dirname, 'css')));
    app.use('/vendor', eio.static(path.join(__dirname, 'vendor')));
    app.use('/img', eio.static(path.join(__dirname, 'img')));
});

app.http().io();

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});


app.listen(9692);
