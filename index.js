'use strict'

var mongoose = require('mongoose');
var https = require('https');
var fs = require('fs');
var app = require('./app');
var port = process.env.PORT || 3700;

mongoose.Promise =  global.Promise;
mongoose.connect('mongodb://localhost:27017/portfolio')
        .then(() => {
            console.log('Conexion a la base de datos establecida');

            //crear servidor https
           /* https.createServer(
                {
                key: fs.readFileSync('privkey.pem'),
                cert: fs.readFileSync('cert.pem'),
                }, 
                app
            ).listen(port, () => {
                console.log('Servidor HTTPs corriendo en: localhost:3700');
            });*/
            // Creacion del servidor http normal
            app.listen(port, () => {
                console.log('Servidor HTTP corriendo en: localhost:3700');
            });

        })
        .catch(err => {
            console.log(err);
        });