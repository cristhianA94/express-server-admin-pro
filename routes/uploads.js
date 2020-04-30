const express = require("express");
const router = express.Router();

const fileUpload = require("express-fileupload");
// Permite manejear archivos
var fs = require("fs");

var Usuario = require("../models/usuario");
var Medico = require("../models/medico");
var Hospital = require("../models/hospital");

// default options
router.use(fileUpload());

// ==================================================
// Upload files
// ==================================================
router.put("/:tipo/:id", (req, res) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // Valida tipo de coleccion
    var tiposColeccion = ["hospitales", "medicos", "usuarios"];
    if (tiposColeccion.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            msg: "Tipo de colección no válida.",
            error: { msg: "Tipo de colección no válida" },
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: "No hay archivos subidos.",
            error: { msg: "Debe seleccionar la imagen" },
        });
    }
    // Nombre del param del archivo: req = imagen
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split(".");
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    var extensionesValidas = ["png", "jpg", "gif", "jpeg", "jiff"];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            msg: "Extension no valida.",
            error: {
                msg: "Las extensiones válidas son " + extensionesValidas.join(", "),
            },
        });
    }

    // Nombre archivo personalizado
    // 1231da65as8d3as4-123.png
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: "Error al mover el archivo.",
                error: err,
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === "usuarios") {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    msg: "Usuario no existe",
                    errors: err,
                });
            }

            var pathViejo = "../uploads/usuarios/" + usuario.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                return res.status(200).json({
                    ok: true,
                    msg: "Imagen de usuario actualizada",
                    usuario: usuarioActualizado,
                });
            });
        });
    }

    if (tipo === "hospitales") {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    msg: "Hospital no existe",
                    errors: err,
                });
            }

            var pathViejo = "../uploads/hospitales/" + hospital.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    msg: "Imagen de hospital actualizada",
                    hospital: hospitalActualizado,
                });
            });
        });
    }

    if (tipo === "medicos") {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    msg: "Médico no existe",
                    errors: err,
                });
            }

            var pathViejo = "../uploads/medicos/" + medico.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    msg: "Imagen de medico actualizada",
                    medico: medicoActualizado,
                });
            });
        });
    }
}

module.exports = router;

module.exports = router;