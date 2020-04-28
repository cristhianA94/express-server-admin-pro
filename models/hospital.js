const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        // Valida la sensibilidad a mayusculas del registro
        uniqueCaseInsensitive: true,
        required: [true, "El nombre es requerido"]
    },
    img: {
        type: String,
        required: false,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    },
}, { collection: 'hospitales' });


hospitalSchema.plugin(uniqueValidator, { message: "{PATH} debe ser único" });

module.exports = mongoose.model("Hospital", hospitalSchema);