/**
 * El objetivo de este tipo de archivos es crear modelos que representen a las colecciones de la base de datos.
 * Es importante crear modelos para cada colección que exista en la base de datos.
 * Se requiere usar Schema de mongoose para llevar a cabo la creación de este modelo.
 * Cuando mongoose guarda un documento de este tipo de modelo, pluraliza el nombre del modelo declarado con mongoose.model() ya que es evidente que se realizarán varios registros usando este modelo.
 * Autor: Jesus Caleb
 */

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
    title : String,
    content : String,
    date : { type: Date, default: Date.now},
    image : String
});

module.exports = mongoose.model('Article', ArticleSchema);
// articles -> guarda documentos de este tipo y con estructura dentro de la colección.