'use strict'

const express = require('express');
const ArticleController = require('../controllers/article');

const router = express.Router();

// Multipart (multer)
const multer = require('multer');
// Path (necesario para conseguir la extensión del fichero)
const path = require('path');

const uniqueSuffix = () => {
  let now = new Date();
  let date = ("0" + now.getDate()).slice(-2);
  let month = ("0" + (now.getMonth() + 1)).slice(-2);
  let year = now.getFullYear();
  let output = date + month + year;
  
  return output;
}

// Multer Storage => Gestiona los ficheros y el nombre del archivo
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/articles')
  },
  filename: function (req, file, cb) {
  	const file_extension = path.extname(file.originalname);
  	
    cb(null, uniqueSuffix + file_extension) //Nombre del archivo
  }
});

let md_upload = multer({ storage: storage });

// Rutas de prueba
router.get('/getData', ArticleController.getData);
router.post('/postData', ArticleController.postData);
// Rutas de article
router.post('/save', ArticleController.save);
// Parametros adicionales para la URL se identifican agregando un ? después del parámetro
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id?', md_upload.single('file0'), ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;
