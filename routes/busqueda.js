const express = require("express");
const router = express.Router();

var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

// ==================================================
// Busqueda por coleccion
// ==================================================
router.get("/coleccion/:tabla/:busqueda", (req, res, next) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;

    var regex = new RegExp(busqueda, "i");

    var promesa;

    switch (tabla) {
        case "usuarios":
            promesa = buscarUsuarios(regex);
            break;
        case "medicos":
            promesa = buscarMedicos(regex);
            break;
        case "hospitales":
            promesa = buscarHospitales(regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: "Los tipos de busqueda solo son: usuarios, medicos y hospitales",
                error: { msg: "Tipo de tabla/coleccion no válida" },
            });
    }

    promesa.then((data) => {
        res.status(200).json({
            ok: true,
            // toma el valor de la variable
            [tabla]: data,
        });
    });
});

// ==================================================
// Busqueda general
// =================================================
router.get("/todo/:busqueda", (req, res, next) => {
    // Termino de busqueda
    var busqueda = req.params.busqueda;
    // Genera expresion regular: 'i'= insensible a minus y mayus
    var regex = new RegExp(busqueda, "i");

    // Resuelve todas las promesas unidas en un []
    Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex),
    ]).then((respuestas) => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2],
        });
    });
});

// Realiza la busqueda de hospitales de manera asincrona
function buscarHospitales(regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate("usuario", "nombres apellidos email img")
            .exec((err, hospitales) => {
                if (err) {
                    reject("Error al cargar hospitales", err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

// Realiza la busqueda de medicos de manera asincrona
function buscarMedicos(regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ $or: [{ nombres: regex }, { apellidos: regex }] })
            .populate("usuario", "nombres apellidos email img role")
            .populate("hospital")
            .exec((err, medicos) => {
                if (err) {
                    reject("Error al cargar médicos", err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

// Realiza la busqueda de usuarios de manera asincrona
function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({
                $or: [
                    { nombres: regex },
                    { apellidos: regex },
                    { email: regex },
                    { role: regex },
                ],
            },
            "nombres apellidos email img role"
        ).exec((err, usuarios) => {
            if (err) {
                reject("Error al buscar usuario", err);
            } else {
                resolve(usuarios);
            }
        });
    });
}

module.exports = router;