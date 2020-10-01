var jwt = require("jsonwebtoken");

// ==================================================
// Verificar token
// ==================================================
exports.verificarToken = (req, res, next) => {
    var token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                msg: "¡Token inválido!",
                error: err,
            });
        }

        req.usuario = decoded.usuario;
        // Si se valida deja paso a todas las peticioes HTTP de abajo
        next();
    });
};

// ==================================================
// Verificar ADMIN
// ==================================================
exports.verificarAdminRole = (req, res, next) => {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            msg: "¡Token inválido - No es administrador!",
            error: { message: 'No es administrador, no puede acceder aquí.' }
        });
    }
};

// ==================================================
// Verificar ADMIN o Mismo usuario
// ==================================================
exports.verificarAdmin_MismoUsuario = (req, res, next) => {

    var usuario = req.usuario;
    var id = req.params.id;

    // Permite editar perfil al usuario logueado
    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            msg: "¡Token inválido - No es administrador ni es el mismo usuario!",
            error: { message: 'No es administrador y no es su usuario, no puede acceder aquí.' }
        });
    }
};