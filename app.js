'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

/** ARCHIVOS DE RUTAS */
var project_routes = require('./routes/project');


/** MIDDLEWARES  */
    // todo lo que llegue en el cuerpo por post lo convertirá a json
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/** CORS */

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

/** RUTAS */
app.use('/', express.static('client', {redirect: false}));
app.use('/api', project_routes);

app.get('*', function(req, res, next){
    res.sendFile(path.resolve('client/index.html'));
});

/** EXPORTAR */
module.exports = app;