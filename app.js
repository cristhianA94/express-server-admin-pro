// Manejador de errores
var createError = require("http-errors");
// Express
var express = require("express");
// ORM MongoDB
var mongoose = require("mongoose");
// Logs
var logger = require("morgan");
var path = require("path");

/* Middlewares */
// Analiza el encabezado de la cookie y completa las cookies de req.
var cookieParser = require("cookie-parser");

// Import Routes
var indexRouter = require("./routes/index");
var usuarioRouter = require("./routes/users");
// ==========================================

var app = express();

// Conecct BD
mongoose.connect(
    "mongodb://localhost:27017/hospitalDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
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

/* Rutas */
app.use("/", indexRouter);
app.use("/usuario", usuarioRouter);

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