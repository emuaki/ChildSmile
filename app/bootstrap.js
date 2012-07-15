var express = require('express');
var app = express.createServer(), io = require('socket.io').listen(app);
var port = process.env.PORT || 3000;
app.listen(port);

var ejs = require('ejs');

console.log(__dirname);

app.use(express.static(__dirname + '/../public'));
function compile(str, path){
    console.log(path);
    return stylus(str)
        .set('filename', path)
        .use(nib());
}

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    res.render('mobile/index.ejs');
});

