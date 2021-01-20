'use strict'

// Cargar módulos de node para crear el servidor web.

var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar la dependencia "express" (http)
var app = express();

// Cargar ficheros de las rutas.
var article_routes = require('./routes/article');

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Añadir prefijos a rutas  | Cargar rutas
app.use('/api', article_routes);

// making static page folder
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile('public/index.html', {root: __dirname});
});

// Exportar modulo (fichero actual)
module.exports = app; 