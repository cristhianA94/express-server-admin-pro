# Backend Server For [Admin-pro-app](https://github.com/cristhianA94/admin-pro-app)

Backend made in Node + Express + MongoDB.

- CRUD usuarios/medicos/hospitales a través de un token.
- Subida de archivos
- Validación de imágenes
- Obtener imágenes
- Paginar resultados
- Búsqueda general y específica
- Controladores

## Getting Started 🚀

### Model Relational


![BD-relational](https://user-images.githubusercontent.com/24251638/80780356-4e832800-8b34-11ea-93a3-14c80f8dcf75.png)

### Endpoints

- GetAll: {modelo}/
- GetOne: {modelo}/id
- POST: {modelo}/crear
- UPDATE: {modelo}/id/actualizar
- DELETE: {modelo}/id/eliminar
- Upload files: uploads/{modelo}/id
- Login: login/
- Login Google: login/google
- Búsqueda total: busqueda/todo/
- Busqueda específica: busqueda/coleccion/
- Imagenes: img/{modelo}/

Documentation API 📃: [POSTMAN](https://documenter.getpostman.com/view/7403922/SzmZbKvT?version=latest)

#

### Prerequisites 📋

Configuraciones de la BD se encuentra en:

```
config/
```

- Debe crear el archivo config.env
- Dentro iran las siguientes variables

```
// DB Keys: development and production
DB_URL=urlLocalhost
HOST=urlHosting

// SEED token
SEED=clave-cualquiera

// CADUCIDAD
CADUCIDAD=30d

// GoogleAuth KEYS
// Crear ID cliente en: https://console.cloud.google.com/apis/credentials
CLIENT_ID=IDKeys

//Puerto
PORT=3000
```

### Installing 🔧

Instalar node modules:

```
npm install
```

### Run modo desarrollador:

```
npm run desarrollo
```

### Run:

```
npm start
```

## Deployment 📦

[Heroku](https://admin-pro-express.herokuapp.com/)
️

## Built With ️️🛠️

- [Node](https://nodejs.org/es/)
- [ExpressJS](https://expressjs.com/es/) - Permite crear un servidor fácilmente
- [MongoDB](https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_footprint_row_search_brand_atlas_desktop&utm_term=mongo&utm_medium=cpc_paid_search&utm_ad=e&gclid=Cj0KCQjw7qn1BRDqARIsAKMbHDaw5M3SrwLztEDVlVeBfJToE9s19PpkBTXNA84IItYumTeLrF21kqIaAgotEALw_wcB) - BD no relacional
- [Mongoose](https://mongoosejs.com/) - ORM para Node de MongoDB
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Permite encriptacion de una sola vía
- [express-fileupload](https://www.npmjs.com/package/express-fileupload) - Permite manejar archivos en servidor

## Versioning 📌

Last Release [V1.1.1](https://github.com/cristhianA94/express-server-admin-pro/releases/tag/V1.1.1)

## Authors ️

  **Cristhian Andrés Apolo Cevallos** - [GitHub](https://github.com/cristhianA94/)