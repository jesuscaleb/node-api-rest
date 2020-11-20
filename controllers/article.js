"use strict";

// Importar validator

var validator = require("validator");
var Article = require("../models/article");

// Importar FileSystem y Path para la gestión de ficheros.
var fs = require('fs');
var path = require('path');

var controller = {
  getData: (req, res) => {
    return res.status(200).send({
      name: "Jesus Caleb",
      lastname: "Oria Bastos",
      age: 23,
      github: "github.com/jesuscaleb",
    });
  },

  postData: (req, res) => {
    var message = req.body.message;

    return res.status(200).send({
      message,
    });
  },

  save: (req, res) => {
    // Recoger parámetros por POST
    var params = req.body;

    // Validar datos (validator)
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Missing parameters data.",
      });
    }

    if (validate_title && validate_content) {
      // Crear objeto a guardar
      var article = new Article();

      // Asignar valores al objeto
      article.title = params.title;
      article.content = params.content;
      if(params.image){
		    article.image = params.image;
	    } else {
		    article.image = null;
	    }

      // Guardar el articulo
      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "error",
            message: "Article has not been saved.",
          });
        }

        // Devolver una respuesta
        return res.status(200).send({
          status: "success",
          article: articleStored,
          message: "Article has been saved successfully"
        });
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "Invalid data.",
      });
    }
  },

  getArticles: (req, res) => {
    
    var query = Article.find({});
    var last = req.params.last;

    // Desplegar últimos artículos y limitar el número de resultados al recibir el parámetro opcional en la URL.
    if(last || last != undefined){
        query.limit(5);
    }

    // Desplegar articulos y filtrando resultados por id de forma descendente
    query.sort("-_id").exec((err, articles) => {
      // Error al devolver los articulos
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error when displaying articles.",
        });
      }

      if (!articles) {
        return res.status(404).send({
          status: "error",
          message: "No articles to show.",
        });
      }

      return res.status(200).send({
        status: "success",
        articles,
      });
    });
  },
  getArticle : (req, res)=>{
    // Recoger el parámetro id de la URL  
    var articleId = req.params.id;
    // Comprobar que existe 
    if (!articleId || articleId == null) {
        return res.status(404).send({
            status: "error",
            message: "Article does not exist.",
        });
    }
    // Desplegar artículo según búsqueda de id
    Article.findById(articleId, (err, article)=>{
        if (err) {
            return res.status(500).send({
                status: "error",
                message: "Error when displaying article.",
            });
        }

        if (!article) {
            return res.status(404).send({
                status: "error",
                message: "Article does not exist.",
            });
        }

        return res.status(200).send({
            status: "success",
            article
        });
    });
  },
  update : (req, res)=>{
    // Recoger el id del articulo por la URL
    var articleId = req.params.id;
    // Recoger los parámetros del request PUT en la URL
    var params = req.body;
    // Validar datos
    try {
        var validate_title = !validator.isEmpty(params.title);
        var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
        return res.status(200).send({
            status : 'error',
            message: "Missing parameters data."
        });
    }

    if (validate_title && validate_content) {
        /**
         * Encontrar articulo por id y luego actualizarlo en la base de datos y finalmente, desplegar el artículo actualizado como resultado de la query. A continuación se explican los parámetros:
         * {_id: articleId} => Se establece el valor de la id que pertenece a la colección seleccionada para actualizar
         * params => Se establece los valores de la propiedades que tomará la colección seleccionada para actualizar.
         * {new: true} => Este parámetro permite imprimir la colección seleccionada actualizada.
        */
        
        Article.findByIdAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdated)=> {
            if (err) {
                return res.status(500).send({
                    status : 'error',
                    message: "Error when updating article."
                });
            }

            if (!articleUpdated) {
                return res.status(404).send({
                    status : 'error',
                    message: "Article does not exist."
                });
            }

            return res.status(200).send({
                status: "success",
                article : articleUpdated,
                message: "Article has been updated successfully"
            });
        });
    } else {
        // Devolver respuesta
        return res.status(200).send({
            status : 'error',
            message: "Invalid data."
        });
    }
  },
  delete : (req, res)=>{
    // Recoger el id del articulo
    var articleId = req.params.id;

    // Encontrar el articulo por id y eliminar la colección.
    Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
        if(err){
            return res.status(500).send({
                status: "error",
                message : "Error when deleting article."
            });
        }

        if (!articleRemoved) {
            return res.status(404).send({
                status: "success",
                message : "Article does not exist."
            });
        }

        return res.status(200).send({
            status: "success",
            article: articleRemoved,
            message: "Article has been removed successfully"
        });
    });
    
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
  getImage : (req, res) => {

    var file = req.params.image;
    var path_file = "./upload/articles/" + file;

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
  }, // end get image
  search : (req, res) => {
    // Usar el parámetro del url
    var searchString = req.params.search;
    // Find "OR" . Construyendo la query.
    Article.find({ "$or": [
      {'title': {'$regex' :  searchString, "$options" : "i"}},
      {'content': {'$regex' :  searchString, "$options" : "i"}}
    ]})
    .sort([['date', 'descending']])
    .exec((err, articles) => {
      if (err) {
        return res.status(500).send({
          status : 'error',
          message : 'Query error.'
        });
      } 

      if (!articles || articles.length <= 0) {
        return res.status(200).send({
          status : 'error',
          message : 'No results found.'
        });
      } 

      return res.status(200).send({
        status : 'success',
        articles
      });
    });
  }
}; // end controller

module.exports = controller;
