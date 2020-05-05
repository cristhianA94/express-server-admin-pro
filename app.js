// Manejador de errores
var createError = require("http-errors");
// Express
var express = require("express");
// ORM MongoDB
var mongoose = require("mongoose");
// Logs
var logger = require("morgan");
// Config
require("./config/config");
var path = require("path");

/* Middlewares */
// Analiza el encabezado de la cookie y completa las cookies de req.
var cookieParser = require("cookie-parser");
// CORS: https://expressjs.com/en/resources/middleware/cors.html#simple-usage-enable-all-cors-requests
var cors = require("cors");

// Import Routes
var homeRouter = require("./routes/home");
var loginRouter = require("./routes/login");
var usuarioRouter = require("./routes/usuario");
var medicoRouter = require("./routes/medico");
var hospitalRouter = require("./routes/hospital");
var busquedaRouter = require("./routes/busqueda");
var uploadRouter = require("./routes/uploads");
var imagesRouter = require("./routes/imagenes");

var app = express();
// ==========================================

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    // Habilita solo estos metodos
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Conecct BD
mongoose.connect(
    process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    },
    (err, res) => {
        // Si se detecta algun error en la DB se cancela
        if (err) throw err;
        console.log("Mongo DB: \x1b[36m", "online");
    }
);

// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use(logger("dev"));
// Parse application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Server index config
var serveIndex = require("serve-index");
// Permite dejar ver archivos subidos **Quitar para mas privacidad
app.use(express.static(__dirname + "/"));
app.use("/uploads", serveIndex(__dirname + "/uploads"));

/* Rutas */
app.use("/", homeRouter);
app.use("/login", loginRouter);
app.use("/usuarios", usuarioRouter);
app.use("/medicos", medicoRouter);
app.use("/hospitales", hospitalRouter);
app.use("/busqueda", busquedaRouter);
app.use("/uploads", uploadRouter);
app.use("/img", imagesRouter);

/* Manejador de errores */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;