const mongoose = require("mongoose");

const uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombres: {
        type: String,
        required: [true, "Los nombres son requeridos"],
    },
    apellidos: {
        type: String,
        required: [true, "Los apellidos son requeridos"],
    },
    img: {
        type: String,
        required: false,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El id del hospital es obligatorio'],
    },
}, { collection: 'medicos' });

medicoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Medico', medicoSchema);