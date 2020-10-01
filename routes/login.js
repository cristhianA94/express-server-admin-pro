const express = require("express");
const router = express.Router();

// Encriptacion 1 via
const bcrypt = require("bcrypt");
// Token
var jwt = require("jsonwebtoken");
// Google SignIn
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

var Usuario = require("../models/usuario");

var mdAutenticacion = require("../middleware/auth");

// ==================================================
// Renovar Token
// ==================================================
router.get("/renovarToken", mdAutenticacion.verificarToken, (req, res) => {

    // Crear token
    var token = jwt.sign({
            usuario: req.usuario,
        },
        process.env.SEED, {
            // Importa config
            expiresIn: process.env.CADUCIDAD,
        }
    );

    res.status(200).json({
        ok: true,
        token: token
    });
});

// ==================================================
// Verificar token
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

// ==================================================
// Login Google
// ==================================================
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
                    menu: obtenerMenu(usuarioDB.role),
                });
            }
        } else {
            // Si el usuario no existe, se crea
            var usuario = new Usuario();
            // Divide el nombre completo
            var nombreSeparado = googleUser.nombres.split(" ");

            usuario.nombres = nombreSeparado[0];
            usuario.apellidos = nombreSeparado[1].concat(" ", nombreSeparado[2]);
            //usuario.nombres = googleUser.nombres;
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
                    id: usuarioNew._id,
                    menu: obtenerMenu(usuario.role),
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
                    msg: "Email incorrecto",
                    error: err,
                });
            }
            // Compara la pass encriptada
            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    msg: "Password incorecta",
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
                usuarioDB.password = ":)";

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role),
                });
            }
        }
    );
});

// Obtiene el menu segun el Role
function obtenerMenu(ROLE) {
    // Menus laterales
    var menu = [{
            titulo: "Principal",
            icono: "mdi mdi-gauge",
            submenu: [
                { titulo: "Dashboard", url: "/dashboard" },
                { titulo: "ProgressBar", url: "/progress" },
                { titulo: "Gráficas", url: "/graficas1" },
                { titulo: "Promesas", url: "/promesas" },
                { titulo: "Rxjs", url: "/rxjs" },
            ],
        },
        {
            titulo: "Mantenimientos",
            icono: "mdi mdi-folder-lock-open",
            submenu: [
                //{ titulo: 'Usuarios', url: '/usuarios' },
                { titulo: "Hospitales", url: "/hospitales" },
                { titulo: "Médicos", url: "/medicos" },
            ],
        },
    ];

    if (ROLE == "ADMIN_ROLE") {
        menu[1].submenu.unshift({ titulo: "Usuarios", url: "/usuarios" });
    }

    return menu;
}

module.exports = router;