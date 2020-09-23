const mongoose = require('mongoose');
const estudiante = require('./models/estudiantes.js');
require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-lc5u9.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.MONGO_DATABASE });
var rand = Math.floor(Math.random()*104)
estudiante.findOne().skip(rand).exec(function(err, estudiante){
    if (err){
        console.log(err);
        process.exit(1);
    }
    console.log(`Estudiante para conrtestar: ${estudiante.nombre}, ${estudiante.apellido}`);
    process.exit(0);
})