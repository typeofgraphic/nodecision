
// require stuff
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

// app setup
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.all('*', function(req, res, next) {
    fs.readFile('raw.json', function (err, data) {
        res.locals.tracking = JSON.parse(data);
        next();
    });
});

app.get('/', function(req, res){
    res.json(res.locals.tracking);
});

app.listen(3000);