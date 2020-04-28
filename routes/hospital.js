const express = require("express");
const router = express.Router();

var Hospital = require("../models/hospital");
var verificarToken = require("../middleware/auth");


// ==================================================
// Obtener todos los hospital
// ==================================================
router.get("/", (req, res, next) => {
    // Filtra solo ciertas columnas
    Hospital.find({}).exec((err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: "Error cargando hospitales",
                error: err,
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospital,
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
        usuario: body.usuario
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
                msg: "hospital existente",
                error: err,
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalDB,
            // Quien solicito la peticion
            //hospitalToken: req.hospital,
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
                msg: "hospital actualizado correctamente",
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
        //res.send(hospitalDB)
        res.status(200).json({
            ok: true,
            msg: "hospital borrado",
        });
    });
});

module.exports = router;