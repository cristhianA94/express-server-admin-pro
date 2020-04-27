const mongoose = require("mongoose");
// Agrega validación previa al guardado para
// campos únicos dentro de un Schema.
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombres: {
        type: String,
        required: [true, "Los nombres son requeridos"],
    },
    apellidos: {
        type: String,
        required: [true, "Los apellidos son requeridos"],
    },
    email: {
        type: String,
        unique: true,
        // Valida la sensibilidad del registro
        uniqueCaseInsensitive: true,
        required: [true, "El email es requerido"],
    },
    password: {
        type: String,
        required: [true, "La contraseña es requerida"],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        // Valor por defecto
        default: 'USER_ROLE',
        enum: rolesValidos
    }
});


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);

/*
let userschema = new Schema({

    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Rol',
        required: [true, "El nombre es Requerido"]
    }
});

userschema.methods.toJSON = function() {
    let user = this
    let user_object = user.toObject()
    delete user_object.password
    return user_object
}; */