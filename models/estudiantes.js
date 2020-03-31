const mongoose = require('mongoose');

const estudiante = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mail: String,
    verificado: Boolean,
    nombre: String,
    apellido: String
});

module.exports = mongoose.model("Estudiante", estudiante)