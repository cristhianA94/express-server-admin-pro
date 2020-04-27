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
                msg: '¡Token inválido!',
                error: err,
            });
        }

        req.usuario = decoded.usuario;
        // Si se valida deja paso a todas las peticioes HTTP de abajo
        next();
    });
};