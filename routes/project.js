'use strict'

var express = require('express');
const { route } = require('../app');
var ProjectController = require('../controllers/project');

var api = express.Router();

/** Instancia del paquete connect-multiparty para declarar la
 * carpeta donde deben subirse los archivos de imagenes, esto
 * se utiliza como middleware para que funcione el metodo de upload image
 */
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: './uploads'});
// var router = express.Router();

api.get('/home', ProjectController.home);
api.post('/save-project', ProjectController.saveProject);
api.get('/project/:id?', ProjectController.getProject);
api.get('/projects', ProjectController.getProjects);
api.put('/project/:id', ProjectController.updateProject);
api.delete('/project/:id', ProjectController.deleteProject);
api.post('/upload-image/:id', multipartMiddleware, ProjectController.uploadImage);
api.get('/get-image/:image', ProjectController.getImageFile);


// module.exports = router;
module.exports = api;