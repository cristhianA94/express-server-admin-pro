const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        // Valida la sensibilidad del registro
        uniqueCaseInsensitive: true,
        required: [true, "El nombre es requerido"]
    },
    img: {
        type: String,
        required: false,
    },
    // Relacion
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    },
}, { collection: 'hospitales' }); // Crea el nombre de la collecion indicado


hospitalSchema.plugin(uniqueValidator, { message: "{PATH} debe ser único" });

module.exports = mongoose.model("Hospital", hospitalSchema);