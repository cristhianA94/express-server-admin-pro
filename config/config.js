/**
 * DB.
 */

var urlDB;

urlDBDevelopment = "mongodb://localhost:27017/hospitalDB";
//urlDBProduction = 'mongodb://admin:admin123@ds263816.mlab.com:63816/sga2';
process.env.URLDB = urlDBDevelopment;
/* if (process.env.NODE_ENV == 'development') {
    urlDB = "mongodb://localhost:27017/hospitalDB";
    process.env.URLDB = urlDB;
} else {
    //urlDB = 'mongodb://admin:admin123@ds263816.mlab.com:63816/sga2';
    urlDB = process.env.MONGO_URI;
} */


/**
 * SEED token.
 */

process.env.SEED = process.env.SEED || "seed-secreto";
// CADUCIDAD
process.env.CADUCIDAD = process.env.CADUCIDAD || '30d';