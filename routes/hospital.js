const express = require("express");
const router = express.Router();

var Hospital = require("../models/hospital");
var verificarToken = require("../middleware/auth");

// ==================================================
// Obtener todos los hospital
// ==================================================
router.get("/", (req, res, next) => {
    // Paginacion
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        // Filtra solo ciertas columnas
        .populate("usuario", "nombres apellidos email") // Permite acceder a la data completa del usuario
        //.limit(5)
        .skip(desde)
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: "Error cargando hospitales",
                    error: err,
                });
            }
            Hospital.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    hospital: hospitales,
                    total: count,
                });
            });
        });
});

// ==================================================
// Crear un hospital
// ==================================================
router.post("/crear", verificarToken.verificarToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario, // Coge el id del user existente
    });

    hospital.save((err, hospitalDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err,
            });
        }
        if (!hospitalDB) {
            return res.status(400).json({
                ok: false,
                msg: "Hospital existente",
                error: err,
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalDB,
            // Quien solicito la peticion
            hospitalToken: req.usuario,
        });
    });
});

// ==================================================
// Actualizar un hospital
// ==================================================
router.put("/:id/actualizar", verificarToken.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findByIdAndUpdate(
        id,
        body, {
            new: true,
        },
        (err, hospitalDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err,
                });
            }
            if (!hospitalDB) {
                return res.status(400).json({
                    ok: false,
                    msg: "El hospital con el id" + id + " no existe",
                    error: { msj: "No existe un hospital con ese ID" },
                });
            }
            //res.send(hospitalDB)
            res.status(200).json({
                ok: true,
                msg: "Hospital actualizado correctamente",
                hospital: hospitalDB,
            });
        }
    );
});

// ==================================================
// Eliminar un hospital
// ==================================================
router.delete("/:id/eliminar", verificarToken.verificarToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err,
            });
        }
        if (!hospitalDB) {
            return res.status(400).json({
                ok: false,
                msg: "El hospital con el id" + id + " no existe",
                error: { msj: "No existe un hospital con ese ID" },
            });
        }
        res.status(200).json({
            ok: true,
            msg: "Hospital borrado",
        });
    });
});

module.exports = router;