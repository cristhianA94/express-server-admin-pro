const express = require("express");
const router = express.Router();

var Medico = require("../models/medico");
var verificarToken = require("../middleware/auth");


// ==================================================
// Obtener todos los medicos
// ==================================================
router.get("/", (req, res, next) => {
    // Filtra solo ciertas columnas
    Medico.find({}).exec((err, medicos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: "Error cargando medicos",
                error: err,
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicos,
        });
    });
});


// ==================================================
// Crear un medico
// ==================================================
router.post("/crear", verificarToken.verificarToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombres: body.nombres,
        apellidos: body.apellidos,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital,
    });

    medico.save((err, medicoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err,
            });
        }
        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                msg: "Medico existente",
                error: err,
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoDB,
            // Quien solicito la peticion
            usuarioToken: req.usuario,
        });
    });
});


// ==================================================
// Actualizar un medico
// ==================================================
router.put("/:id/actualizar", verificarToken.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findByIdAndUpdate(
        id,
        body, {
            new: true,
        },
        (err, medicoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err,
                });
            }
            if (!medicoDB) {
                return res.status(400).json({
                    ok: false,
                    msg: "El medico con el id" + id + " no existe",
                    error: { msj: "No existe un medico con ese ID" },
                });
            }
            //res.send(medicoDB)
            res.status(200).json({
                ok: true,
                msg: "Medico actualizado correctamente",
                medico: medicoDB,
            });
        }
    );
});


// ==================================================
// Eliminar un medico
// ==================================================
router.delete("/:id/eliminar", verificarToken.verificarToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err,
            });
        }
        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                msg: "El medico con el id" + id + " no existe",
                error: { msj: "No existe un medico con ese ID" },
            });
        }
        //res.send(medicoDB)
        res.status(200).json({
            ok: true,
            msg: "Medico borrado",
        });
    });
});

module.exports = router;