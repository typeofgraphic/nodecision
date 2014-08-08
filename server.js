
// require stuff
var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var RED = require("node-red");
var requestify = require('requestify');

// app setup
var app = express();
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({
//    extended: true
//}));

// node red server setup
// Create a server
var server = http.createServer(app);

// Create the settings object
var settings = {
    httpAdminRoot:"/red",
    httpNodeRoot: "/api"
//    userDir:"/home/nol/.nodered/"
};
// Initialise the runtime with a server and settings
RED.init(server,settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);



// setup static path
app.use(express.static(__dirname + '/public'));

app.use( function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

app.all('/', function(req, res, next) {
    fs.readFile('./node_modules/node-red/raw.json', function (err, data) {
        res.locals.tracking = JSON.parse(data);
        next();
    });
});

app.get('/', function(req, res){
    res.json(res.locals.tracking);
});

app.get('/v1/ie9rlwgarp/analytics.js', function(req, res){
    res.status(200).sendFile('analytics.js', { root: './public'});
});

app.route('/v1/:var')
    .post(function(req, res) {
//        console.log(req.body);
        res.send('processing the login form!');

        requestify.request('http://localhost:3000/api/post/', {
            method: 'POST',
            body: req.body
//            headers: {
//                'X-Forwarded-By': 'me'
//            },
//            cookies: {
//                mySession: 'some cookie value'
//            },
//            auth: {
//                username: 'foo',
//                password: 'bar'
//            },
//            dataType: 'json'
        })
            .then(function(response) {
                // get the response body
                response.getBody();

                // get the response headers
                response.getHeaders();

                // get specific response header
                response.getHeader('Accept');

                // get the code
                response.getCode();

                // get the raw response body
                response.body;
            });
    });


//app.listen(3000);

server.listen(3000);

// Start the runtime
RED.start();