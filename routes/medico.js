const express = require("express");
const router = express.Router();

var Medico = require("../models/medico");
var verificarToken = require("../middleware/auth");

// ==================================================
// Obtener todos los medicos
// ==================================================
router.get("/", (req, res, next) => {
    // Paginacion
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .populate("usuario", "nombres apellidos email img")
        .populate("hospital")
        .limit(5)
        .skip(desde)
        .exec((err, medicosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: "Error cargando médicos",
                    error: err,
                });
            }

            Medico.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medico: medicosDB,
                    total: conteo,
                });
            });
        });
});

// ==================================================
// Obtiene un medico
// ==================================================
router.get("/:id", (req, res) => {
    var id = req.params.id;

    Medico.findById(id)
        .populate("usuario", "nombres apellidos email img")
        .populate("hospital")
        .exec((err, medicoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err,
                });
            }
            if (!medicoDB) {
                return res.status(400).json({
                    ok: false,
                    msg: "El médico con el ID: " + id + " no existe",
                    error: "No existe un médico con ese ID"
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoDB,
            });
        });
});

// ==================================================
// Crear un médico
// ==================================================
router.post("/crear", verificarToken.verificarToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombres: body.nombres,
        apellidos: body.apellidos,
        img: body.img,
        usuario: req.usuario,
        hospital: body.hospital, // Se seleccionara el hospital en un select en el Front
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
                msg: "Médico existente",
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
// Actualizar un médico
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
                    msg: "El médico con el ID: " + id + " no existe",
                    error: { msj: "No existe un médico con ese ID" },
                });
            }
            //res.send(medicoDB)
            res.status(200).json({
                ok: true,
                msg: "Medico actualizado correctamente",
                médico: medicoDB,
            });
        }
    );
});

// ==================================================
// Eliminar un médico
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
                msg: "El médico con el ID: " + id + " no existe",
                error: { msj: "No existe un médico con ese ID" },
            });
        }
        res.status(200).json({
            ok: true,
            msg: "Medico borrado",
        });
    });
});

module.exports = router;