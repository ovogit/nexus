var express = require('express');
var app = express();
app.listen(3000, function () {
})
app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header(
            'Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Api-Key'
            );
    res.header('Access-Control-Allow-Credentials', 'true');
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

// view routes
app.get('/', function(req, res){
    res.sendfile(__dirname + '/dist/index.html');
});
app.get('/scraper', function(req, res){
    res.sendfile(__dirname + '/dist/index.html');
});
app.get('/color', function(req, res){
    res.sendfile(__dirname + '/dist/index.html');
});

// asset routes
app.get('/css/main.css', function(req, res){
    res.sendfile(__dirname + '/dist/css/main.css');
});
app.get('/js/main.js', function(req, res){
    res.sendfile(__dirname + '/dist/js/main.js');
});
