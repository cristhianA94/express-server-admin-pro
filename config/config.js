// DB
var urlDB;

urlDBDevelopment = "mongodb://localhost:27017/hospitalDB";
urlDBProduction = '';
process.env.URLDB = urlDBDevelopment;

// SEED token
process.env.SEED = process.env.SEED || "seed-secreto";
// CADUCIDAD
process.env.CADUCIDAD = process.env.CADUCIDAD || '30d';
// Google
// Id cliente de: https://console.cloud.google.com/apis/credentials
process.env.CLIENT_ID = process.env.CLIENT_ID || '10805534927-d99niu48bg3iu1ft0icafbmdu1f651ed.apps.googleusercontent.com';