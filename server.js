const express = require('express');
const app = express();
const process = require('process')
const exec = require('child_process').exec;
const my_tracer = require('./create-a-tracer');

const AWS = require('aws-sdk');


var node_version;

exec("node -v", function (error, stdout, stderr) {
    node_version = stdout.trim();
});

app.get('/', function (request, response) {
    var output = {'app_name': "Hello Express", 'node_version': node_version, 'env_vars': process.env};
    response.send(output);
});

var port = process.env.PORT || 8000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
