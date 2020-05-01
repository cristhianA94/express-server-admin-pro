const express = require("express");
const router = express.Router();

// Encriptacion 1 via
const bcrypt = require("bcrypt");
// Token
var jwt = require("jsonwebtoken");
// Google
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

var Usuario = require("../models/usuario");

// ==================================================
// Login Google
// ==================================================
async function verify(token) {
    var ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    var payload = ticket.getPayload();
    //const userid = payload['sub'];
    return {
        nombres: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
        payload,
    };
}

router.post("/google", async(req, res) => {
    var token = req.body.token;
    // Verifica token de Google Auth
    var googleUser = await verify(token).catch((err) => {
        return res.status(403).json({
            ok: false,
            msg: "Token no valido",
        });
    });

    // Busca si existe el email en la BD
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: "Error al buscar usuario",
                erros: err,
            });
        }
        // Si el usuario existe
        if (usuarioDB) {
            // Si el usuario ya esta registrado normalmente
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    msg: "Usuario ya registrado, debe usar su autenticacion normal",
                });
                // Sino se registra el nuevo usuario con datos de Google
            } else {
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
            }
        } else {
            // Si el usuario no existe, se crea
            var usuario = new Usuario();
            //var nombreCompleto = googleUser.nombres.split(" ");
            //usuario.nombres = nombreCompleto.shift();
            //usuario.apellidos = nombreCompleto[0].concat(' ', nombreCompleto[1]);
            usuario.nombres = googleUser.nombres;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ":)";

            usuario.save((err, usuarioNew) => {
                // Crear token
                var token = jwt.sign({
                        usuario: usuarioNew,
                    },
                    process.env.SEED, {
                        // Importa config
                        expiresIn: process.env.CADUCIDAD,
                    }
                );

                res.status(200).json({
                    ok: true,
                    usuario: usuarioNew,
                    token: token,
                });
            });
        }
    });
});

// ==================================================
// Login normal
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
            }
        }
    );
});

module.exports = router;