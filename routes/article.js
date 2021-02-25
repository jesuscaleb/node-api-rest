'use strict'

const express = require('express');
const router = express.Router();
// Path (necesario para conseguir la extensión del fichero)
const path = require('path');
const ArticleController = require('../controllers/article');
const FileController = require('../controllers/file');

const article_dirname = './upload/articles';

let md_upload = FileController.storeFilesTo(article_dirname);

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
router.post('/upload-image/:id?', md_upload.single('file0'), FileController.upload);
router.get('/get-image/:image', (req,res) => {
	FileController.getFile(req, res, article_dirname)
});
router.get('/search/:search', ArticleController.search);

module.exports = router;