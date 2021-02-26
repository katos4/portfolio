'use strict'

var Project = require('../models/project');

/** libreria fs (file system) de node para trabajar con archivos y poder borrar
 * las imagenes subidas al servidor
 */
var fs = require('fs');
var path = require('path');

function home(req, res){
    return res.status(200).send({
        message: 'Soy la home con otra funcion'
    });
}

function saveProject(req, res){
    var project = new Project();

    var params = req.body;

    project.name = params.name;
    project.description = params.description;
    project.category = params.category;
    project.year = params.year;
    project.langs = params.langs;
    project.image = null;
    project.link = params.link;


    project.save((err, projectStored) => {
        if(err) return res.status(500).send({message: 'Error al guardar'});
    
        if(!projectStored) return res.status(404).send({message: 'No se ha podido guardar el proyecto'});

        return res.status(200).send({project: projectStored});
    });
}

/** Obtener 1 proyecto */
function getProject(req, res){
    var projectId = req.params.id;

    if(projectId == null) return res.status(404).send({message: 'El proyecto no existe'}); 
    

    Project.findById(projectId, (err, project) => {
        if(err) return res.status(500).send({message: 'Error al devolver los datos'});
    
        if(!project) return res.status(404).send({message: 'El proyecto no existe'});
 
        return res.status(200).send({project: project});
    });
}

/** Obtener todos los proyectos */
function getProjects(req, res){

    Project.find({}).sort('-year').exec((err, projects) => {
        if(err) return res.status(500).send({message: 'Error al devolver los datos'});
        
        if(!projects) return res.status(404).send({message: 'No hay proyectos para mostrar'});

        return res.status(200).send({projects})
    });
}

/** Actualizar un proyecto */
function updateProject(req, res){
    var projectId = req.params.id;
    var update = req.body;

    Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdated) => {
        if(err) return res.status(500).send({message: 'Error al actualizar los datos'});
        
        if(!projectUpdated) return res.status(404).send({message: 'No existe el proyecto para actualizar'});

        return res.status(200).send({project: projectUpdated})
    });
}

/** Eliminar un proyecto */
function deleteProject(req, res){
    var projectId = req.params.id;

    Project.findByIdAndRemove(projectId, (err, projectRemoved) => {
        if(err) return res.status(500).send({message: 'Error al borrar el documento'});
        
        if(!projectRemoved) return res.status(404).send({message: 'No existe el proyecto para borrar'});

        return res.status(200).send({project: projectRemoved})
    });
}

/** Subir imagenes al servidor */
function uploadImage(req, res){
    var projectId = req.params.id;
    var fileName = 'Imagen no subida';
    var imagesCollection = [];

    console.log(req.files);
        if(req.files && Array.isArray(req.files.image)){
           // console.log(req.files.image.path)
         let images = req.files.image;

         for(let i = 0; i < images.length; i++){
            // console.log(images[i].path);
             var filePath = images[i].path;
             var fileSplit = filePath.split('/');
             var fileName = fileSplit[1];
             imagesCollection.push(fileName);
            
         }
        
            Project.findByIdAndUpdate(projectId, { $set: {image: imagesCollection } }, {new:true}, (err, projectUpdated) => {
                if(err) return res.status(500).send({message: 'La imagen no se ha subido'});
                if(!projectUpdated) return res.status(404).send({message: 'El proyecto no existe'});
                return res.status(200).send({project: projectUpdated});
            });

        }else if(req.files){
        /** recortar la ruta para obtener solo el nombre de la imagen */
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('/');
        var fileName = fileSplit[1];
        
        // comprobar la extension de la imagen 
        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
            // actualizar campo image de la base de datos con el nuevo nombre de la imagen 
            Project.findByIdAndUpdate(projectId, {image: fileName}, {new:true}, (err, projectUpdated) => {
                if(err) return res.status(500).send({message: 'La imagen no se ha subido'});

                if(!projectUpdated) return res.status(404).send({message: 'El proyecto no existe'});

                return res.status(200).send({
                    project: projectUpdated
                });
            });
        }else{
            fs.unlink(filePath, (err) => {
                return res.status(200).send({message: 'La extension no es válida'});
            });
        }
     
    }else{
        return res.status(200).send({
            message: fileName
        });
    }
}

function getImageFile(req, res){
    // recoger el nombre del archivo que se lo paso por url
    var file = req.params.image;
    // ruta de la imagen
    var path_file = './uploads/' + file;

    fs.exists(path_file, (exists) => {
        if(exists){
            return res.sendFile(path.resolve(path_file))
        }else{
            return res.status(200).send({message: 'No existe la imagen'});
        }
    });

}

//module.exports = controller;

module.exports = {
    home,
    saveProject,
    getProject,
    getProjects,
    updateProject,
    deleteProject,
    uploadImage,
    getImageFile
}