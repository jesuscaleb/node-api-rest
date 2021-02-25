'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = Schema({
    first : String,
    last : String,
    email: String,
    username : String,
    password : String,
    permissions : []
});

module.exports = mongoose.model('User', UserSchema);