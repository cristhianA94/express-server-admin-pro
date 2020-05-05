var express = require("express");
var router = express.Router();

const path = require("path");
const fs = require("fs");
// ==================================================
// Buscar imagenes
// ==================================================
router.get("/:tipo/:img", (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    // Especifica ruta relativa de la imagen
    // params __dirname: path actual
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, "../assets/no-img.jpg");
        res.sendFile(pathNoImagen);
    }

});

module.exports = router;