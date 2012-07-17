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

app.use(express.bodyParser({uploadDir:'/tmp'}));

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    res.render('mobile/index.ejs');
});

var fs = require('fs');
app.all('/upload', function(req, res){
    console.log('upload start');
    console.log(req.files.file.path);
    var tmp_path = req.files.file.path;

    var sockets = io.sockets;
    sockets.emit("uploaded", {imagePath: tmp_path});
    res.send('File uploaded to: ' + tmp_path + ' - ' + req.files.file.size + ' bytes');
});

app.get('/getImage', function(req, res){
    console.log('call getImage');
    var imagePath = req.query.imagePath;
    fs.readFile(imagePath, function(err, data){
	res.send(data, { 'Content-Type': 'image/jpeg' }, 200);
    });
});