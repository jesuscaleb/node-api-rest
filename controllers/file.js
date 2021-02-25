"use strict";
// Multipart (multer)
const multer = require('multer');
// Importar FileSystem y Path para la gestión de ficheros.
const fs = require('fs');
const path = require('path');

const globalService = require('../services/globalService');

const _file = {
  storeFilesTo : (dir) => {
    // Multer Storage => Gestiona los ficheros y el nombre del archivo
    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, dir)
      },
      filename: function (req, file, cb) {
        const file_extension = path.extname(file.originalname);
        
        cb(null, globalService.uniqueSuffix + file_extension) //Nombre del archivo
      }
    });
    let md_upload = multer({ storage: storage });
    return md_upload;
  },
  upload : (req, res)=> {
    // Configurar el módulo connect multiparty router/article.js
    if (!req.file) {
      return res.status(404).send({
        status : "error",
        message : 'Image not uploaded.'
      });
    }
    // Conseguir nombre y la extensión del archivo
    var file_path = req.file.path;
    var file_split = file_path.split('\\');

    // ADVERTENCIA: En Linux o Mac 
    //     var file_split = file_path.split('/');
    
    // Nombre del archivo
    var file_name = file_split[2];
    
    // Extension del fichero
    var extension_split = file_name.split('\.');
    var file_ext = extension_split[1];

    // Comprobar la extensión, solo imagenes, si es valida borrar el fichero
    if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
      // Borrar el archivo subido usando libreria FileSystem

      fs.unlink(file_path, (err)=> {
        return res.status(200).send({
          status : 'error',
          message : 'File extension is not valid.'
        });
      })

    }else{

      return res.status(200).send({
        status : 'success',
        image: file_name,
        message: "File has been uploaded successfully"
      });

    }   
  }, // end upload file
  getFile : (req, res, dir) => {

    var file = req.params.image;
    var path_file = dir + file;

    // En Node.js v0.12.x en adelante, fs.exists está obsoleto por la cual se procede con fs.stat.

    fs.stat(path_file, (err, exists) => {
      if(exists) {
        /**
         * Devolver el fichero en crudo para incrustarlo en la etiqueta de imagen.
         * res.sendFile() => Pertenece a la libreria express
         * Resolver la ruta y sacar el fichero como tal
         * path.resolve() => Pertenece a la libreria path 
         */
        return res.sendFile(path.resolve(path_file));
        
      } else if(err.code === 'ENOENT') {
        return res.status(200).send({
          status : 'error',
          message : 'File does not exist.'
        });
      } else {
        return res.status(200).send({
          status : 'error',
          message : 'An error has occured. Code ' + err.code + '.'
        });
      }
    }); 
  }
}

module.exports = _file;