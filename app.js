// Requires
var express = require('express');
var mongoose = require('mongoose');


// Inicializar variables
var app = express();


// Conecct BD
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    // Si se detecta algun error en la DB se cancela
    if (err) throw err;
    console.log('Mongo DB: \x1b[36m', 'online');
});


// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: "Peticion realizada correctamente"
    });
});


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server on port \x1b[31m', '3000: \x1b[36m', 'online');
});