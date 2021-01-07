/**
 * El objetivo de este archivo es conectar con la base de datos.
 * Este archivo trabajará en modo estricto, permite realizar mejores prácticas de JS haciendolo más estricto y activar mejoras con el lenguaje de programación haciendolo más "moderno"
 * Para conectar con la base de datos necesita la url y opciones como parámetros para el método connect
 * useNewUrlParser => Permite usar la nueva sintaxis que incluye mongoose
 * useUnifiedTopology => Permite usar el nuevo motor de topologia que solo es compatible con las recientes      versiones de MongoDB.
 * useFindAndModify => Permite deshabilitar los métodos obsoletos de MongoDB.
 * Estas propiedades son necesarias para evitar problemas de obsolescencia. (https://mongoosejs.com/docs/deprecations.html)
 * mongoose.connect => Esta función de conexión utilizará un callback usando el método then, para ejecutar una validación del estado de conexión para comprobar el suceso de la conexión.
 * Author: JACOB
*/
'use strict'

// Importar y cargar módulos de node_modules y personalizados
var mongoose = require('mongoose');
var app = require('./app');

app.set('port', process.env.PORT || 3900 );
const url = "mongodb+srv://strider:BmgkbN82DWVAB4zg@cluster0.kzadw.mongodb.net/mymongodb?retryWrites=true&w=majority";

// Uso de promesa para evitar fallos al conectarse con la base de datos o usar diferentes módulos de MongoDB
mongoose.Promise = global.Promise;

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false);

mongoose.connect(url)
    .then(()=>{
        console.log("Database connection successful.");

        // Crear servidor web y habilitar recepción de peticiones HTTP
        app.listen(app.get('port'), ()=>{
            console.log("Server running in port: " + app.get('port'));
        });
    });