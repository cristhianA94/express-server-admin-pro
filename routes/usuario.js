const express = require("express");
const router = express.Router();
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
    Usuario.find({}, "nombres apellidos email img role")
        // Limita el numero de usuarios a mostrar
        .limit(5)
        // Muestra los registros a partir del n° recibido
        // Ejem: si desde = 5, mostrará los usuarios partir del 5
        .skip(desde)
        .exec((err, usuariosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: "Error cargando usuarios",
                    error: err,
                });
            }

            Usuario.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    usuario: usuariosDB,
                    total: conteo,
                });
            });
        });
});

// ==================================================
// Crear un usuario
// ==================================================
router.post("/crear", (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombres: body.nombres,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
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
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            // Quien solicito la peticion
            usuarioToken: req.usuario,
        });
    });
});

// ==================================================
// Actualizar un usuario
// ==================================================
router.put("/:id/actualizar", verificarToken.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findByIdAndUpdate(
        id,
        body, {
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
                    msg: "El usuario con el id" + id + " no existe",
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
                msg: "El usuario con el id" + id + " no existe",
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