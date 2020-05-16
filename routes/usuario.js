const express = require("express");
const router = express.Router();

// Token
var jwt = require("jsonwebtoken");
// Encriptacion 1 via
const bcrypt = require("bcrypt");

var Usuario = require("../models/usuario");
var verificarToken = require("../middleware/auth");

// ==================================================
// Obtener todos los usuarios
// ==================================================
router.get("/", (req, res, next) => {
    // Paginacion
    var desde = req.query.desde || 0;
    desde = Number(desde);

    // Filtra solo ciertas columnas
    Usuario.find({}, "nombres apellidos email img role google")
        // Limita el numero de usuarios a mostrar
        .limit(5)
        // Muestra los registros a partir del n° recibido
        .skip(desde)
        .exec((err, usuariosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: "Error cargando usuarios",
                    error: err,
                });
            }

            Usuario.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    usuario: usuariosDB,
                    total: conteo,
                });
            });
        });
});

// ==================================================
// Obtiene un usuario
// ==================================================
router.get("/:id", (req, res) => {
    var id = req.params.id;

    Usuario.findById(id).exec((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err,
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario con el ID: " + id + "no existe.",
                error: "No existe un usuario con ese ID.",
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
        });
    });
});

// ==================================================
// Crear un usuario
// ==================================================
router.post("/crear", (req, res) => {
    var body = req.body;

    var usuarioGuardar = new Usuario({
        nombres: body.nombres,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    usuarioGuardar.save((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err,
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario existente",
                error: err,
            });
        }

        // Crear token
        var token = jwt.sign({
                usuario: usuarioDB,
            },
            process.env.SEED, {
                // Importa config
                expiresIn: process.env.CADUCIDAD,
            }
        );
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
        });
    });
});

// ==================================================
// Actualizar un usuario
// ==================================================
router.put("/:id/actualizar", verificarToken.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    req.body.password = bcrypt.hashSync(body.password, 10);

    Usuario.findByIdAndUpdate(
        id,
        body, {
            new: true, // true para devolver el documento modificado
            //omitUndefined: true
        },
        (err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err,
                });
            }
            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    msg: "El usuario con el ID: " + id + " no existe",
                    error: { msj: "No existe un usuario con ese ID" },
                });
            }
            res.status(200).json({
                ok: true,
                msg: "Usuario actualizado correctamente",
                usuario: usuarioDB,
            });
        }
    );
});

// ==================================================
//  Actualiza solo el rol
// ==================================================
router.put("/:id/actualizarRol", verificarToken.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findByIdAndUpdate(
        id, { role: body.role }, {
            new: true, // true para devolver el documento modificado
        },
        (err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err,
                });
            }
            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    msg: "El usuario con el ID: " + id + " no existe",
                    error: { msj: "No existe un usuario con ese ID" },
                });
            }
            res.status(200).json({
                ok: true,
                msg: "Usuario actualizado correctamente",
                usuario: usuarioDB,
            });
        }
    );
});

// ==================================================
// Eliminar un usuario
// ==================================================
router.delete("/:id/eliminar", verificarToken.verificarToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err,
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario con el ID: " + id + " no existe",
                error: { msj: "No existe un usuario con ese ID" },
            });
        }
        res.status(200).json({
            ok: true,
            msg: "Usuario borrado",
        });
    });
});

module.exports = router;