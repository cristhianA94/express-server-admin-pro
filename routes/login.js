require("../config/config");
const express = require("express");
const router = express.Router();
// Encriptacion 1 via
const bcrypt = require("bcrypt");

// Token
var jwt = require("jsonwebtoken");

var Usuario = require("../models/usuario");

// ==================================================
// Login
// ==================================================
router.post("/", (req, res) => {
    var body = req.body;

    Usuario.findOne({
            email: body.email,
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
                    msg: "Credenciales incorectas - email",
                    error: err,
                });
            }
            // Compara la pass encriptada
            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    msg: "Credenciales incorectas - password",
                    error: err,
                });
            } else {
                // Crear token
                var token = jwt.sign({
                        usuario: usuarioDB,
                    },
                    process.env.SEED, { // Importa config
                        expiresIn: process.env.CADUCIDAD,
                    }
                );

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                });
            }
        }
    );
});

module.exports = router;