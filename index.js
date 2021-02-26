'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3700;

mongoose.Promise =  global.Promise;
mongoose.connect('mongodb://localhost:27017/portfolio', { useMongoClient: true })
        .then(() => {
            console.log('Conexion a la base de datos establecida');

            // Creacion del servidor
            app.listen(port, () => {
                console.log('Servidor corriendo correctamente en: localhost:3700');
            });

        })
        .catch(err => {
            console.log(err);
        });